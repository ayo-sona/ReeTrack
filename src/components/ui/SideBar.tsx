"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const C = {
  teal:     "#0D9488",
  white:    "#FFFFFF",
  ink:      "#1F2937",
  coolGrey: "#9CA3AF",
  border:   "#E5E7EB",
};

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface SidebarAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "ghost" | "outline";
  disabled?: boolean;
  className?: string;
}

interface SidebarProps {
  currentPath: string;
  navigation: NavItem[];
  profile?: ProfileData;
  profileHref?: string;
  actions?: SidebarAction[];
  logoText?: string;
  logoHref?: string;
}

export function Sidebar({
  currentPath,
  navigation,
  profile,
  profileHref = "#",
  actions = [],
  logoText = "ReeTrack",
  logoHref = "/",
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? "80px" : "260px" }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="hidden lg:block bg-white border-r sticky top-0"
      style={{
        height: "100vh",
        borderRight: `1px solid ${C.border}`,
        fontFamily: "Nunito, sans-serif",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .nav-tooltip {
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          background: ${C.ink};
          color: ${C.white};
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          margin-left: 12px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 200ms;
          z-index: 100;
        }
        .nav-item:hover .nav-tooltip {
          opacity: 1;
        }
      `}</style>

      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: isCollapsed ? "20px 16px" : "24px",
        transition: "padding 300ms",
      }}>
        
        {/* Logo & Toggle */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          marginBottom: "32px",
          height: "32px",
        }}>
          {!isCollapsed && (
            <Link href={logoHref} style={{ textDecoration: "none" }}>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: "22px",
                  color: C.teal,
                  letterSpacing: "-0.5px",
                }}
              >
                {logoText}
              </motion.h1>
            </Link>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: `1px solid ${C.border}`,
              background: C.white,
              color: C.coolGrey,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.teal;
              e.currentTarget.style.color = C.white;
              e.currentTarget.style.borderColor = C.teal;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.white;
              e.currentTarget.style.color = C.coolGrey;
              e.currentTarget.style.borderColor = C.border;
            }}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Profile Card (only when expanded) */}
        <AnimatePresence>
          {!isCollapsed && profile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                background: `linear-gradient(135deg, rgba(13,148,136,0.05) 0%, rgba(13,148,136,0.1) 100%)`,
                border: `1px solid rgba(13,148,136,0.15)`,
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "24px",
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
              }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: C.teal,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.white,
                  fontWeight: 800,
                  fontSize: "15px",
                  flexShrink: 0,
                }}>
                  {profile.firstName.charAt(0)}
                  {profile.lastName.charAt(0)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontWeight: 600,
                    fontSize: "13px",
                    color: C.ink,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {profile.firstName} {profile.lastName}
                  </p>
                  <p style={{
                    fontWeight: 400,
                    fontSize: "11px",
                    color: C.coolGrey,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {profile.email}
                  </p>
                </div>
              </div>

              <Link href={profileHref} style={{ textDecoration: "none" }}>
                <button style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "none",
                  background: "transparent",
                  color: C.teal,
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 600,
                  fontSize: "12px",
                  cursor: "pointer",
                  transition: "background 200ms",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(13,148,136,0.08)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  View Profile →
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <Link key={item.name} href={item.href} style={{ textDecoration: "none" }}>
                <div className="nav-item" style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: isCollapsed ? "12px" : "12px 16px",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  borderRadius: "8px",
                  background: isActive ? "rgba(13,148,136,0.08)" : "transparent",
                  color: isActive ? C.teal : C.ink,
                  fontWeight: isActive ? 600 : 400,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 200ms",
                  border: isActive ? `1px solid rgba(13,148,136,0.2)` : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(13,148,136,0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
                >
                  <div style={{ position: "relative" }}>
                    <Icon size={18} />
                    {item.badge && item.badge > 0 && (
                      <span style={{
                        position: "absolute",
                        top: "-6px",
                        right: "-6px",
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
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && <span>{item.name}</span>}
                  {isCollapsed && <div className="nav-tooltip">{item.name}</div>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        {actions.length > 0 && (
          <div style={{
            paddingTop: "16px",
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}>
            {actions.map((action, idx) => (
              <Button
                key={idx}
                variant={action.variant || "ghost"}
                size="sm"
                className={`${isCollapsed ? "w-full justify-center px-0" : "w-full justify-start"} ${action.className || ""}`}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                <action.icon size={18} />
                {!isCollapsed && action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </motion.aside>
  );
}