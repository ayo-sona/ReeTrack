import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

// Extend AxiosRequestConfig to include _retry flag
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Define proper type for the queue
interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

const BASE_URL = "https://paypips.onrender.com/api/v1";
// const BASE_URL = "http://localhost:4000/api/v1";

// Prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This sends httpOnly cookies automatically
  // timeout: 30000,
});

/**
 * Request Interceptor
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getCookie("access_token");
    // console.log(token);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response Interceptor
 * Automatically refreshes access token when it expires (401 error)
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig;

    console.log("API Response error", error);

    // If no config, reject immediately
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - Access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for auth endpoints to prevent infinite loops
      if (
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/org/register") ||
        originalRequest.url?.includes("/auth/accept-invite")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true, // Sends refreshToken cookie
          },
        );

        // console.log(response.data.data);
        const { access_token } = response?.data?.data;

        // Update tokens in cookies
        setCookie("access_token", access_token);

        // Server will set new access_token cookie automatically
        processQueue(null); // Tell waiting requests to retry

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        processQueue(new Error("Token refresh failed")); // Reject all waiting requests

        if (typeof window !== "undefined") {
          // Clear local storage items
          localStorage.clear();

          // Delete any cookie
          deleteCookie("access_token");
          deleteCookie("current_role");
          deleteCookie("user_roles");

          // Redirect to login
          window.location.href = "/auth/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    return Promise.reject(error);
  },
);

export default apiClient;
