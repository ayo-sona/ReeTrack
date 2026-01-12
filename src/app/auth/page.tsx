"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { User, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

type UserType = "member" | "organization";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for redirect URL
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  // Handle user type selection
  const selectUserType = (type: UserType) => {
    setUserType(type);
    setError(null);
  };

  // Handle back navigation
  const goBack = () => {
    setUserType(null);
    setError(null);
  };

  // Handle successful authentication
  const handleAuthSuccess = () => {
    router.push(redirectTo);
  };

  // Handle authentication errors
  const handleAuthError = (error: string) => {
    setError(error);
    setIsLoading(false);
  };

  if (userType) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button
            onClick={goBack}
            className="mb-8 text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            ← Back
          </button>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              {userType === "member" ? "Member" : "Organization"} Authentication
            </h2>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="grid gap-4">
              <Link
                href={`/auth/${userType}/login${
                  redirectTo
                    ? `?redirect=${encodeURIComponent(redirectTo)}`
                    : ""
                }`}
                className="group relative p-6 border border-gray-800 hover:border-white transition-all duration-300 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Sign In</h3>
                    <p className="text-gray-400">
                      Access your existing account
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>

              <Link
                href={`/auth/${userType}/register${
                  redirectTo
                    ? `?redirect=${encodeURIComponent(redirectTo)}`
                    : ""
                }`}
                className="group relative p-6 border border-gray-800 hover:border-white transition-all duration-300 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Create Account</h3>
                    <p className="text-gray-400">
                      Register a new {userType} account
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Initial landing page
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 tracking-tight">Welcome</h1>
          <p className="text-xl text-gray-400">
            Choose how you'd like to continue
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => selectUserType("member")}
            className="group relative p-8 border border-gray-800 hover:border-white transition-all duration-300 rounded-lg"
            disabled={isLoading}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <div className="relative z-10">
              <User className="w-12 h-12 mb-4 mx-auto" />
              <h3 className="text-2xl font-semibold mb-2">Member</h3>
              <p className="text-gray-400">Access your personal account</p>
            </div>
            <ArrowRight className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <button
            onClick={() => selectUserType("organization")}
            className="group relative p-8 border border-gray-800 hover:border-white transition-all duration-300 rounded-lg"
            disabled={isLoading}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <div className="relative z-10">
              <Building2 className="w-12 h-12 mb-4 mx-auto" />
              <h3 className="text-2xl font-semibold mb-2">Organization</h3>
              <p className="text-gray-400">Manage your business account</p>
            </div>
            <ArrowRight className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
