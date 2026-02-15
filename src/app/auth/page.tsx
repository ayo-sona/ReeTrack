"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to login
    router.push("/auth/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D9488] mx-auto"></div>
        <p className="mt-4 text-[#1F2937]/60">Redirecting...</p>
      </div>
    </div>
  );
}