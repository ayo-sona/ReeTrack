"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Bell, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Logo from "@/components/layout/Logo";

const C = {
  teal: "#0D9488",
  white: "#FFFFFF",
  ink: "#1F2937",
  coolGrey: "#9CA3AF",
  border: "#E5E7EB",
};

export interface MobileNavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface MobileHeaderProfile {
  firstName: string;
  lastName: string;
  email: string;
}

export interface MobileHeaderAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "ghost" | "outline";
  disabled?: boolean;
  className?: string;
}

interface MobileHeaderProps {
  currentPath: string;
  navigation: MobileNavItem[];
  profile?: MobileHeaderProfile;
  notificationHref?: string;
  notificationCount?: number;
  actions?: MobileHeaderAction[];
  logoHref?: string;
}

export function MobileHeader({
  currentPath,
  navigation,
  profile,
  notificationHref = "#",
  notificationCount = 0,
  actions = [],
  logoHref = "/",
}: MobileHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add notifications to navigation if provided
  const allNavItems =
    notificationHref !== "#"
      ? [
          ...navigation,
          { name: "Notifications", href: notificationHref, icon: Bell },
        ]
      : navigation;

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
          <Link href={logoHref}>
            <Logo size={28} />
          </Link>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {/* Notifications badge */}
            {/* {notificationHref !== "#" && (
              <Link href={notificationHref} style={{ position: "relative", display: "block" }}>
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
                  {notificationCount > 0 && (
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
                      {notificationCount}
                    </span>
                  )}
                </button>
              </Link>
            )} */}

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
                    {profile.firstName.charAt(0)}
                    {profile.lastName.charAt(0)}
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
                      {profile.firstName} {profile.lastName}
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
              {allNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href;
                // const hasNotif = item.name === "Notifications" && notificationCount > 0;

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
            {actions.length > 0 && (
              <div
                style={{
                  padding: "16px",
                  borderTop: `1px solid ${C.border}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {actions.map((action, idx) => (
                  <Button
                    key={idx}
                    variant={action.variant || "ghost"}
                    size="lg"
                    className={`w-full justify-start ${action.className || ""}`}
                    onClick={() => { action.onClick(); setIsMobileMenuOpen(false); }}
                    disabled={action.disabled}
                  >
                    <action.icon size={20} />
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
