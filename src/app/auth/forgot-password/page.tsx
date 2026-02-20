"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import Image from "next/image";

type FormState = "email" | "code" | "success";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<FormState>("email");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Please enter your email address"); return; }
    try {
      setLoading(true);
      setError("");
      const response = await apiClient.post("/auth/forgot-password", { email });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.data.message || "Failed to send verification code");
      }
      setFormState("code");
      toast.success("Verification code sent to your email");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !newPassword || !confirmPassword) { setError("Please fill in all fields"); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    try {
      setLoading(true);
      setError("");
      const response = await apiClient.post("/auth/reset-password", {
        email,
        token: code,
        password: newPassword,
      });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.data.message || "Failed to reset password");
      }
      setFormState("success");
      toast.success("Password reset successfully");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 dark:bg-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488] transition-colors disabled:opacity-60w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 dark:bg-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488] transition-colors disabled:opacity-60";

  const labelClass = "block text-sm font-semibold text-[#1F2937] mb-1.5";

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-white"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
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
        <div className="absolute top-[5%] left-[40%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image src="/undraw/relaxing_hammock.svg" alt="" fill className="object-contain" />
        </div>
        <div className="absolute bottom-[35%] right-[25%] w-26 h-26 sm:w-32 sm:h-32 opacity-90">
          <Image src="/undraw/eating_together.svg" alt="" fill className="object-contain" />
        </div>
        <div className="absolute top-[3%] right-[35%] w-20 h-20 sm:w-24 sm:h-24 opacity-85">
          <Image src="/undraw/hot_air_balloon.svg" alt="" fill className="object-contain" />
        </div>
        <div className="absolute top-[30%] right-[20%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image src="/undraw/skateboarding.svg" alt="" fill className="object-contain" />
        </div>
        <div className="absolute top-[44%] left-[27%] w-24 h-24 opacity-90">
          <Image src="/undraw/fitness.svg" alt="" fill className="object-contain" />
        </div>
        <div className="absolute top-[25%] left-[22%] w-22 h-22 sm:w-28 sm:h-28 opacity-85">
          <Image src="/undraw/floating_balloon.svg" alt="" fill className="object-contain" />
        </div>
        <div className="absolute bottom-[10%] left-[25%] w-20 h-20 sm:w-28 sm:h-28 opacity-90">
          <Image src="/undraw/playing_with_dog.svg" alt="" fill className="object-contain" />
        </div>
        <div className="absolute bottom-[10%] right-[24%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image src="/undraw/bike_driving.svg" alt="" fill className="object-contain" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">

            {/* Header */}
            <div className="text-center mb-8">
              <Link
                href="/"
                className="text-2xl font-extrabold bg-gradient-to-r from-[#0D9488] to-[#0B7A70] bg-clip-text text-transparent tracking-tight"
              >
                ReeTrack
              </Link>

              {formState === "success" ? (
                <>
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mt-4 mb-3">
                    <CheckCircle className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#1F2937] mb-1">
                    Password Reset!
                  </h1>
                  <p className="text-[#1F2937]/60 text-sm">
                    Redirecting you to login...
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-[#1F2937] mt-2 mb-1">
                    {formState === "email" ? "Reset your password" : "Check your email"}
                  </h1>
                  <p className="text-sm text-[#1F2937]/60">
                    {formState === "email"
                      ? "Enter your email and we'll send you a verification code"
                      : `We sent a 6-digit code to ${email}`}
                  </p>
                </>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Email form */}
            {formState === "email" && (
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      disabled={loading}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#0D9488] px-4 py-3 text-sm font-bold text-white hover:bg-[#0B7A70] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Verification Code"}
                </button>
              </form>
            )}

            {/* Code + password form */}
            {formState === "code" && (
              <form onSubmit={handleCodeSubmit} className="space-y-5">
                <div>
                  <label htmlFor="code" className={labelClass}>
                    Verification code
                  </label>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                      setError("");
                    }}
                    disabled={loading}
                    className={`${inputClass} text-center text-xl tracking-widest`}
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className={labelClass}>
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                      disabled={loading}
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                      disabled={loading}
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#0D9488] px-4 py-3 text-sm font-bold text-white hover:bg-[#0B7A70] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                <button
                  type="button"
                  onClick={() => { setFormState("email"); setError(""); }}
                  className="w-full text-sm text-[#1F2937]/50 hover:text-[#1F2937] transition-colors"
                >
                  Wrong email? Go back
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-xs text-gray-400">
                  Remember your password?
                </span>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D9488] hover:text-[#0B7A70] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to login
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}