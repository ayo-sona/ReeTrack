"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Spinner } from "@heroui/react";
import { Mail, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";

type FormState = "email" | "code" | "success" | "error";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<FormState>("email");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Replace with your actual API call
      const response = await apiClient.post("/auth/forgot-password", {
        email,
      });
      console.log(response.data);

      if (response.data.statusCode !== 200) {
        throw new Error(
          response.data.data.message || "Failed to send verification code",
        );
      }

      setFormState("code");
      toast.success("Verification code sent to your email");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!code || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Replace with your actual API call
      const response = await apiClient.post("/auth/reset-password", {
        email,
        token: code,
        password: newPassword,
      });

      if (response.data.statusCode !== 200) {
        throw new Error(
          response.data.data.message || "Failed to reset password",
        );
      }

      setFormState("success");
      toast.success("Password reset successfully");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {formState === "email"
              ? "Reset your password"
              : "Enter verification code"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {formState === "email"
              ? "Enter your email and we'll send you a verification code"
              : "Enter the 6-digit code sent to your email"}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {formState === "success" ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle
                  className="h-5 w-5 text-green-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Password reset successful! Redirecting to login...
                </h3>
              </div>
            </div>
          </div>
        ) : (
          <form
            className="mt-8 space-y-6"
            onSubmit={
              formState === "email" ? handleEmailSubmit : handleCodeSubmit
            }
          >
            <div className="space-y-4 rounded-md shadow-sm">
              {formState === "email" ? (
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    startContent={<Mail className="h-5 w-5 text-gray-400" />}
                    className="w-full px-3 py-2"
                    classNames={{
                      input: "outline-none",
                    }}
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="code" className="sr-only">
                      Verification Code
                    </label>
                    <Input
                      id="code"
                      name="code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Enter 6-digit code"
                      value={code}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        setCode(value);
                      }}
                      className="w-full px-3 py-2 text-center text-xl tracking-widest"
                      classNames={{
                        input: "outline-none",
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="sr-only">
                      New Password
                    </label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2"
                      classNames={{
                        input: "outline-none",
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="sr-only">
                      Confirm Password
                    </label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2"
                      classNames={{
                        input: "outline-none",
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            <div>
              <Button
                type="submit"
                color="primary"
                className="w-full flex justify-center py-2 px-4"
                disabled={loading}
              >
                {loading ? (
                  <Spinner color="success" />
                ) : formState === "email" ? (
                  "Send Verification Code"
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </form>
        )}

        <div className="text-center text-sm">
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:text-primary-600 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
