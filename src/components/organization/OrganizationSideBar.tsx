"use client";

import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  CreditCard,
  Send,
  FileDown,
  Settings,
  Receipt,
  ScanLine,
  LogOut,
} from "lucide-react";
import { Sidebar } from "@/components/ui/SideBar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { deleteCookie } from "cookies-next/client";
import { toast } from "sonner";
import { isAdmin } from "@/utils/role-utils";

interface OrganizationSidebarProps {
  pathname: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatarUrl: string | null;
}

interface CurrentOrg {
  id: string;
  name: string;
  logoUrl: string | null;
}

export function OrganizationSidebar({
  pathname,
  isCollapsed,
  onToggleCollapse,
}: OrganizationSidebarProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentOrg, setCurrentOrg] = useState<CurrentOrg | null>(null);
  const [loading, setLoading] = useState(false);

  const adminOnly = isAdmin();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed.user);
      }

      const orgData = localStorage.getItem("currentOrg");
      if (orgData) {
        setCurrentOrg(JSON.parse(orgData));
      }
    } catch (error) {
      console.error("Error loading user/org data:", error);
    }
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await apiClient.post("/auth/logout");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    } finally {
      if (typeof window !== "undefined") localStorage.clear();
      deleteCookie("current_role");
      deleteCookie("user_roles");
      setLoading(false);
      router.push("/auth/login");
      router.refresh();
    }
  };

  const allNavigation = [
    {
      name: "Dashboard",
      href: "/organization/dashboard",
      icon: LayoutDashboard,
    },
    { name: "Members", href: "/organization/members", icon: Users },
    { name: "Plans", href: "/organization/plans", icon: Package },
    { name: "Marketplace", href: "/organization/marketplace", icon: ShoppingBag },
    {
      name: "Transactions",
      href: "/organization/transactions",
      icon: CreditCard,
      adminOnly: true,
    },
    {
      name: "Subscription & Billing",
      href: "/organization/access",
      icon: Receipt,
      adminOnly: true,
    },
    { name: "Check-ins", href: "/organization/check-ins", icon: ScanLine },
    { name: "Ping", href: "/organization/ping", icon: Send },
    { name: "Reports", href: "/organization/reports", icon: FileDown },
  ];

  const navigation = adminOnly
    ? allNavigation
    : allNavigation.filter((item) => !item.adminOnly);

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
        avatarUrl: user.avatarUrl ?? null,
        orgLogoUrl: currentOrg?.logoUrl ?? null,
        orgName: currentOrg?.name ?? "",
      }
    : undefined;

  return (
    <Sidebar
      currentPath={pathname}
      navigation={navigation}
      profile={profileData}
      profileHref="/organization/settings"
      actions={actions}
      logoText="ReeTrack"
      logoHref="/organization/dashboard"
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
    />
  );
}
