"use client";

import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  Send,
  FileDown,
  ScanLine,
  Receipt,
  BarChart2,
  ChevronRight,
  ChevronLeft,
  Building2,
  QrCode,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  Home,
} from "lucide-react";
import Logo from "@/components/layout/Logo";

// ── COLORS ─────────────────────────────────────────────────────────────────────
const C = {
  teal: "#0D9488",
  ink: "#1F2937",
  grey: "#9CA3AF",
  border: "#E5E7EB",
  snow: "#F9FAFB",
  white: "#FFFFFF",
  coral: "#F06543",
  amber: "#D97706",
  green: "#059669",
};

// ── TYPES ──────────────────────────────────────────────────────────────────────
type OrgPage =
  | "dashboard"
  | "members"
  | "payments"
  | "plans"
  | "checkins"
  | "ping"
  | "reports";
type MemberPage =
  | "mdashboard"
  | "subscriptions"
  | "community"
  | "checkin"
  | "mpayments";
type ActivePage = OrgPage | MemberPage;
type View = "org" | "member";

interface TourStep {
  page: ActivePage;
  title: string;
  text: string;
  tipPos: { top: number; left: number };
}

// ── NAV ITEM ───────────────────────────────────────────────────────────────────
function NavItem({
  icon: Icon,
  label,
  active,
  collapsed,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: collapsed ? "10px" : "10px 14px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 10,
        background: active
          ? "rgba(13,148,136,0.08)"
          : hovered
            ? "rgba(13,148,136,0.04)"
            : "transparent",
        color: active ? C.teal : C.ink,
        fontWeight: active ? 700 : 400,
        fontSize: 14,
        cursor: "pointer",
        transition: "all 150ms",
        border: active
          ? "1px solid rgba(13,148,136,0.18)"
          : "1px solid transparent",
        marginBottom: 2,
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <Icon size={17} />
      </div>
      {!collapsed && (
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </span>
      )}
      {collapsed && hovered && (
        <div
          style={{
            position: "absolute",
            left: "calc(100% + 12px)",
            top: "50%",
            transform: "translateY(-50%)",
            background: C.ink,
            color: C.white,
            padding: "6px 12px",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: "nowrap",
            zIndex: 100,
            pointerEvents: "none",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

// ── SIDEBAR ────────────────────────────────────────────────────────────────────
function Sidebar({
  view,
  activePage,
  collapsed,
  onNavigate,
}: {
  view: View;
  activePage: ActivePage;
  collapsed: boolean;
  onNavigate: (p: ActivePage) => void;
}) {
  const orgNav = [
    { id: "dashboard" as OrgPage, icon: LayoutDashboard, label: "Dashboard" },
    { id: "members" as OrgPage, icon: Users, label: "Members" },
    { id: "plans" as OrgPage, icon: Package, label: "Plans" },
    { id: "payments" as OrgPage, icon: CreditCard, label: "Payments" },
    { id: "checkins" as OrgPage, icon: ScanLine, label: "Check-ins" },
    { id: "ping" as OrgPage, icon: Send, label: "Ping" },
    { id: "reports" as OrgPage, icon: FileDown, label: "Reports" },
  ];
  const memberNav = [
    { id: "mdashboard" as MemberPage, icon: Home, label: "Dashboard" },
    {
      id: "subscriptions" as MemberPage,
      icon: CreditCard,
      label: "Subscriptions",
    },
    { id: "community" as MemberPage, icon: Building2, label: "My Community" },
    { id: "checkin" as MemberPage, icon: QrCode, label: "Check In" },
    { id: "mpayments" as MemberPage, icon: Receipt, label: "Payments" },
  ];
  const nav = view === "org" ? orgNav : memberNav;
  const profile =
    view === "org"
      ? { name: "Ayo Okonkwo", email: "ayo@fitspace.ng", initials: "AO" }
      : { name: "Tunde Adeyemi", email: "tunde@gmail.com", initials: "TA" };

  return (
    <aside
      style={{
        width: collapsed ? 72 : 248,
        transition: "width 300ms cubic-bezier(0.16,1,0.3,1)",
        height: "100%",
        background: C.white,
        borderRadius: 16,
        border: `1px solid ${C.border}`,
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Nunito, sans-serif",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: collapsed ? "20px 12px" : "20px 16px",
          transition: "padding 300ms",
        }}
      >
        <div
          style={{
            marginBottom: 24,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            flexShrink: 0,
          }}
        >
          {collapsed ? (
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: C.teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.white,
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              R
            </div>
          ) : (
            <Logo size={28} />
          )}
        </div>
        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {nav.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activePage === item.id}
              collapsed={collapsed}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </nav>
        <div
          style={{
            paddingTop: 12,
            marginTop: 8,
            borderTop: `1px solid ${C.border}`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: collapsed ? 8 : "9px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 999,
              border: `1px solid ${C.border}`,
              background: C.snow,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: C.teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.white,
                fontWeight: 800,
                fontSize: 11,
                flexShrink: 0,
              }}
            >
              {profile.initials}
            </div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 12,
                    color: C.ink,
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {profile.name}
                </p>
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: 11,
                    color: C.grey,
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {profile.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── STAT CARD ──────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  change,
  changeType = "up",
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "warn";
  icon: React.ElementType;
  accent?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: accent ? C.teal : C.white,
        border: `1px solid ${accent ? "transparent" : hovered ? C.teal : C.border}`,
        borderRadius: 12,
        padding: 16,
        boxShadow: accent
          ? "0 4px 16px rgba(13,148,136,0.2)"
          : "0 1px 3px rgba(0,0,0,0.04)",
        transition: "border-color 200ms",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: accent ? "rgba(255,255,255,0.7)" : C.grey,
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            margin: 0,
          }}
        >
          {label}
        </p>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: accent
              ? "rgba(255,255,255,0.2)"
              : "rgba(13,148,136,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accent ? C.white : C.teal,
          }}
        >
          <Icon size={14} />
        </div>
      </div>
      <p
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: accent ? C.white : C.ink,
          letterSpacing: "-0.5px",
          margin: "0 0 3px",
        }}
      >
        {value}
      </p>
      {change && (
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            margin: 0,
            color: accent
              ? "rgba(255,255,255,0.7)"
              : changeType === "warn"
                ? C.coral
                : C.green,
          }}
        >
          {change}
        </p>
      )}
    </div>
  );
}

