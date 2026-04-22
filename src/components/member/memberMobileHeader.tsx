"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Building2,
  CreditCard,
  Compass,
  QrCode,
  Trophy,
  Receipt,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Logo from "@/components/layout/Logo";
import Image from "next/image";

const C = {
  teal: "#0D9488",
  white: "#FFFFFF",
  ink: "#1F2937",
  coolGrey: "#9CA3AF",
  border: "#E5E7EB",
};

interface MemberMobileHeaderProps {
  pathname: string;
  unreadCount: number;
  handleLogout: () => void;
  loading: boolean;
  profile?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    avatarUrl?: string | null;
  };
}

const navigation = [
  { name: "Dashboard", href: "/member/dashboard", icon: Home },
  { name: "Community", href: "/member/communities", icon: Building2 },
  { name: "Subscriptions", href: "/member/subscriptions", icon: CreditCard },
  { name: "Explore", href: "/member/explore", icon: Compass },
  { name: "Check In", href: "/member/check-ins", icon: QrCode },
  { name: "Leaderboards", href: "/member/leaderboards", icon: Trophy },
  { name: "Payments & Billing", href: "/member/payments", icon: Receipt },
];

export function MemberMobileHeader({
  pathname,
  unreadCount,
  handleLogout,
  loading,
  profile,
}: MemberMobileHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* Top Bar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: C.white,
          borderBottom: `1px solid ${C.border}`,
          fontFamily: "Nunito, sans-serif",
        }}
        className="lg:hidden"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
          }}
        >
          <Link href="/member/dashboard">
            <Logo size={28} />
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                background: isMobileMenuOpen
                  ? "rgba(13,148,136,0.08)"
                  : "transparent",
                color: isMobileMenuOpen ? C.teal : C.ink,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 200ms",
              }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: "61px",
              left: 0,
              right: 0,
              bottom: 0,
              background: C.white,
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              fontFamily: "Nunito, sans-serif",
              overflowY: "auto",
            }}
            className="lg:hidden"
          >
            {/* Profile Card */}
            {profile && (
              <div
                style={{
                  padding: "20px 16px",
                  borderBottom: `1px solid ${C.border}`,
                  background: `linear-gradient(135deg, rgba(13,148,136,0.04) 0%, rgba(13,148,136,0.08) 100%)`,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "14px" }}
                >
                  {/* Avatar — image if available, initials fallback */}
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "12px",
                      background: C.teal,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.white,
                      fontWeight: 800,
                      fontSize: "18px",
                      overflow: "hidden",
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    {profile.avatarUrl ? (
                      <Image
                        src={profile.avatarUrl}
                        alt={`${profile.first_name} ${profile.last_name}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <>
                        {profile.first_name?.charAt(0)}
                        {profile.last_name?.charAt(0)}
                      </>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: "15px",
                        color: C.ink,
                        marginBottom: "2px",
                      }}
                    >
                      {profile.first_name} {profile.last_name}
                    </p>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "13px",
                        color: C.coolGrey,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {profile.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Grid */}
            <nav
              style={{
                flex: 1,
                padding: "24px 16px",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
                alignContent: "start",
              }}
            >
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px",
                        padding: "24px 16px",
                        borderRadius: "12px",
                        background: isActive
                          ? "rgba(13,148,136,0.08)"
                          : C.white,
                        border: isActive
                          ? `1.5px solid rgba(13,148,136,0.25)`
                          : `1px solid ${C.border}`,
                        color: isActive ? C.teal : C.ink,
                        cursor: "pointer",
                        transition: "all 200ms",
                      }}
                    >
                      <Icon size={24} />
                      <span
                        style={{
                          fontWeight: isActive ? 600 : 500,
                          fontSize: "13px",
                          textAlign: "center",
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div
              style={{
                padding: "16px",
                borderTop: `1px solid ${C.border}`,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Link
                href="/member/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full justify-start"
                >
                  <Settings size={20} />
                  Settings
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                disabled={loading}
              >
                <LogOut size={20} />
                {loading ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
