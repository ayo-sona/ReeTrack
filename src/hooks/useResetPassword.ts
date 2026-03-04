import { useState } from "react";
import { authApi, ResetPasswordRequest } from "@/lib/authAPI";
import { AxiosError } from "axios";

interface UseResetPasswordReturn {
  resetPassword: (data: Omit<ResetPasswordRequest, "email"> & { email?: string }) => Promise<boolean>;
  resetting: boolean;
  error: string | null;
  success: boolean;
  resetState: () => void;
}

export function useResetPassword(emailFromUrl?: string): UseResetPasswordReturn {
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = async (data: Omit<ResetPasswordRequest, "email"> & { email?: string }): Promise<boolean> => {
    setResetting(true);
    setError(null);
    setSuccess(false);

    // Use email from URL if not provided in data
    const email = data.email || emailFromUrl;
    
    if (!email) {
      setError("Email is required");
      setResetting(false);
      return false;
    }

    try {
      await authApi.resetPassword({
        email,
        token: data.token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      
      setSuccess(true);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || "Failed to reset password. Please try again.";
      setError(errorMessage);
      return false;
    } finally {
      setResetting(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    resetPassword,
    resetting,
    error,
    success,
    resetState,
  };
}