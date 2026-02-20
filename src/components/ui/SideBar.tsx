"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const C = {
  teal:     "#0D9488",
  white:    "#FFFFFF",
  ink:      "#1F2937",
  coolGrey: "#9CA3AF",
  border:   "#E5E7EB",
  snow:     "#F9FAFB",
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
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  currentPath,
  navigation,
  profile,
  profileHref = "#",
  actions = [],
  logoText = "ReeTrack",
  logoHref = "/",
  isCollapsed,
}: SidebarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = profile
    ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
    : "?";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
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
          margin-left: 20px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 200ms;
          z-index: 100;
        }
        .nav-item:hover .nav-tooltip { opacity: 1; }
        .profile-pill:hover { background: rgba(13,148,136,0.07) !important; }
        .menu-item:hover { background: ${C.snow} !important; }
        .menu-item-danger:hover { background: #FEF2F2 !important; color: #DC2626 !important; }
      `}</style>

      <aside
        style={{
          width: isCollapsed ? "72px" : "248px",
          transition: "width 300ms cubic-bezier(0.16, 1, 0.3, 1)",
          height: "100%",
          background: C.white,
          borderRadius: "16px",
          border: `1px solid ${C.border}`,
          boxShadow: "0 2px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Nunito, sans-serif",
          // No overflow:hidden — nothing to clip
        }}
      >
        <div style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: isCollapsed ? "20px 12px" : "20px 16px",
          transition: "padding 300ms",
        }}>

          {/* Logo */}
          <div style={{
            marginBottom: "24px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            flexShrink: 0,
          }}>
            {isCollapsed ? (
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: C.teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.white,
                fontWeight: 800,
                fontSize: "13px",
              }}>
                {logoText.charAt(0)}
              </div>
            ) : (
              <Link href={logoHref} style={{ textDecoration: "none" }}>
                <h1 style={{
                  fontWeight: 800,
                  fontSize: "20px",
                  color: C.teal,
                  letterSpacing: "-0.5px",
                  margin: 0,
                }}>
                  {logoText}
                </h1>
              </Link>
            )}
          </div>

          {/* Navigation */}
          <nav style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            marginRight: "-4px",
            paddingRight: "4px",
          }}>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;
              return (
                <Link key={item.name} href={item.href} style={{ textDecoration: "none" }}>
                  <div
                    className="nav-item"
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: isCollapsed ? "10px" : "10px 14px",
                      justifyContent: isCollapsed ? "center" : "flex-start",
                      borderRadius: "10px",
                      background: isActive ? "rgba(13,148,136,0.08)" : "transparent",
                      color: isActive ? C.teal : C.ink,
                      fontWeight: isActive ? 700 : 400,
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "all 150ms",
                      border: isActive
                        ? "1px solid rgba(13,148,136,0.18)"
                        : "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = "rgba(13,148,136,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <Icon size={17} />
                      {item.badge && item.badge > 0 && (
                        <span style={{
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                          minWidth: "15px",
                          height: "15px",
                          padding: "0 3px",
                          background: "#EF4444",
                          color: C.white,
                          fontSize: "9px",
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
                    {!isCollapsed && (
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.name}
                      </span>
                    )}
                    {isCollapsed && <div className="nav-tooltip">{item.name}</div>}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Profile pill + dropdown */}
          {profile && (
            <div
              ref={menuRef}
              style={{
                paddingTop: "12px",
                marginTop: "8px",
                borderTop: `1px solid ${C.border}`,
                flexShrink: 0,
                position: "relative",
              }}
            >
              {/* Dropdown */}
              {menuOpen && (
                <div style={{
                  position: "absolute",
                  ...(isCollapsed
                    ? { left: "calc(100% + 12px)", bottom: 0, width: "220px" }
                    : { bottom: "calc(100% + 8px)", left: 0, right: 0 }),
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
                  zIndex: 50,
                  padding: "6px",
                }}>
                  <div style={{
                    padding: "10px 12px",
                    borderBottom: `1px solid ${C.border}`,
                    marginBottom: "6px",
                  }}>
                    <p style={{ fontWeight: 700, fontSize: "13px", color: C.ink, margin: 0 }}>
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p style={{
                      fontWeight: 400, fontSize: "11px", color: C.coolGrey,
                      margin: "2px 0 0", overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {profile.email}
                    </p>
                  </div>

                  {actions.map((action, idx) => {
                    const isDestructive =
                      action.className?.includes("red") ||
                      action.label.toLowerCase().includes("log");
                    return (
                      <button
                        key={idx}
                        disabled={action.disabled}
                        onClick={() => { setMenuOpen(false); action.onClick(); }}
                        className={isDestructive ? "menu-item-danger" : "menu-item"}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "9px 12px",
                          borderRadius: "8px",
                          cursor: action.disabled ? "not-allowed" : "pointer",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: isDestructive ? "#DC2626" : C.ink,
                          background: "transparent",
                          border: "none",
                          transition: "background 150ms",
                          opacity: action.disabled ? 0.5 : 1,
                          textAlign: "left",
                          fontFamily: "Nunito, sans-serif",
                        }}
                      >
                        <action.icon size={15} style={{ flexShrink: 0 }} />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Pill trigger */}
              <button
                className="profile-pill"
                onClick={() => setMenuOpen((p) => !p)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: isCollapsed ? "8px" : "9px 12px",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  borderRadius: "999px",
                  border: `1px solid ${C.border}`,
                  background: menuOpen ? "rgba(13,148,136,0.07)" : C.snow,
                  cursor: "pointer",
                  transition: "all 200ms",
                  fontFamily: "Nunito, sans-serif",
                }}
              >
                <div style={{
                  width: "30px", height: "30px", borderRadius: "50%",
                  background: C.teal, display: "flex", alignItems: "center",
                  justifyContent: "center", color: C.white,
                  fontWeight: 800, fontSize: "11px", flexShrink: 0,
                }}>
                  {initials}
                </div>
                {!isCollapsed && (
                  <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                    <p style={{
                      fontWeight: 700, fontSize: "12px", color: C.ink,
                      overflow: "hidden", textOverflow: "ellipsis",
                      whiteSpace: "nowrap", margin: 0,
                    }}>
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p style={{
                      fontWeight: 400, fontSize: "11px", color: C.coolGrey,
                      overflow: "hidden", textOverflow: "ellipsis",
                      whiteSpace: "nowrap", margin: 0,
                    }}>
                      {profile.email}
                    </p>
                  </div>
                )}
              </button>
            </div>
          )}

        </div>
      </aside>
    </>
  );
}