// ── REVENUE CHART ──────────────────────────────────────────────────────────────
function RevenueChart() {
  const data = [420, 510, 390, 600, 720, 690, 847];
  const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const max = Math.max(...data);
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      style={{
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 18,
        marginBottom: 14,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: 0 }}>
          Monthly Revenue
        </p>
        <span
          style={{
            fontSize: 10,
            padding: "3px 8px",
            borderRadius: 20,
            background: "rgba(5,150,105,0.1)",
            color: C.green,
            fontWeight: 700,
          }}
        >
          +18% MoM
        </span>
      </div>
      <div
        style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 72 }}
      >
        {data.map((v, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div
              style={{
                width: "100%",
                borderRadius: "4px 4px 0 0",
                background:
                  i === data.length - 1 ? C.teal : "rgba(13,148,136,0.35)",
                height: animated ? Math.round((v / max) * 68) + "px" : "4px",
                minHeight: 4,
                transition: `height 0.7s ease ${i * 60}ms`,
              }}
            />
            <span style={{ fontSize: 9, color: C.grey, fontWeight: 600 }}>
              {months[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── STATUS BADGE ───────────────────────────────────────────────────────────────
function StatusBadge({
  status,
}: {
  status: "active" | "expiring" | "expired" | "pending";
}) {
  const cfg = {
    active: { bg: "rgba(5,150,105,0.1)", color: C.green, label: "Active" },
    expiring: { bg: "rgba(217,119,6,0.1)", color: C.amber, label: "Expiring" },
    expired: { bg: "rgba(240,101,67,0.1)", color: C.coral, label: "Expired" },
    pending: { bg: "rgba(217,119,6,0.1)", color: C.amber, label: "Pending" },
  }[status];
  return (
    <span
      style={{
        padding: "3px 9px",
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 700,
        background: cfg.bg,
        color: cfg.color,
      }}
    >
      {cfg.label}
    </span>
  );
}

// ── TOUR TOOLTIP ───────────────────────────────────────────────────────────────
function TourTooltip({
  step,
  total,
  title,
  text,
  pos,
  onNext,
  onSkip,
}: {
  step: number;
  total: number;
  title: string;
  text: string;
  pos: { top: number; left: number };
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        width: 248,
        background: C.white,
        border: `1.5px solid ${C.teal}`,
        borderRadius: 12,
        padding: "16px 18px",
        boxShadow: "0 8px 32px rgba(13,148,136,0.2)",
        zIndex: 200,
        fontFamily: "Nunito, sans-serif",
        animation: "tooltipIn 0.35s ease forwards",
      }}
    >
      <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 6,
              borderRadius: 3,
              width: i === step - 1 ? 16 : 6,
              background: i < step ? C.teal : C.border,
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: C.teal,
          letterSpacing: "2px",
          textTransform: "uppercase",
          margin: "0 0 5px",
        }}
      >
        Step {step} of {total}
      </p>
      <p
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: C.ink,
          margin: "0 0 6px",
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: 12,
          color: C.grey,
          lineHeight: 1.6,
          margin: "0 0 14px",
        }}
      >
        {text}
      </p>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          onClick={onSkip}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            border: `1px solid ${C.border}`,
            background: C.snow,
            color: C.grey,
            cursor: "pointer",
            fontFamily: "Nunito, sans-serif",
          }}
        >
          Skip
        </button>
        <button
          onClick={onNext}
          style={{
            padding: "6px 14px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            border: "none",
            background: C.teal,
            color: C.white,
            cursor: "pointer",
            fontFamily: "Nunito, sans-serif",
          }}
        >
          {step === total ? "Finish ✨" : "Next →"}
        </button>
      </div>
    </div>
  );
}

