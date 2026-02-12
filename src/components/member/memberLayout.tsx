"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/hooks/memberHook/useMember";
import { useUnreadCount } from "@/hooks/memberHook/useSyntheticNotifications";
import apiClient from "@/lib/apiClient";
import { deleteCookie } from "cookies-next";
import { MemberSidebar } from "@/components/member/memberSidebar";
import { MemberMobileHeader } from "@/components/member/memberMobileHeader";

interface MemberLayoutProps {
  children: React.ReactNode;
}

export default function MemberLayout({ children }: MemberLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: profile } = useProfile();
  const unreadCount = useUnreadCount();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }

      deleteCookie("access_token");
      deleteCookie("current_role");
      deleteCookie("user_roles");
      setLoading(false);

      router.push("/auth/login");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
      {/* Mobile Header Component */}
      <MemberMobileHeader
        pathname={pathname}
        unreadCount={unreadCount}
        handleLogout={handleLogout}
        loading={loading}
      />

      <div className="lg:flex">
        {/* Desktop Sidebar Component */}
        <MemberSidebar
          pathname={pathname}
          profile={profile}
          unreadCount={unreadCount}
          handleLogout={handleLogout}
          loading={loading}
        />

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}