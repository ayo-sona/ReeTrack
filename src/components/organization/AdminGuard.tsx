"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/utils/role-utils";

/**
 * Wraps pages that only ADMIN users should access.
 * STAFF users are redirected to the organization dashboard.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const allowed = isAdmin();

  useEffect(() => {
    if (!allowed) {
      router.replace("/organization/dashboard");
    }
  }, [allowed, router]);

  if (!allowed) return null;

  return <>{children}</>;
}