"use client";

import { useSyncExternalStore } from "react";
import {
  Home,
  Building2,
  CreditCard,
  Compass,
  QrCode,
  Trophy,
  Receipt,
  Settings,
  LogOut,
  // Gift, // hidden until rewards system is live
} from "lucide-react";
import { Sidebar } from "@/components/ui/SideBar";
import { User } from "@/types/user";

interface MemberSidebarProps {
  pathname: string;
  profile: User | undefined;
  unreadCount: number;
  handleLogout: () => void;
  loading: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function MemberSidebar({
  pathname,
  profile,
  unreadCount,
  handleLogout,
  loading,
  isCollapsed,
  onToggleCollapse,
}: MemberSidebarProps) {
  // Read avatarUrl from localStorage so it reflects immediately after upload
  // without waiting for the parent hook to refetch
  const avatarUrl = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        const stored = localStorage.getItem("userData");
        return stored ? (JSON.parse(stored)?.user?.avatarUrl ?? null) : null;
      } catch {
        return null;
      }
    },
    () => null,
  );
  const navigation = [
    { name: "Dashboard", href: "/member/dashboard", icon: Home },
    { name: "Community", href: "/member/communities", icon: Building2 },
    { name: "Subscriptions", href: "/member/subscriptions", icon: CreditCard },
    { name: "Explore", href: "/member/explore", icon: Compass },
    { name: "Check In", href: "/member/check-ins", icon: QrCode },
    { name: "Leaderboard", href: "/member/leaderboards", icon: Trophy },
    // { name: "Rewards", href: "/member/rewards", icon: Gift }, // hidden until rewards system is live
    { name: "Payments & Billing", href: "/member/payments", icon: Receipt },
  ];

  const actions = [
    {
      label: "Settings",
      icon: Settings,
      onClick: () => { window.location.href = "/member/profile"; },
      variant: "ghost" as const,
    },
    {
      label: loading ? "Logging out..." : "Logout",
      icon: LogOut,
      onClick: handleLogout,
      variant: "outline" as const,
      disabled: loading,
      className: "text-red-600 border-red-200 hover:bg-red-50",
    },
  ];

  const profileData = profile
    ? {
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || "",
        avatarUrl, // ✅ from localStorage, not the prop
      }
    : undefined;

  return (
    <Sidebar
      currentPath={pathname}
      navigation={navigation}
      profile={profileData}
      profileHref="/member/profile"
      actions={actions}
      logoText="ReeTrack"
      logoHref="/member/dashboard"
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
    />
  );
}