// ── PAGE CONTENT ───────────────────────────────────────────────────────────────
function OrgDashboard() {
  return (
    <div style={{ padding: 24, overflowY: "auto", height: "100%" }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: C.teal,
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          margin: "0 0 2px",
        }}
      >
        Good afternoon
      </p>
      <h1
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: C.ink,
          margin: "0 0 2px",
        }}
      >
        Dashboard
      </h1>
      <p style={{ fontSize: 13, color: C.grey, margin: "0 0 20px" }}>
        Here's an overview of how things have been so far.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <StatCard
          label="Total Members"
          value="148"
          change="↑ 12 this month"
          icon={Users}
        />
        <StatCard
          label="Active"
          value="134"
          change="↑ 90.5% rate"
          icon={CheckCircle}
        />
        <StatCard
          label="Revenue (Mar)"
          value="₦847k"
          change="↑ 18% vs last month"
          icon={TrendingUp}
        />
        <StatCard
          label="Expiring Soon"
          value="9"
          change="Needs attention"
          changeType="warn"
          icon={AlertCircle}
        />
      </div>
      <RevenueChart />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div
          style={{
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 16,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.grey,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              margin: "0 0 12px",
            }}
          >
            Recent Activity
          </p>
          {[
            { dot: C.green, text: "Tunde A. renewed plan", time: "2m ago" },
            { dot: C.teal, text: "Chioma E. joined", time: "14m ago" },
            { dot: C.amber, text: "Emeka O. expiring in 3d", time: "1h ago" },
            { dot: C.green, text: "₦15,000 payment received", time: "2h ago" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "7px 0",
                borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
                fontSize: 12,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: item.dot,
                  flexShrink: 0,
                }}
              />
              <span style={{ flex: 1, color: C.ink, fontWeight: 600 }}>
                {item.text}
              </span>
              <span style={{ color: C.grey, fontSize: 11 }}>{item.time}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 16,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.grey,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              margin: "0 0 12px",
            }}
          >
            Expiring This Week
          </p>
          {[
            { name: "Emeka Obi", plan: "Monthly Plan", days: "3 days left" },
            {
              name: "Aisha Bello",
              plan: "Quarterly Plan",
              days: "5 days left",
            },
            {
              name: "Segun Adeyemi",
              plan: "Monthly Plan",
              days: "6 days left",
            },
            { name: "Ngozi Eze", plan: "Annual Plan", days: "7 days left" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
                fontSize: 12,
              }}
            >
              <div>
                <p style={{ fontWeight: 700, color: C.ink, margin: 0 }}>
                  {item.name}
                </p>
                <p style={{ fontSize: 10, color: C.grey, margin: 0 }}>
                  {item.plan}
                </p>
              </div>
              <span style={{ fontSize: 11, color: C.amber, fontWeight: 700 }}>
                {item.days}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrgMembers() {
  const members = [
    {
      i: "TA",
      name: "Tunde Adeyemi",
      email: "tunde@gmail.com",
      plan: "Monthly",
      joined: "Jan 15",
      expires: "Apr 15",
      status: "active" as const,
      bg: "rgba(13,148,136,0.12)",
      c: C.teal,
    },
    {
      i: "CE",
      name: "Chioma Eze",
      email: "chioma@yahoo.com",
      plan: "Quarterly",
      joined: "Mar 20",
      expires: "Jun 20",
      status: "active" as const,
      bg: "rgba(5,150,105,0.12)",
      c: C.green,
    },
    {
      i: "EO",
      name: "Emeka Obi",
      email: "emeka@hotmail.com",
      plan: "Monthly",
      joined: "Feb 23",
      expires: "Mar 23",
      status: "expiring" as const,
      bg: "rgba(217,119,6,0.12)",
      c: C.amber,
    },
    {
      i: "AB",
      name: "Aisha Bello",
      email: "aisha@gmail.com",
      plan: "Annual",
      joined: "Mar 10",
      expires: "Mar 10",
      status: "expired" as const,
      bg: "rgba(240,101,67,0.12)",
      c: C.coral,
    },
    {
      i: "SA",
      name: "Segun Adeyemi",
      email: "segun@gmail.com",
      plan: "Monthly",
      joined: "Feb 1",
      expires: "Apr 1",
      status: "active" as const,
      bg: "rgba(13,148,136,0.12)",
      c: C.teal,
    },
  ];
  return (
    <div style={{ padding: 24, overflowY: "auto", height: "100%" }}>
      <h1
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: C.ink,
          margin: "0 0 2px",
        }}
      >
        Members
      </h1>
      <p style={{ fontSize: 13, color: C.grey, margin: "0 0 16px" }}>
        Manage and monitor all member subscriptions
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <input
          placeholder="Search members..."
          style={{
            flex: 1,
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 13,
            color: C.ink,
            outline: "none",
            fontFamily: "Nunito, sans-serif",
          }}
        />
        <button
          style={{
            background: "transparent",
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 12,
            cursor: "pointer",
            color: C.grey,
            fontFamily: "Nunito, sans-serif",
            fontWeight: 600,
          }}
        >
          Filter
        </button>
        <button
          style={{
            background: C.teal,
            border: "none",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 12,
            cursor: "pointer",
            color: C.white,
            fontFamily: "Nunito, sans-serif",
            fontWeight: 700,
          }}
        >
          + Add Member
        </button>
      </div>
      <div
        style={{
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}
        >
          <thead>
            <tr
              style={{
                background: C.snow,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {["Member", "Plan", "Joined", "Expires", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.grey,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr
                key={i}
                style={{
                  borderBottom:
                    i < members.length - 1
                      ? `1px solid rgba(229,231,235,0.5)`
                      : "none",
                }}
              >
                <td style={{ padding: "11px 14px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 9 }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: m.bg,
                        color: m.c,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {m.i}
                    </div>
                    <div>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          color: C.ink,
                          margin: 0,
                        }}
                      >
                        {m.name}
                      </p>
                      <p style={{ fontSize: 10, color: C.grey, margin: 0 }}>
                        {m.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "11px 14px", color: C.ink }}>{m.plan}</td>
                <td style={{ padding: "11px 14px", color: C.grey }}>
                  {m.joined}
                </td>
                <td style={{ padding: "11px 14px", color: C.grey }}>
                  {m.expires}
                </td>
                <td style={{ padding: "11px 14px" }}>
                  <StatusBadge status={m.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrgPayments() {
  const txns = [
    {
      icon: <CreditCard size={16} color={C.green} />,
      bg: "rgba(5,150,105,0.1)",
      name: "Tunde Adeyemi — Monthly Renewal",
      date: "Today, 2:14pm",
      amt: "+₦15,000",
      color: C.green,
    },
    {
      icon: <CreditCard size={16} color={C.green} />,
      bg: "rgba(5,150,105,0.1)",
      name: "Chioma Eze — New Membership",
      date: "Today, 11:02am",
      amt: "+₦45,000",
      color: C.green,
    },
    {
      icon: <Clock size={16} color={C.amber} />,
      bg: "rgba(217,119,6,0.1)",
      name: "Emeka Obi — Renewal Pending",
      date: "Due Mar 23",
      amt: "₦15,000",
      color: C.amber,
    },
    {
      icon: <CreditCard size={16} color={C.green} />,
      bg: "rgba(5,150,105,0.1)",
      name: "Segun Adeyemi — Quarterly",
      date: "Yesterday, 4:30pm",
      amt: "+₦40,000",
      color: C.green,
    },
    {
      icon: <AlertCircle size={16} color={C.coral} />,
      bg: "rgba(240,101,67,0.1)",
      name: "Aisha Bello — Expired",
      date: "Mar 10",
      amt: "₦60,000",
      color: C.coral,
    },
  ];
  return (
    <div style={{ padding: 24, overflowY: "auto", height: "100%" }}>
      <h1
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: C.ink,
          margin: "0 0 2px",
        }}
      >
        Payments
      </h1>
      <p style={{ fontSize: 13, color: C.grey, margin: "0 0 16px" }}>
        All transactions · March 2025
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <StatCard
          label="Total Collected"
          value="₦847,000"
          change="This month"
          icon={TrendingUp}
        />
        <StatCard
          label="Pending"
          value="₦63,000"
          change="4 members owing"
          changeType="warn"
          icon={Clock}
        />
        <StatCard
          label="Transactions"
          value="124"
          change="↑ vs 98 last mo"
          icon={BarChart2}
        />
      </div>
      <div
        style={{
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: C.grey,
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            margin: "0 0 4px",
          }}
        >
          Recent Transactions
        </p>
        {txns.map((t, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom:
                i < txns.length - 1 ? `1px solid ${C.border}` : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: t.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {t.icon}
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: C.ink,
                    margin: 0,
                  }}
                >
                  {t.name}
                </p>
                <p style={{ fontSize: 11, color: C.grey, margin: 0 }}>
                  {t.date}
                </p>
              </div>
            </div>
            <span style={{ fontWeight: 800, fontSize: 14, color: t.color }}>
              {t.amt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemberDashboard() {
  return (
    <div style={{ padding: 24, overflowY: "auto", height: "100%" }}>
      <h1
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: C.ink,
          margin: "0 0 4px",
        }}
      >
        Welcome back, Tunde! 👋
      </h1>
      <p style={{ fontSize: 13, color: C.grey, margin: "0 0 18px" }}>
        Manage your subscriptions and payments
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <StatCard label="Active Subscriptions" value="2" icon={CreditCard} />
        <StatCard
          label="Pending Invoices"
          value="1"
          changeType="warn"
          change="Action needed"
          icon={Receipt}
        />
      </div>
      <div
        style={{
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 16,
          marginBottom: 14,
        }}
      >
        <p
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: C.teal,
            margin: "0 0 12px",
          }}
        >
          Active Subscriptions
        </p>
        {[
          {
            letter: "M",
            name: "Monthly Plan",
            price: "₦15,000",
            interval: "/month",
            expires: "Expires Apr 15",
            color: C.teal,
            strip: C.teal,
            warn: false,
          },
          {
            letter: "Q",
            name: "Quarterly Plan",
            price: "₦40,000",
            interval: "/quarter",
            expires: "⚠️ Expires in 3 days!",
            color: C.amber,
            strip: C.coral,
            warn: true,
          },
        ].map((sub, i) => (
          <div
            key={i}
            style={{
              border: `1px solid ${sub.warn ? "rgba(240,101,67,0.3)" : C.border}`,
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 8,
              cursor: "pointer",
            }}
          >
            <div style={{ height: 4, background: sub.strip }} />
            <div style={{ padding: "14px 16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: sub.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.white,
                      fontWeight: 800,
                      fontSize: 16,
                    }}
                  >
                    {sub.letter}
                  </div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: C.ink,
                      margin: 0,
                    }}
                  >
                    {sub.name}
                  </p>
                </div>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 700,
                    background: sub.warn
                      ? "rgba(240,101,67,0.1)"
                      : "rgba(13,148,136,0.1)",
                    color: sub.warn ? C.coral : C.teal,
                  }}
                >
                  {sub.warn ? "⚠️ Expiring" : "● Active"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 10,
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <span style={{ fontSize: 20, fontWeight: 800, color: C.ink }}>
                  {sub.price}
                  <span
                    style={{ fontSize: 12, fontWeight: 400, color: C.grey }}
                  >
                    {sub.interval}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: sub.warn ? C.coral : C.grey,
                    fontWeight: sub.warn ? 700 : 400,
                  }}
                >
                  {sub.expires}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
        }}
      >
        {[
          { Icon: QrCode, label: "Check In", sub: "" },
          { Icon: CreditCard, label: "Wallet", sub: "Coming soon" },
          { Icon: Receipt, label: "Payments", sub: "1 pending" },
        ].map(({ Icon, label, sub }, i) => (
          <div
            key={i}
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: 16,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(13,148,136,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 8px",
                color: C.teal,
              }}
            >
              <Icon size={18} />
            </div>
            <p
              style={{ fontSize: 12, fontWeight: 700, color: C.ink, margin: 0 }}
            >
              {label}
            </p>
            {sub && (
              <p
                style={{
                  fontSize: 10,
                  color: i === 2 ? C.coral : C.grey,
                  margin: "2px 0 0",
                  fontWeight: 600,
                }}
              >
                {sub}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MemberCheckIn() {
  const [seconds, setSeconds] = useState(3582);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(seconds / 60),
    s = seconds % 60;
  return (
    <div style={{ padding: 24, overflowY: "auto", height: "100%" }}>
      <h1
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: C.ink,
          margin: "0 0 2px",
        }}
      >
        Check In
      </h1>
      <p style={{ fontSize: 13, color: C.grey, margin: "0 0 16px" }}>
        Generate your check-in code or show your QR
      </p>
      <div
        style={{
          background: C.teal,
          borderRadius: 16,
          padding: 32,
          textAlign: "center",
          marginBottom: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              marginBottom: 16,
            }}
          >
            <Clock size={14} color="white" />
            <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>
              Expires in {m}:{String(s).padStart(2, "0")}
            </span>
          </div>
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.7)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
              margin: "0 0 10px",
            }}
          >
            Your Check-In Code
          </p>
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 12,
              padding: "18px 40px",
              display: "inline-block",
              border: "2px solid rgba(255,255,255,0.25)",
              marginBottom: 14,
            }}
          >
            <span
              style={{
                fontSize: 48,
                fontFamily: "monospace",
                fontWeight: 700,
                color: C.white,
                letterSpacing: 6,
              }}
            >
              847 291
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.8)",
              margin: "0 0 18px",
            }}
          >
            Show this code to staff at the entrance
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            {[
              { icon: <CheckCircle size={14} />, label: "New Code" },
              { icon: <QrCode size={14} />, label: "Show QR" },
            ].map(({ icon, label }) => (
              <button
                key={label}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                  borderRadius: 8,
                  padding: "9px 18px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Nunito, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <p
          style={{
            fontWeight: 700,
            fontSize: 14,
            color: C.teal,
            margin: "0 0 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <CheckCircle size={14} color={C.teal} />
          Recent Check-ins
        </p>
        {["Mon, Mar 20, 2026", "Fri, Mar 17, 2026", "Wed, Mar 15, 2026"].map(
          (date, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: i < 2 ? `1px solid ${C.border}` : "none",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>
                {date}
              </span>
              <span
                style={{
                  padding: "3px 8px",
                  borderRadius: 999,
                  background: "rgba(13,148,136,0.08)",
                  color: C.teal,
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                Checked In
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function PingPage() {
  return (
    <div style={{ padding: 24, overflowY: "auto", height: "100%" }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: C.teal,
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          margin: "0 0 2px",
        }}
      >
        Communications
      </p>
      <h1
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: C.ink,
          margin: "0 0 2px",
        }}
      >
        Member Notifications
      </h1>
      <p style={{ fontSize: 13, color: C.grey, margin: "0 0 16px" }}>
        Send reminders and updates to your members
      </p>
      <div
        style={{
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: C.teal,
            textTransform: "uppercase",
            letterSpacing: "1px",
            margin: "0 0 12px",
          }}
        >
          Select Members
        </p>
        <input
          placeholder="Search by name or email..."
          style={{
            width: "100%",
            background: C.snow,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 13,
            color: C.ink,
            outline: "none",
            fontFamily: "Nunito, sans-serif",
            marginBottom: 10,
          }}
        />
        {[
          {
            n: "Tunde Adeyemi",
            e: "tunde@gmail.com",
            checked: false,
            warn: false,
          },
          {
            n: "Chioma Eze",
            e: "chioma@yahoo.com",
            checked: true,
            warn: false,
          },
          { n: "Emeka Obi", e: "emeka@hotmail.com", checked: true, warn: true },
        ].map((m, i) => (
          <label
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 10,
              borderRadius: 8,
              background: m.checked ? "rgba(13,148,136,0.04)" : C.snow,
              border: `1px solid ${m.checked ? "rgba(13,148,136,0.15)" : "transparent"}`,
              cursor: "pointer",
              marginBottom: 6,
            }}
          >
            <input
              type="checkbox"
              defaultChecked={m.checked}
              style={{ accentColor: C.teal }}
            />
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.ink,
                  margin: 0,
                }}
              >
                {m.n}
              </p>
              <p style={{ fontSize: 11, color: C.grey, margin: 0 }}>
                {m.e}
                {m.warn && (
                  <span style={{ color: C.amber }}> · Expiring soon</span>
                )}
              </p>
            </div>
          </label>
        ))}
        <button
          style={{
            width: "100%",
            marginTop: 10,
            padding: 11,
            background: C.teal,
            border: "none",
            borderRadius: 8,
            color: C.white,
            fontFamily: "Nunito, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Send size={14} /> Send to 2 members
        </button>
      </div>
    </div>
  );
}

// ── TOUR STEPS ─────────────────────────────────────────────────────────────────
const ORG_STEPS: TourStep[] = [
  {
    page: "dashboard",
    title: "Your numbers at a glance",
    text: "Total members, revenue, and who's expiring — live. No spreadsheet needed.",
    tipPos: { top: 210, left: 510 },
  },
  {
    page: "members",
    title: "Your full member list",
    text: "Every member in one place — plan, expiry, status. Instantly see who needs attention.",
    tipPos: { top: 180, left: 500 },
  },
  {
    page: "payments",
    title: "Every payment, verified",
    text: "Who paid, when, how much. Pending flagged automatically. No 'I sent it' drama.",
    tipPos: { top: 180, left: 500 },
  },
  {
    page: "ping",
    title: "Ping members directly",
    text: "Select who to message, pick a template or write your own, send renewal reminders instantly.",
    tipPos: { top: 180, left: 500 },
  },
];

const MEMBER_STEPS: TourStep[] = [
  {
    page: "mdashboard",
    title: "Member dashboard",
    text: "Active subs, expiry alerts, and quick actions — clean and clear for every member.",
    tipPos: { top: 180, left: 480 },
  },
  {
    page: "checkin",
    title: "Check-in with a code",
    text: "Members generate a secure 6-digit code to show at the door. History logged automatically.",
    tipPos: { top: 180, left: 480 },
  },
];

const URL_MAP: Record<ActivePage, string> = {
  dashboard: "app.reetrack.com/organization/dashboard",
  members: "app.reetrack.com/organization/members",
  payments: "app.reetrack.com/organization/payments",
  plans: "app.reetrack.com/organization/plans",
  checkins: "app.reetrack.com/organization/check-ins",
  ping: "app.reetrack.com/organization/ping",
  reports: "app.reetrack.com/organization/reports",
  mdashboard: "app.reetrack.com/member/dashboard",
  subscriptions: "app.reetrack.com/member/subscriptions",
  community: "app.reetrack.com/member/communities",
  checkin: "app.reetrack.com/member/check-in",
  mpayments: "app.reetrack.com/member/payments",
};

// ── MAIN ───────────────────────────────────────────────────────────────────────
export default function ReetrackDemoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<View>("org");
  const [activePage, setActivePage] = useState<ActivePage>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const tourStarted = useRef(false);

  const tourSteps = view === "org" ? ORG_STEPS : MEMBER_STEPS;

  // ── Scroll into view → start tour once ──────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (!tourStarted.current) {
            tourStarted.current = true;
            setTimeout(() => setTourStep(0), 600);
          }
        }
      },
      { threshold: 0.35 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Sync page with tour step ─────────────────────────────────────────────────
  useEffect(() => {
    if (tourStep !== null && tourSteps[tourStep]) {
      setActivePage(tourSteps[tourStep].page);
    }
  }, [tourStep]);

  const handleNext = () => {
    if (tourStep === null) return;
    if (tourStep < tourSteps.length - 1) setTourStep(tourStep + 1);
    else setTourStep(null);
  };

  const handleSwitchView = (v: View) => {
    setView(v);
    setTourStep(null);
    setActivePage(v === "org" ? "dashboard" : "mdashboard");
    setTimeout(() => setTourStep(0), 300);
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <OrgDashboard />;
      case "members":
        return <OrgMembers />;
      case "payments":
        return <OrgPayments />;
      case "ping":
        return <PingPage />;
      case "mdashboard":
        return <MemberDashboard />;
      case "checkin":
        return <MemberCheckIn />;
      default:
        return <OrgDashboard />;
    }
  };

  const currentStep = tourStep !== null ? tourSteps[tourStep] : null;

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        maxWidth: 1080,
        margin: "0 auto",
        padding: "80px 24px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <style>{`
        @keyframes tooltipIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Browser shell */}
      <div
        style={{
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 24px 72px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        {/* View tabs */}
        <div style={{ background: "#f0f0f5", padding: 4, display: "flex" }}>
          {(["org", "member"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => handleSwitchView(v)}
              style={{
                flex: 1,
                padding: "9px 14px",
                textAlign: "center",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                borderRadius: 7,
                border: "none",
                fontFamily: "Nunito, sans-serif",
                background: view === v ? C.white : "transparent",
                color: view === v ? C.teal : C.grey,
                boxShadow: view === v ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s",
              }}
            >
              {v === "org" ? " Organization View" : " Member View"}
            </button>
          ))}
        </div>

        {/* Browser bar */}
        <div
          style={{
            background: "#f0f0f5",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid #ddd",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div
                key={c}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: c,
                }}
              />
            ))}
          </div>
          <div
            style={{
              flex: 1,
              background: C.white,
              borderRadius: 6,
              padding: "5px 12px",
              fontSize: 12,
              color: C.grey,
              border: "1px solid #ddd",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            {URL_MAP[activePage]}
          </div>
        </div>

        {/* App */}
        <div
          style={{
            display: "flex",
            height: 580,
            background: C.snow,
            position: "relative",
          }}
        >
          {/* Sidebar + toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              padding: "12px 0 12px 12px",
            }}
          >
            <Sidebar
              view={view}
              activePage={activePage}
              collapsed={collapsed}
              onNavigate={(p) => {
                setTourStep(null);
                setActivePage(p);
              }}
            />
            <button
              onClick={() => setCollapsed((c) => !c)}
              style={{
                position: "relative",
                marginLeft: -1,
                width: 24,
                borderRadius: "0 8px 8px 0",
                border: `1px solid ${C.border}`,
                borderLeft: "none",
                background: C.white,
                color: C.grey,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
                transition: "all 200ms",
                flexShrink: 0,
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.teal;
                e.currentTarget.style.color = C.white;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.white;
                e.currentTarget.style.color = C.grey;
              }}
            >
              {collapsed ? (
                <ChevronRight size={13} />
              ) : (
                <ChevronLeft size={13} />
              )}
            </button>
          </div>

          {/* Main content */}
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            {renderPage()}
          </div>

          {/* Tour tooltip */}
          {currentStep && (
            <TourTooltip
              step={tourStep! + 1}
              total={tourSteps.length}
              title={currentStep.title}
              text={currentStep.text}
              pos={currentStep.tipPos}
              onNext={handleNext}
              onSkip={() => setTourStep(null)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
