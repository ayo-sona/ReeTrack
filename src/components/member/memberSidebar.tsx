"use client";

import Link from "next/link";
import {
  Home,
  Wallet,
  CreditCard,
  QrCode,
  Bell,
  LogOut,
  Settings,
  Building2, // Add this import
} from "lucide-react";
import { Spinner } from "@heroui/react";
import { User } from "@/types/user";

interface MemberSidebarProps {
  pathname: string;
  profile: User | undefined;
  unreadCount: number;
  handleLogout: () => void;
  loading: boolean;
}

const navigation = [
  { name: "Dashboard", href: "/member/dashboard", icon: Home },
  { name: "My Community", href: "/member/communities", icon: Building2 }, // Updated
  { name: "Wallet", href: "/member/wallet", icon: Wallet },
  { name: "Subscriptions", href: "/member/subscriptions", icon: CreditCard },
  { name: "Check In", href: "/member/check-ins", icon: QrCode },
  { name: "Payments", href: "/member/payments", icon: CreditCard },
];

export function MemberSidebar({
  pathname,
  profile,
  unreadCount,
  handleLogout,
  loading,
}: MemberSidebarProps) {
  return (
    <aside className="hidden lg:block w-64 h-[100vh] bg-white border-r border-gray-200 min-h-screen sticky top-0">
      <div className="p-6">
        <Link href="/member/dashboard">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-8">
            ReeTrack
          </h1>
        </Link>

        {/* Profile Section */}
        {profile && (
          <div className="mb-8 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {profile?.first_name?.charAt(0)}
                {profile?.last_name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {profile?.email}
                </p>
              </div>
            </div>
            <Link href="/member/profile">
              <button className="w-full text-sm text-emerald-700 hover:text-emerald-800 font-medium">
                View Profile →
              </button>
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              </Link>
            );
          })}

          {/* Notifications with Badge */}
          <Link href="/member/notifications">
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === "/member/notifications"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="font-medium">Notifications</span>
            </button>
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
          <Link href="/member/profile">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            {loading ? (
              <Spinner color="danger" />
            ) : (
              <>
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
