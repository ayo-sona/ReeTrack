"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/hooks/memberHook/useMember";
import { useUnreadCount } from "@/hooks/memberHook/useSyntheticNotifications";
import apiClient from "@/lib/apiClient";
import { deleteCookie } from "cookies-next";
import { MemberSidebar } from "@/components/member/memberSidebar";
import { MemberMobileHeader } from "@/components/member/memberMobileHeader";

const C = {
  snow: "#F9FAFB",
};

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
    <div style={{ minHeight: "100vh", background: C.snow }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* Mobile Header Component */}
      <MemberMobileHeader
        pathname={pathname}
        profile={profile}
        unreadCount={unreadCount}
        handleLogout={handleLogout}
        loading={loading}
      />

      <div style={{ display: "flex" }}>
        {/* Desktop Sidebar Component */}
        <MemberSidebar
          pathname={pathname}
          profile={profile}
          unreadCount={unreadCount}
          handleLogout={handleLogout}
          loading={loading}
        />

        {/* Main Content - No desktop header */}
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}