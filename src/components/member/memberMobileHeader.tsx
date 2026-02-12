"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Wallet,
  CreditCard,
  QrCode,
  Bell,
  Menu,
  X,
  LogOut,
  Settings,
  Building2, // Add this import
} from "lucide-react";
import { Spinner } from "@heroui/react";

interface MemberMobileHeaderProps {
  pathname: string;
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

export function MemberMobileHeader({
  pathname,
  unreadCount,
  handleLogout,
  loading,
}: MemberMobileHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between p-4">
        <Link href="/member/dashboard">
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            ReeTrack
          </h1>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/member/notifications">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
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

          <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
            <Link href="/member/profile">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
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
      )}
    </header>
  );
}