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
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

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
  profile?: any;
}

const navigation = [
  { name: "Dashboard", href: "/member/dashboard", icon: Home },
  { name: "Community", href: "/member/communities", icon: Building2 },
  { name: "Wallet", href: "/member/wallet", icon: Wallet },
  { name: "Subscriptions", href: "/member/subscriptions", icon: CreditCard },
  { name: "Check In", href: "/member/check-ins", icon: QrCode },
  { name: "Payments", href: "/member/payments", icon: CreditCard },
  // { name: "Notifications", href: "/member/notifications", icon: Bell },
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
          {/* Logo */}
          <Link href="/member/dashboard" style={{ textDecoration: "none" }}>
            <h1
              style={{
                fontFamily: "Nunito, sans-serif",
                fontWeight: 800,
                fontSize: "20px",
                color: C.teal,
                letterSpacing: "-0.4px",
              }}
            >
              ReeTrack
            </h1>
          </Link>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {/* Notifications badge */}
            {/* <Link href="/member/notifications" style={{ position: "relative", display: "block" }}>
              <button style={{
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                background: "transparent",
                color: C.ink,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 200ms",
                position: "relative",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(13,148,136,0.06)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    minWidth: "16px",
                    height: "16px",
                    padding: "0 4px",
                    background: "#EF4444",
                    color: C.white,
                    fontSize: "10px",
                    fontWeight: 700,
                    borderRadius: "999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            </Link> */}

            {/* Menu button */}
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                  }}
                >
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
                    }}
                  >
                    {profile.first_name?.charAt(0)}
                    {profile.last_name?.charAt(0)}
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
                // const hasNotif = item.name === "Notifications" && unreadCount > 0;

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
                      onTouchStart={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background =
                            "rgba(13,148,136,0.04)";
                        }
                      }}
                      onTouchEnd={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = C.white;
                        }
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <Icon size={24} />
                        {/* {hasNotif && (
                          <span style={{
                            position: "absolute",
                            top: "-4px",
                            right: "-4px",
                            width: "14px",
                            height: "14px",
                            background: "#EF4444",
                            borderRadius: "50%",
                          }} />
                        )} */}
                      </div>
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
