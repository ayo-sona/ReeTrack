"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Mail, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Logo from "@/components/layout/Logo";
import { useOTPVerification } from "@/hooks/useOTPVerification";

function OTPVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    verifyEmail,
    verifying,
    verifyError,
    verifySuccess,
    resendCode,
    resending,
    resendError,
    resendSuccess,
    resetErrors,
  } = useOTPVerification();

  // Auto-send verification code on mount
  useEffect(() => {
    if (email) {
      console.log("🚀 OTP Page mounted - sending verification code to:", email);
      const sendInitialCode = async () => {
        try {
          const success = await resendCode(email);
          if (success) {
            console.log("✅ Initial verification code sent!");
            setCountdown(60);
          } else {
            console.log("❌ Failed to send initial code");
          }
        } catch (error) {
          console.error("❌ Error sending initial code:", error);
        }
      };
      
      sendInitialCode();
    }
  }, [email]); // Only run once on mount

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Redirect on success
  useEffect(() => {
    if (verifySuccess) {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      
      setTimeout(() => {
        if (redirect === 'org-setup') {
          // User is creating an organization - complete the setup
          router.push("/auth/complete-org-setup");
        } else {
          // Normal user registration - go to login
          router.push("/auth/login");
        }
      }, 2000);
    }
  }, [verifySuccess, router]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Handle paste - distribute across all boxes
    if (value.length > 1) {
      const pastedData = value.replace(/\D/g, "").slice(0, 6); // Remove non-digits, max 6
      const newOtp = ["", "", "", "", "", ""];
      
      // Fill from the beginning, not from current index
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newOtp[i] = pastedData[i];
      }
      
      setOtp(newOtp);
      resetErrors();
      
      // Focus the last filled box
      const lastFilledIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
      return;
    }

    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    resetErrors();

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste event explicitly for better support
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    
    if (pastedData) {
      const newOtp = ["", "", "", "", "", ""];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      resetErrors();
      
      // Focus the last filled box
      const lastFilledIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    
    if (otpValue.length !== 6) {
      return;
    }

    const success = await verifyEmail(email, otpValue);
    
    if (!success) {
      // Clear OTP and refocus on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    const success = await resendCode(email);
    if (success) {
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Email is required for verification</p>
          <Link href="/auth/register">
            <Button variant="secondary">Go to Register</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Diagonal Split Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#F06543] to-[#D85436]"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 55%)" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#0D9488] to-[#0B7A70]"
          style={{ clipPath: "polygon(0 55%, 100% 45%, 100% 100%, 0 100%)" }}
        />
      </div>

      {/* Illustrations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hidden md:block absolute top-[10%] left-[25%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image src="/undraw/walking_call.svg" alt="" fill className="object-contain" />
        </div>
        <div className="hidden md:block absolute bottom-[8%] right-[19%] w-28 h-28 sm:w-36 sm:h-36 opacity-90">
          <Image src="/undraw/knowledge_sharing.svg" alt="" fill className="object-contain" />
        </div>
        <div className="hidden md:block absolute bottom-[34%] left-[23%] w-20 h-20 sm:w-28 sm:h-28 opacity-90">
          <Image src="/undraw/working.svg" alt="" fill className="object-contain" />
        </div>
        <div className="hidden md:block absolute top-[30%] right-[20%] w-20 h-20 sm:w-28 sm:h-28 opacity-90">
          <Image src="/undraw/accept_task.svg" alt="" fill className="object-contain" />
        </div>
        <div className="hidden md:block absolute top-[44%] left-[27%] w-24 h-24 opacity-90">
          <Image src="/undraw/processing.svg" alt="" fill className="object-contain" />
        </div>
        <div className="hidden md:block absolute bottom-[15%] left-[16%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image src="/undraw/mindfulness.svg" alt="" fill className="object-contain" />
        </div>
      </div>

      {/* Main Content */}
      <div
        className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 backdrop-blur-sm bg-white/95">
            {/* Success State */}
            {verifySuccess ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0D9488]/10 mb-4">
                  <CheckCircle className="w-8 h-8 text-[#0D9488]" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mb-2">
                  Email Verified!
                </h1>
                <p className="text-sm sm:text-base text-[#1F2937]/60 mb-6">
                  Your email has been successfully verified. Redirecting to login...
                </p>
                <div className="flex items-center justify-center gap-2 text-[#0D9488]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Redirecting...</span>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <Link href="/">
                      <Logo size={32} />
                    </Link>
                  </div>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0D9488]/10 mb-4">
                    <Mail className="w-8 h-8 text-[#0D9488]" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mb-2">
                    Verify Your Email
                  </h1>
                  <p className="text-sm sm:text-base text-[#1F2937]/60">
                    We sent a 6-digit code to
                  </p>
                  <p className="text-sm sm:text-base font-bold text-[#0D9488] mt-1">
                    {email}
                  </p>
                </div>

                {/* Sending status */}
                {resending && (
                  <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <p className="text-sm text-blue-700">Sending verification code...</p>
                    </div>
                  </div>
                )}

                {/* Success message for resend */}
                {resendSuccess && !resending && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="bg-[#0D9488]/5 border-l-4 border-[#0D9488] p-4 rounded-lg">
                      <p className="text-sm text-[#0D9488]">Verification code sent! Check your email.</p>
                    </div>
                  </motion.div>
                )}

                {/* Error Messages */}
                <AnimatePresence>
                  {(verifyError || resendError) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 overflow-hidden"
                    >
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p className="text-sm text-red-700">{verifyError || resendError}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* OTP Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-[#1F2937] mb-3 text-center">
                      Enter verification code
                    </label>
                    <div className="flex gap-2 sm:gap-3 justify-center">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => { inputRefs.current[index] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onPaste={handlePaste}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          disabled={verifying}
                          className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold text-[#1F2937] bg-white border-2 border-gray-200 rounded-xl focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 focus:outline-none transition-all disabled:opacity-50"
                        />
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    disabled={verifying || otp.join("").length !== 6}
                    className="w-full"
                  >
                    {verifying ? "Verifying..." : "Verify Email"}
                  </Button>
                </form>

                {/* Resend Code */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-[#1F2937]/60 mb-2">
                    Didn't receive the code?
                  </p>
                  {countdown > 0 ? (
                    <p className="text-sm font-semibold text-[#0D9488]">
                      Resend code in {countdown}s
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resending}
                      className="text-sm font-semibold text-[#0D9488] hover:text-[#0B7A70] transition-colors disabled:opacity-50"
                    >
                      {resending ? "Sending..." : "Resend Code"}
                    </button>
                  )}
                </div>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-[#1F2937]/60">
                      Wrong email?
                    </span>
                  </div>
                </div>

                {/* Back to Register */}
                <div className="text-center">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D9488] hover:text-[#0B7A70] transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to register
                  </Link>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function OTPVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
        </div>
      }
    >
      <OTPVerificationForm />
    </Suspense>
  );
}