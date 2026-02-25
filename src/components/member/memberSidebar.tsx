"use client";

import {
  Home,
  Wallet,
  CreditCard,
  QrCode,
  Bell,
  LogOut,
  Settings,
  Building2,
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
  const navigation = [
    { name: "Dashboard", href: "/member/dashboard", icon: Home },
    { name: "Community", href: "/member/communities", icon: Building2 },
    { name: "Wallet", href: "/member/wallet", icon: Wallet },
    { name: "Subscriptions", href: "/member/subscriptions", icon: CreditCard },
    { name: "Check In", href: "/member/check-ins", icon: QrCode },
    { name: "Payments", href: "/member/payments", icon: CreditCard },
    // {
    //   name: "Notifications",
    //   href: "/member/notifications",
    //   icon: Bell,
    //   badge: unreadCount,
    // },
  ];

  const actions = [
    {
      label: "Settings",
      icon: Settings,
      onClick: () => {
        window.location.href = "/member/profile";
      },
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
