"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/lib/apiClient";
import { getCookie, setCookie } from "cookies-next";
import { getUserRoles } from "@/utils/role-utils";
import { Button } from "@/components/ui/button";
import { Input, Spinner } from "@heroui/react";
import Logo from "@/components/layout/Logo";
import { PENDING_JOIN_SLUG_KEY } from "@/lib/joinConstants";
import { useQueryClient } from "@tanstack/react-query";

// ----------------------------------------
// Inner component — uses useSearchParams
// ----------------------------------------

function LoginForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ?redirect=/join/life-fitness
  const redirectParam = searchParams.get("redirect");

  const token = getCookie("access_token");
  const userRoles = getCookie("user_roles")
    ? (getCookie("user_roles") as string).split(",")
    : [];

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    setIsMounting(false);
  }, [token]);

  useEffect(() => {
    if (token && !isRedirecting) {
      if (redirectParam) {
        router.replace(redirectParam);
        return;
      }
      if (
        userRoles.includes("MEMBER") &&
        (userRoles.includes("STAFF") || userRoles.includes("ADMIN"))
      ) {
        router.replace("/select-role");
      } else if (
        !userRoles.includes("MEMBER") &&
        (userRoles.includes("STAFF") || userRoles.includes("ADMIN"))
      ) {
        router.replace("/select-org");
      } else {
        router.replace("/member/dashboard");
      }
    }
  }, [router, token, userRoles, isRedirecting, redirectParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const redirectAfterLogin = async (
    data: any,
    roles: ReturnType<typeof getUserRoles>,
  ) => {
    // If there's a redirect param (e.g. /join/life-fitness), always go there first
    if (redirectParam) {
      router.replace(redirectParam);
      return;
    }

    // Check for a pending join slug saved before auth
    const pendingSlug =
      typeof window !== "undefined"
        ? localStorage.getItem(PENDING_JOIN_SLUG_KEY)
        : null;

    if (pendingSlug) {
      router.replace(`/join/${pendingSlug}`);
      return;
    }

    // Normal role-based redirect
    if (roles.isMember && roles.isOrg) {
      router.replace("/select-role");
      return;
    }
    if (roles.isOrg && !roles.isMember) {
      router.replace("/select-org");
      return;
    }
    router.replace("/member/dashboard");
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsRedirecting(true);
    setError(null);

    try {
      const response = await apiClient.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.statusCode === 200) {
        await queryClient.invalidateQueries({
          queryKey: ["member"],
        });
        setCookie("access_token", response.data.data.access_token);
        setCookie(
          "user_roles",
          response.data.data.organizations
            ? response.data.data.organizations
                .map((org: { role: string }) => org.role)
                .join(",")
            : "",
        );
        localStorage.setItem("userData", JSON.stringify(response.data.data));

        const roles = getUserRoles(response.data.data);
        await redirectAfterLogin(response.data.data, roles);
      }
    } catch (err: any) {
      console.error("Login error:", err.response);
      const { statusCode, message } = err.response.data;
      if (err.response) {
        setError(message);
      } else {
        setError(err.message || "Failed to login. Please try again.");
      }
      setIsRedirecting(false);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Scattered Avatar Illustrations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] left-[40%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/relaxing_hammock.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-[35%] right-[25%] w-26 h-26 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/eating_together.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[3%] right-[35%] w-20 h-20 sm:w-24 sm:h-24 opacity-85">
          <Image
            src="/undraw/hot_air_balloon.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[30%] right-[20%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/skateboarding.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[44%] left-[27%] w-24 h-24 opacity-90">
          <Image
            src="/undraw/fitness.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[25%] left-[22%] w-22 h-22 sm:w-28 sm:h-28 opacity-85">
          <Image
            src="/undraw/floating_balloon.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-[10%] left-[25%] w-20 h-20 sm:w-28 sm:h-28 opacity-90">
          <Image
            src="/undraw/playing_with_dog.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
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
          <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-10 backdrop-blur-sm">
            {isMounting ? (
              <Spinner
                color="default"
                className="w-full flex justify-center items-center"
              />
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <Link href="/">
                      <Logo size={32} />
                    </Link>
                  </div>
                  <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
                    Welcome Back
                  </h1>
                  <p className="text-[#1F2937]/60">
                    {redirectParam
                      ? "Sign in to continue joining the organization"
                      : "Sign in to continue to ReeTrack"}
                  </p>
                </div>

                {error && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
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
                        input:
                          "outline-none focus:outline-none !text-gray-900 dark:!text-gray-100 placeholder:text-gray-400",
                        inputWrapper: "bg-white dark:bg-black",
                      }}
                    />
                  </div>

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
                        input:
                          "outline-none focus:outline-none !text-gray-900 dark:!text-gray-100 placeholder:text-gray-400",
                        inputWrapper: "bg-white dark:bg-black",
                      }}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm font-semibold text-[#0D9488] hover:text-[#0B7A70] transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

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

                <div className="text-center">
                  <Link
                    href={
                      redirectParam
                        ? `/auth/register?redirect=${encodeURIComponent(redirectParam)}`
                        : "/auth/register"
                    }
                    className="text-sm font-semibold text-[#0D9488] hover:text-[#0B7A70] transition-colors"
                  >
                    Create an account →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------
// Page — wraps LoginForm in Suspense because
// useSearchParams() requires it in Next.js 13+
// ----------------------------------------

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner color="success" size="lg" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
