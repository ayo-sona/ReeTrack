import { useState } from "react";
import { authApi, ForgotPasswordRequest } from "@/lib/authAPI";
import { AxiosError } from "axios";

interface UseForgotPasswordReturn {
  sendResetEmail: (email: string) => Promise<boolean>;
  sending: boolean;
  error: string | null;
  success: boolean;
  resetState: () => void;
}

export function useForgotPassword(): UseForgotPasswordReturn {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendResetEmail = async (email: string): Promise<boolean> => {
    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      await authApi.forgotPassword({ email });
      setSuccess(true);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || "Failed to send reset email. Please try again.";
      setError(errorMessage);
      return false;
    } finally {
      setSending(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    sendResetEmail,
    sending,
    error,
    success,
    resetState,
  };
}