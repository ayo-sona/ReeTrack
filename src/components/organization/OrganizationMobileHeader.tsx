"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  Send,
  FileDown,
  Settings,
  Receipt,
  ScanLine,
  LogOut,
} from "lucide-react";
import { MobileHeader } from "@/components/ui/MobileHeader";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { deleteCookie } from "cookies-next/client";
import { useOrganizationNotifications } from "@/hooks/useOrganizationNotifiations";

interface OrganizationMobileHeaderProps {
  pathname: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export function OrganizationMobileHeader({ pathname }: OrganizationMobileHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const { unreadCount } = useOrganizationNotifications();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed.user);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

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

  const navigation = [
    { name: "Dashboard", href: "/organization/dashboard", icon: LayoutDashboard },
    { name: "Members", href: "/organization/members", icon: Users },
    { name: "Plans", href: "/organization/plans", icon: Package },
    { name: "Transactions", href: "/organization/transactions", icon: CreditCard },
    { name: "My Access", href: "/organization/access", icon: Receipt },
    { name: "Check-ins", href: "/organization/check-ins", icon: ScanLine },
    { name: "Ping", href: "/organization/ping", icon: Send },
    { name: "Reports", href: "/organization/reports", icon: FileDown },
  ];

  const actions = [
    {
      label: "Settings",
      icon: Settings,
      onClick: () => router.push("/organization/settings"),
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

  const profileData = user
    ? {
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
      }
    : undefined;

  return (
    <MobileHeader
      currentPath={pathname}
      navigation={navigation}
      profile={profileData}
      notificationHref="/organization/notifications"
      notificationCount={unreadCount > 0 ? unreadCount : undefined}
      actions={actions}
      logoText="ReeTrack"
      logoHref="/organization/dashboard"
    />
  );
}