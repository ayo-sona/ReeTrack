"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/lib/apiClient";
import { getCookie, setCookie } from "cookies-next";
import { getUserRoles } from "@/utils/role-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@heroui/react";

export default function LoginPage() {
  const router = useRouter();
  const token = getCookie("access_token");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // NEW FLAG
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Only redirect if already logged in AND not currently logging in
    if (token && !isRedirecting) {
      router.push("/");
    }
  }, [router, token, isRedirecting]); // ADD isRedirecting dependency

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsRedirecting(true); // PREVENT useEffect interference
    setError(null);

    try {
      const response = await apiClient.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.statusCode === 200) {
        setCookie("access_token", response.data.data.access_token);
        setCookie(
          "user_roles",
          response.data.data.organizations
            ? response.data.data.organizations
                .map((org: any) => org.role)
                .join(",")
            : "",
        );
        localStorage.setItem("userData", JSON.stringify(response.data.data));
        const roles = getUserRoles(response.data.data);

        // Use router.replace instead of router.push for better UX
        if (roles.isMember && roles.isStaff) {
          router.replace("/select-role");
        } else if (!roles.isMember && roles.isStaff) {
          router.replace("/select-org");
        } else {
          router.replace("/member/dashboard");
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Failed to login. Please try again.",
      );
      setIsRedirecting(false); // RESET on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Diagonal Split Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top Coral Section */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#F06543] to-[#D85436]"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 55%)",
          }}
        />
        {/* Bottom Teal Section */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#0D9488] to-[#0B7A70]"
          style={{
            clipPath: "polygon(0 55%, 100% 45%, 100% 100%, 0 100%)",
          }}
        />
      </div>

      {/* Scattered Avatar Illustrations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top center - Relaxing */}
        <div className="absolute top-[5%] left-[40%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/relaxing_hammock.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Top left - Eating together */}
        <div className="absolute bottom-[35%] right-[25%] w-26 h-26 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/eating_together.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Upper right - Hot air balloon */}
        <div className="absolute top-[3%] right-[35%] w-20 h-20 sm:w-24 sm:h-24 opacity-85">
          <Image
            src="/undraw/hot_air_balloon.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Middle right - Skateboarding */}
        <div className="absolute top-[30%] right-[20%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/skateboarding.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Middle left - Fitness */}
        <div className="absolute top-[44%] left-[27%] w-24 h-24 opacity-90">
          <Image
            src="/undraw/fitness.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Middle left lower - Floating love */}
        <div className="absolute top-[25%] left-[22%] w-22 h-22 sm:w-28 sm:h-28 opacity-85">
          <Image
            src="/undraw/floating_balloon.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Bottom center - Walking with dog */}
        <div className="absolute bottom-[10%] left-[25%] w-20 h-20 sm:w-28 sm:h-28 opacity-90">
          <Image
            src="/undraw/playing_with_dog.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Bottom right - Bike riding */}
        <div className="absolute bottom-[10%] right-[24%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/bike_driving.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 backdrop-blur-sm bg-white/95">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
                Welcome Back
              </h1>
              <p className="text-[#1F2937]/60">
                Sign in to continue to ReeTrack
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#1F2937] mb-2"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  startContent={<Mail className="w-4 h-4 text-gray-400" />}
                  classNames={{
                    input: "outline-none",
                    inputWrapper:
                      "bg-gray-50 border border-gray-200 hover:border-[#0D9488] rounded-xl",
                  }}
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#1F2937] mb-2"
                >
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  startContent={<Lock className="w-4 h-4 text-gray-400" />}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  }
                  classNames={{
                    input: "outline-none",
                    inputWrapper:
                      "bg-gray-50 border border-gray-200 hover:border-[#0D9488] rounded-xl",
                  }}
                />
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-semibold text-[#0D9488] hover:text-[#0B7A70] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#1F2937]/60">
                  Don&apos;t have an account?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link
                href="/auth/register"
                className="text-sm font-semibold text-[#0D9488] hover:text-[#0B7A70] transition-colors"
              >
                Create an account →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

