import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import posthog from "posthog-js";

// Extend AxiosRequestConfig to include _retry flag
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Define proper type for the queue
interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

export const BASE_URL = "https://reetrack-production-852b.up.railway.app/api/v1";
// export const BASE_URL = "http://localhost:4000/api/v1";
// export const BASE_URL = "https://reetrack-production-852b.up.railway.app/api/v1";
// export const BASE_URL = "https://paypips.onrender.com/api/v1";

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
  withCredentials: true, // Sends httpOnly cookies automatically
});

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

        const { current_role, user_roles } = response?.data?.data;

        setCookie("current_role", current_role ? current_role : "MEMBER", {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
        setCookie("user_roles", user_roles ? user_roles : "MEMBER", {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(new Error("Token refresh failed"));

        if (typeof window !== "undefined") {
          localStorage.clear();
          deleteCookie("current_role");
          deleteCookie("user_roles");

          // ✅ Clear PostHog session on forced logout
          posthog.reset();

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
