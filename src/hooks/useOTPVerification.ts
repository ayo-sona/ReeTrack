import { useState } from "react";
import { authApi } from "@/lib/authAPI";
import { AxiosError } from "axios";

interface UseOTPVerificationReturn {
  // Verify email
  verifyEmail: (email: string, otp: string) => Promise<boolean>;
  verifying: boolean;
  verifyError: string | null;
  verifySuccess: boolean;
  
  // Resend code
  resendCode: (email: string) => Promise<boolean>;
  resending: boolean;
  resendError: string | null;
  resendSuccess: boolean;
  
  // Reset states
  resetErrors: () => void;
}

export function useOTPVerification(): UseOTPVerificationReturn {
  // Verify states
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = useState(false);
  
  // Resend states
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  const verifyEmail = async (email: string, otp: string): Promise<boolean> => {
    setVerifying(true);
    setVerifyError(null);
    setVerifySuccess(false);

    try {
      await authApi.verifyEmail({ email, otp });
      setVerifySuccess(true);
      return true;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || "Invalid or expired OTP. Please try again.";
      setVerifyError(errorMessage);
      return false;
    } finally {
      setVerifying(false);
    }
  };

  const resendCode = async (email: string): Promise<boolean> => {
    setResending(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      await authApi.sendVerificationCode({ email });
      setResendSuccess(true);
      return true;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || "Failed to resend code. Please try again.";
      setResendError(errorMessage);
      return false;
    } finally {
      setResending(false);
    }
  };

  const resetErrors = () => {
    setVerifyError(null);
    setResendError(null);
  };

  return {
    verifyEmail,
    verifying,
    verifyError,
    verifySuccess,
    resendCode,
    resending,
    resendError,
    resendSuccess,
    resetErrors,
  };
}