import { useState } from "react";
import { authApi, LoginRequest, RegisterRequest } from "@/lib/authAPI";
import { AxiosError } from "axios";
import { setCookie } from "cookies-next";

interface UseAuthReturn {
  // Login
  login: (data: LoginRequest) => Promise<boolean>;
  loggingIn: boolean;
  loginError: string | null;

  // Register
  register: (data: RegisterRequest) => Promise<boolean>;
  registering: boolean;
  registerError: string | null;

  // Reset
  resetErrors: () => void;
}

export function useAuth(): UseAuthReturn {
  // Login states
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register states
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const login = async (data: LoginRequest): Promise<boolean> => {
    setLoggingIn(true);
    setLoginError(null);

    try {
      const response = await authApi.login(data);

      // Store token
      // setCookie("access_token", response.access_token, {
      //   maxAge: 60 * 60 * 24 * 7, // 7 days
      // });

      // Store user data
      if (typeof window !== "undefined") {
        localStorage.setItem("userData", JSON.stringify(response.data));
      }

      return true;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Login failed. Please try again.";
      setLoginError(errorMessage);
      return false;
    } finally {
      setLoggingIn(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<boolean> => {
    setRegistering(true);
    setRegisterError(null);

    try {
      await authApi.register(data);

      // ✅ Success! OTP page will handle sending verification code
      return true;
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        statusCode?: number;
      }>;

      // Check if it's a CORS error (network error with no response)
      if (!axiosError.response && axiosError.message === "Network Error") {
        // CORS error - user might have been created on backend
        // Let them proceed to OTP page where they can try to get the code
        console.warn(
          "CORS error detected - user may have been created. Proceeding to OTP page.",
        );
        return true; // ✅ Let them try OTP page
      }

      // Real error from backend
      const errorMessage =
        axiosError.response?.data?.message ||
        "Registration failed. Please try again.";
      setRegisterError(errorMessage);
      return false;
    } finally {
      setRegistering(false);
    }
  };

  const resetErrors = () => {
    setLoginError(null);
    setRegisterError(null);
  };

  return {
    login,
    loggingIn,
    loginError,
    register,
    registering,
    registerError,
    resetErrors,
  };
}
