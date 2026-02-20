"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProfile } from "@/hooks/memberHook/useMember";
import { useUnreadCount } from "@/hooks/memberHook/useSyntheticNotifications";
import apiClient from "@/lib/apiClient";
import { deleteCookie } from "cookies-next";
import { MemberSidebar } from "@/components/member/memberSidebar";
import { MemberMobileHeader } from "@/components/member/memberMobileHeader";

const C = { snow: "#F9FAFB" };

interface MemberLayoutProps {
  children: React.ReactNode;
}

export default function MemberLayout({ children }: MemberLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: profile } = useProfile();
  const unreadCount = useUnreadCount();
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      if (typeof window !== "undefined") localStorage.clear();
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

      {/* Mobile header */}
      <MemberMobileHeader
        pathname={pathname}
        profile={profile}
        unreadCount={unreadCount}
        handleLogout={handleLogout}
        loading={loading}
      />

      <div style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar + toggle — desktop only */}
        <div
          className="hidden lg:flex items-center"
          style={{ padding: "12px 0 12px 12px", position: "relative", flexShrink: 0 }}
        >
          <MemberSidebar
            pathname={pathname}
            profile={profile}
            unreadCount={unreadCount}
            handleLogout={handleLogout}
            loading={loading}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed((c) => !c)}
          />

          {/* Toggle button outside the panel — no clipping */}
          <button
            onClick={() => setIsCollapsed((c) => !c)}
            style={{
              position: "relative",
              marginLeft: "-1px",
              width: "24px",
              height: "48px",
              borderRadius: "0 8px 8px 0",
              border: "1px solid #E5E7EB",
              borderLeft: "none",
              background: "#FFFFFF",
              color: "#9CA3AF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
              transition: "all 200ms",
              flexShrink: 0,
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0D9488";
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.borderColor = "#0D9488";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#FFFFFF";
              e.currentTarget.style.color = "#9CA3AF";
              e.currentTarget.style.borderColor = "#E5E7EB";
            }}
          >
            {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        </div>

        {/* Main content */}
        <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
      </div>
    </div>
  );
}