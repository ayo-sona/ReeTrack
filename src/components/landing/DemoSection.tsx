"use client";

import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Send,
  FileDown,
  Receipt,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  Home,
  QrCode,
  Building2,
  Package,
  BarChart2,
  ChevronRight,
  ChevronLeft,
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

// Spread onto every container to prevent dark-mode UA overrides bleeding in.
const LIGHT: React.CSSProperties = { colorScheme: "light" };

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

interface TourStep {
  page: ActivePage;
  title: string;
  text: string;
}

// ── HOOK: window width ─────────────────────────────────────────────────────────
function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

// ── SHARED: STATUS BADGE ───────────────────────────────────────────────────────
function StatusBadge({
  status,
  small,
}: {
  status: "active" | "expiring" | "expired" | "pending";
  small?: boolean;
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
        ...LIGHT,
        padding: small ? "2px 7px" : "3px 9px",
        borderRadius: 999,
        fontSize: small ? 9 : 10,
        fontWeight: 700,
        background: cfg.bg,
        color: cfg.color,
      }}
    >
      {cfg.label}
    </span>
  );
}

// ── SHARED: STAT CARD ──────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  change,
  changeType = "up",
  icon: Icon,
  small,
}: {
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "warn";
  icon: React.ElementType;
  small?: boolean;
}) {
  return (
    <div
      style={{
        ...LIGHT,
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: small ? 10 : 12,
        padding: small ? "10px 12px" : "12px 14px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: small ? 6 : 8,
        }}
      >
        <p
          style={{
            fontSize: small ? 9 : 10,
            fontWeight: 700,
            color: C.grey,
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            margin: 0,
          }}
        >
          {label}
        </p>
        <div
          style={{
            width: small ? 22 : 26,
            height: small ? 22 : 26,
            borderRadius: 7,
            background: "rgba(13,148,136,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.teal,
          }}
        >
          <Icon size={small ? 10 : 12} />
        </div>
      </div>
      <p
        style={{
          fontSize: small ? 18 : 22,
          fontWeight: 800,
          color: C.ink,
          letterSpacing: "-0.5px",
          margin: "0 0 2px",
        }}
      >
        {value}
      </p>
      {change && (
        <p
          style={{
            fontSize: small ? 9 : 10,
            fontWeight: 600,
            margin: 0,
            color: changeType === "warn" ? C.coral : C.green,
          }}
        >
          {change}
        </p>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ORG PAGES
// ══════════════════════════════════════════════════════════════════════════════

function OrgDashboardDesktop() {
  const data = [420, 510, 390, 600, 720, 690, 847];
  const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const max = Math.max(...data);
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      style={{
        ...LIGHT,
        padding: "18px 16px",
        overflowY: "auto",
        height: "100%",
        fontFamily: "Nunito, sans-serif",
        background: C.snow,
        color: C.ink,
      }}
    >
      <p
        style={{
          fontSize: 10,
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
          fontSize: 17,
          fontWeight: 800,
          color: C.ink,
          margin: "0 0 1px",
        }}
      >
        Dashboard
      </h1>
      <p style={{ fontSize: 11, color: C.grey, margin: "0 0 14px" }}>
        Here's an overview of how things have been so far.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <StatCard
          label="Members"
          value="148"
          change="↑ 12 this month"
          icon={Users}
          small
        />
        <StatCard
          label="Active"
          value="134"
          change="90.5% rate"
          icon={CheckCircle}
          small
        />
        <StatCard
          label="Revenue"
          value="₦847k"
          change="↑ 18% MoM"
          icon={TrendingUp}
          small
        />
        <StatCard
          label="Expiring"
          value="9"
          change="Needs attention"
          changeType="warn"
          icon={AlertCircle}
          small
        />
      </div>
      <div
        style={{
          ...LIGHT,
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: "12px 14px",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, color: C.ink, margin: 0 }}>
            Monthly Revenue
          </p>
          <span
            style={{
              fontSize: 9,
              padding: "2px 7px",
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
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 4,
            height: 52,
          }}
        >
          {data.map((v, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <div
                style={{
                  width: "100%",
                  borderRadius: "3px 3px 0 0",
                  background:
                    i === data.length - 1 ? C.teal : "rgba(13,148,136,0.3)",
                  height: animated ? Math.round((v / max) * 46) + "px" : "2px",
                  minHeight: 2,
                  transition: `height 0.7s ease ${i * 60}ms`,
                }}
              />
              <span style={{ fontSize: 8, color: C.grey, fontWeight: 600 }}>
                {months[i]}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div
          style={{
            ...LIGHT,
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "12px 14px",
          }}
        >
          <p
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: C.grey,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              margin: "0 0 8px",
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
                gap: 7,
                padding: "5px 0",
                borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: item.dot,
                  flexShrink: 0,
                }}
              />
              <span
                style={{ flex: 1, color: C.ink, fontWeight: 600, fontSize: 10 }}
              >
                {item.text}
              </span>
              <span style={{ color: C.grey, fontSize: 9 }}>{item.time}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            ...LIGHT,
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "12px 14px",
          }}
        >
          <p
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: C.grey,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              margin: "0 0 8px",
            }}
          >
            Expiring This Week
          </p>
          {[
            { name: "Emeka Obi", plan: "Monthly Plan", days: "3 days" },
            { name: "Aisha Bello", plan: "Quarterly Plan", days: "5 days" },
            { name: "Segun Adeyemi", plan: "Monthly", days: "6 days" },
            { name: "Ngozi Eze", plan: "Annual Plan", days: "7 days" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
              }}
            >
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    color: C.ink,
                    margin: 0,
                    fontSize: 10,
                  }}
                >
                  {item.name}
                </p>
                <p style={{ fontSize: 9, color: C.grey, margin: 0 }}>
                  {item.plan}
                </p>
              </div>
              <span style={{ fontSize: 9, color: C.amber, fontWeight: 700 }}>
                {item.days}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrgMembersDesktop() {
  const members = [
    {
      i: "TA",
      name: "Tunde Adeyemi",
      email: "tunde@gmail.com",
      plan: "Monthly",
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
      expires: "Apr 1",
      status: "active" as const,
      bg: "rgba(13,148,136,0.12)",
      c: C.teal,
    },
  ];
  return (
    <div
      style={{
        ...LIGHT,
        padding: "18px 16px",
        overflowY: "auto",
        height: "100%",
        fontFamily: "Nunito, sans-serif",
        background: C.snow,
        color: C.ink,
      }}
    >
      <h1
        style={{
          fontSize: 17,
          fontWeight: 800,
          color: C.ink,
          margin: "0 0 2px",
        }}
      >
        Members
      </h1>
      <p style={{ fontSize: 11, color: C.grey, margin: "0 0 12px" }}>
        Manage and monitor all member subscriptions
      </p>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <input
          placeholder="Search members..."
          style={{
            ...LIGHT,
            flex: 1,
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 7,
            padding: "7px 10px",
            fontSize: 11,
            color: C.ink,
            outline: "none",
            fontFamily: "Nunito, sans-serif",
          }}
        />
        <button
          style={{
            ...LIGHT,
            background: C.teal,
            border: "none",
            borderRadius: 7,
            padding: "7px 12px",
            fontSize: 11,
            cursor: "pointer",
            color: C.white,
            fontFamily: "Nunito, sans-serif",
            fontWeight: 700,
          }}
        >
          + Add
        </button>
      </div>
      <div
        style={{
          ...LIGHT,
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}
        >
          <thead>
            <tr
              style={{
                background: C.snow,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {["Member", "Plan", "Expires", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "8px 12px",
                    textAlign: "left",
                    fontSize: 9,
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
                  background: C.white,
                }}
              >
                <td style={{ padding: "9px 12px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 7 }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: m.bg,
                        color: m.c,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
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
                          fontSize: 11,
                          color: C.ink,
                          margin: 0,
                        }}
                      >
                        {m.name}
                      </p>
                      <p style={{ fontSize: 9, color: C.grey, margin: 0 }}>
                        {m.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "9px 12px", color: C.ink, fontSize: 11 }}>
                  {m.plan}
                </td>
                <td
                  style={{ padding: "9px 12px", color: C.grey, fontSize: 11 }}
                >
                  {m.expires}
                </td>
                <td style={{ padding: "9px 12px" }}>
                  <StatusBadge status={m.status} small />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrgPaymentsDesktop() {
  const txns = [
    {
      icon: <CreditCard size={13} color={C.green} />,
      bg: "rgba(5,150,105,0.1)",
      name: "Tunde — Monthly Renewal",
      date: "Today, 2:14pm",
      amt: "+₦15,000",
      color: C.green,
    },
    {
      icon: <CreditCard size={13} color={C.green} />,
      bg: "rgba(5,150,105,0.1)",
      name: "Chioma — New Membership",
      date: "Today, 11:02am",
      amt: "+₦45,000",
      color: C.green,
    },
    {
      icon: <Clock size={13} color={C.amber} />,
      bg: "rgba(217,119,6,0.1)",
      name: "Emeka — Renewal Pending",
      date: "Due Mar 23",
      amt: "₦15,000",
      color: C.amber,
    },
    {
      icon: <CreditCard size={13} color={C.green} />,
      bg: "rgba(5,150,105,0.1)",
      name: "Segun — Quarterly",
      date: "Yesterday",
      amt: "+₦40,000",
      color: C.green,
    },
    {
      icon: <AlertCircle size={13} color={C.coral} />,
      bg: "rgba(240,101,67,0.1)",
      name: "Aisha — Expired",
      date: "Mar 10",
      amt: "₦60,000",
      color: C.coral,
    },
  ];
  return (
    <div
      style={{
        ...LIGHT,
        padding: "18px 16px",
        overflowY: "auto",
        height: "100%",
        fontFamily: "Nunito, sans-serif",
        background: C.snow,
        color: C.ink,
      }}
    >
      <h1
        style={{
          fontSize: 17,
          fontWeight: 800,
          color: C.ink,
          margin: "0 0 2px",
        }}
      >
        Payments
      </h1>
      <p style={{ fontSize: 11, color: C.grey, margin: "0 0 12px" }}>
        All transactions · March 2025
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <StatCard
          label="Collected"
          value="₦847k"
          change="This month"
          icon={TrendingUp}
          small
        />
        <StatCard
          label="Pending"
          value="₦63k"
          change="4 owing"
          changeType="warn"
          icon={Clock}
          small
        />
        <StatCard
          label="Transactions"
          value="124"
          change="↑ vs 98 last mo"
          icon={BarChart2}
          small
        />
      </div>
      <div
        style={{
          ...LIGHT,
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: "12px 14px",
        }}
      >
        <p
          style={{
            fontSize: 9,
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
              padding: "9px 0",
              borderBottom:
                i < txns.length - 1 ? `1px solid ${C.border}` : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
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
                    fontSize: 11,
                    color: C.ink,
                    margin: 0,
                  }}
                >
                  {t.name}
                </p>
                <p style={{ fontSize: 9, color: C.grey, margin: 0 }}>
                  {t.date}
                </p>
              </div>
            </div>
            <span style={{ fontWeight: 800, fontSize: 12, color: t.color }}>
              {t.amt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrgPingDesktop() {
  return (
    <div
      style={{
        ...LIGHT,
        padding: "18px 16px",
        overflowY: "auto",
        height: "100%",
        fontFamily: "Nunito, sans-serif",
        background: C.snow,
        color: C.ink,
      }}
    >
      <p
        style={{
          fontSize: 10,
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
          fontSize: 17,
          fontWeight: 800,
          color: C.ink,
          margin: "0 0 2px",
        }}
      >
        Ping Members
      </h1>
      <p style={{ fontSize: 11, color: C.grey, margin: "0 0 14px" }}>
        Send reminders and updates to your members
      </p>
      <div
        style={{
          ...LIGHT,
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: "14px",
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: C.teal,
            textTransform: "uppercase",
            letterSpacing: "1px",
            margin: "0 0 10px",
          }}
        >
          Select Members
        </p>
        <input
          placeholder="Search by name or email..."
          style={{
            ...LIGHT,
            width: "100%",
            background: C.snow,
            border: `1px solid ${C.border}`,
            borderRadius: 7,
            padding: "7px 10px",
            fontSize: 11,
            color: C.ink,
            outline: "none",
            fontFamily: "Nunito, sans-serif",
            marginBottom: 8,
            boxSizing: "border-box",
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
              ...LIGHT,
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "8px 10px",
              borderRadius: 7,
              background: m.checked ? "rgba(13,148,136,0.04)" : C.snow,
              border: `1px solid ${m.checked ? "rgba(13,148,136,0.15)" : "transparent"}`,
              cursor: "pointer",
              marginBottom: 5,
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
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.ink,
                  margin: 0,
                }}
              >
                {m.n}
              </p>
              <p style={{ fontSize: 10, color: C.grey, margin: 0 }}>
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
            ...LIGHT,
            width: "100%",
            marginTop: 8,
            padding: 9,
            background: C.teal,
            border: "none",
            borderRadius: 7,
            color: C.white,
            fontFamily: "Nunito, sans-serif",
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
          }}
        >
          <Send size={12} /> Send to 2 members
        </button>
      </div>
    </div>
  );
}

// ── ORG NAV ITEM ───────────────────────────────────────────────────────────────
function OrgNavItem({
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
        ...LIGHT,
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: collapsed ? "8px" : "8px 12px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 8,
        background: active
          ? "rgba(13,148,136,0.08)"
          : hovered
            ? "rgba(13,148,136,0.04)"
            : C.white,
        color: active ? C.teal : C.ink,
        fontWeight: active ? 700 : 400,
        fontSize: 12,
        cursor: "pointer",
        transition: "all 150ms",
        border: active
          ? "1px solid rgba(13,148,136,0.18)"
          : "1px solid transparent",
        marginBottom: 1,
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <Icon size={14} />
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
            left: "calc(100% + 8px)",
            top: "50%",
            transform: "translateY(-50%)",
            background: C.ink,
            color: C.white,
            padding: "4px 10px",
            borderRadius: 5,
            fontSize: 11,
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

// ── DESKTOP SIDEBAR ────────────────────────────────────────────────────────────
function DesktopSidebar({
  activePage,
  collapsed,
  onNavigate,
}: {
  activePage: ActivePage;
  collapsed: boolean;
  onNavigate: (p: ActivePage) => void;
}) {
  const nav = [
    { id: "dashboard" as OrgPage, icon: LayoutDashboard, label: "Dashboard" },
    { id: "members" as OrgPage, icon: Users, label: "Members" },
    { id: "plans" as OrgPage, icon: Package, label: "Plans" },
    { id: "payments" as OrgPage, icon: CreditCard, label: "Payments" },
    { id: "ping" as OrgPage, icon: Send, label: "Ping" },
    { id: "reports" as OrgPage, icon: FileDown, label: "Reports" },
  ];
  return (
    <aside
      style={{
        ...LIGHT,
        width: collapsed ? 52 : 180,
        transition: "width 300ms cubic-bezier(0.16,1,0.3,1)",
        height: "100%",
        background: C.white,
        borderRight: `1px solid ${C.border}`,
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
          padding: collapsed ? "14px 8px" : "14px 12px",
          transition: "padding 300ms",
        }}
      >
        <div
          style={{
            marginBottom: 16,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            flexShrink: 0,
          }}
        >
          {collapsed ? (
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: C.teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.white,
                fontWeight: 800,
                fontSize: 11,
              }}
            >
              R
            </div>
          ) : (
            <Logo size={22} />
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
            <OrgNavItem
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
            paddingTop: 10,
            marginTop: 6,
            borderTop: `1px solid ${C.border}`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              ...LIGHT,
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: collapsed ? 6 : "7px 10px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 999,
              border: `1px solid ${C.border}`,
              background: C.snow,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: C.teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.white,
                fontWeight: 800,
                fontSize: 9,
                flexShrink: 0,
              }}
            >
              AO
            </div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 10,
                    color: C.ink,
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Ayo Okonkwo
                </p>
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: 9,
                    color: C.grey,
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  ayo@fitspace.ng
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MEMBER PAGES
// ══════════════════════════════════════════════════════════════════════════════

function MemberDashboardMobile() {
  return (
    <div
      style={{
        ...LIGHT,
        padding: "14px 12px",
        overflowY: "auto",
        height: "100%",
        fontFamily: "Nunito, sans-serif",
        background: C.snow,
        color: C.ink,
      }}
    >
      <h1
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: C.ink,
          margin: "0 0 2px",
        }}
      >
        Welcome back, Tunde! 👋
      </h1>
      <p style={{ fontSize: 11, color: C.grey, margin: "0 0 12px" }}>
        Manage your subscriptions and payments
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 7,
          marginBottom: 12,
        }}
      >
        <StatCard label="Active Subs" value="2" icon={CreditCard} small />
        <StatCard
          label="Pending"
          value="1"
          changeType="warn"
          change="Action needed"
          icon={Receipt}
          small
        />
      </div>
      <div
        style={{
          ...LIGHT,
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: "10px 12px",
          marginBottom: 10,
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: C.teal,
            margin: "0 0 8px",
          }}
        >
          Active Subscriptions
        </p>
        {[
          {
            letter: "M",
            name: "Monthly Plan",
            price: "₦15,000",
            interval: "/mo",
            expires: "Expires Apr 15",
            color: C.teal,
            strip: C.teal,
            warn: false,
          },
          {
            letter: "Q",
            name: "Quarterly Plan",
            price: "₦40,000",
            interval: "/qtr",
            expires: "⚠️ 3 days left!",
            color: C.amber,
            strip: C.coral,
            warn: true,
          },
        ].map((sub, i) => (
          <div
            key={i}
            style={{
              ...LIGHT,
              border: `1px solid ${sub.warn ? "rgba(240,101,67,0.3)" : C.border}`,
              borderRadius: 10,
              overflow: "hidden",
              marginBottom: 6,
              background: C.white,
            }}
          >
            <div style={{ height: 3, background: sub.strip }} />
            <div style={{ padding: "10px 12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 7,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      background: sub.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.white,
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  >
                    {sub.letter}
                  </div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: 11,
                      color: C.ink,
                      margin: 0,
                    }}
                  >
                    {sub.name}
                  </p>
                </div>
                <span
                  style={{
                    padding: "2px 7px",
                    borderRadius: 999,
                    fontSize: 9,
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
                  paddingTop: 7,
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>
                  {sub.price}
                  <span
                    style={{ fontSize: 10, fontWeight: 400, color: C.grey }}
                  >
                    {sub.interval}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: 10,
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
          gap: 7,
        }}
      >
        {[
          { Icon: QrCode, label: "Check In", sub: "" },
          { Icon: CreditCard, label: "Wallet", sub: "Soon" },
          { Icon: Receipt, label: "Payments", sub: "1 pending" },
        ].map(({ Icon, label, sub }, i) => (
          <div
            key={i}
            style={{
              ...LIGHT,
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "10px 6px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "rgba(13,148,136,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 5px",
                color: C.teal,
              }}
            >
              <Icon size={13} />
            </div>
            <p
              style={{ fontSize: 10, fontWeight: 700, color: C.ink, margin: 0 }}
            >
              {label}
            </p>
            {sub && (
              <p
                style={{
                  fontSize: 9,
                  color: i === 2 ? C.coral : C.grey,
                  margin: "1px 0 0",
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

function MemberCheckInMobile() {
  const [seconds, setSeconds] = useState(3582);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(seconds / 60),
    s = seconds % 60;
  return (
    <div
      style={{
        ...LIGHT,
        padding: "14px 12px",
        overflowY: "auto",
        height: "100%",
        fontFamily: "Nunito, sans-serif",
        background: C.snow,
        color: C.ink,
      }}
    >
      <h1
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: C.ink,
          margin: "0 0 2px",
        }}
      >
        Check In
      </h1>
      <p style={{ fontSize: 11, color: C.grey, margin: "0 0 12px" }}>
        Generate your check-in code or show QR
      </p>
      <div
        style={{
          background: C.teal,
          borderRadius: 14,
          padding: "20px 14px",
          textAlign: "center",
          marginBottom: 12,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              marginBottom: 10,
            }}
          >
            <Clock size={11} color="white" />
            <span style={{ color: "white", fontSize: 10, fontWeight: 700 }}>
              Expires in {m}:{String(s).padStart(2, "0")}
            </span>
          </div>
          <p
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.7)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
              margin: "0 0 6px",
            }}
          >
            Your Check-In Code
          </p>
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 10,
              padding: "12px 20px",
              display: "inline-block",
              border: "2px solid rgba(255,255,255,0.25)",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontFamily: "monospace",
                fontWeight: 700,
                color: C.white,
                letterSpacing: 4,
              }}
            >
              847 291
            </span>
          </div>
          <p
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.8)",
              margin: "0 0 10px",
            }}
          >
            Show this code to staff at the entrance
          </p>
          <div style={{ display: "flex", gap: 7, justifyContent: "center" }}>
            {[
              { icon: <CheckCircle size={11} />, label: "New Code" },
              { icon: <QrCode size={11} />, label: "Show QR" },
            ].map(({ icon, label }) => (
              <button
                key={label}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                  borderRadius: 7,
                  padding: "6px 12px",
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Nunito, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
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
          ...LIGHT,
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: "10px 12px",
        }}
      >
        <p
          style={{
            fontWeight: 700,
            fontSize: 11,
            color: C.teal,
            margin: "0 0 8px",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <CheckCircle size={11} color={C.teal} /> Recent Check-ins
        </p>
        {["Mon, Mar 20, 2026", "Fri, Mar 17, 2026", "Wed, Mar 15, 2026"].map(
          (date, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: i < 2 ? `1px solid ${C.border}` : "none",
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 600, color: C.ink }}>
                {date}
              </span>
              <span
                style={{
                  padding: "2px 7px",
                  borderRadius: 999,
                  background: "rgba(13,148,136,0.08)",
                  color: C.teal,
                  fontSize: 9,
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

function MemberPaymentsMobile() {
  return (
    <div
      style={{
        ...LIGHT,
        padding: "14px 12px",
        overflowY: "auto",
        height: "100%",
        fontFamily: "Nunito, sans-serif",
        background: C.snow,
        color: C.ink,
      }}
    >
      <h1
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: C.ink,
          margin: "0 0 2px",
        }}
      >
        Payments
      </h1>
      <p style={{ fontSize: 11, color: C.grey, margin: "0 0 12px" }}>
        Your billing history
      </p>
      {[
        {
          name: "Monthly Plan — Renewal",
          date: "Mar 15, 2026",
          amt: "₦15,000",
          color: C.green,
          icon: <CheckCircle size={13} color={C.green} />,
          bg: "rgba(5,150,105,0.1)",
        },
        {
          name: "Quarterly Plan — Pending",
          date: "Due Mar 23",
          amt: "₦40,000",
          color: C.amber,
          icon: <Clock size={13} color={C.amber} />,
          bg: "rgba(217,119,6,0.1)",
        },
        {
          name: "Monthly Plan — Renewal",
          date: "Feb 15, 2026",
          amt: "₦15,000",
          color: C.green,
          icon: <CheckCircle size={13} color={C.green} />,
          bg: "rgba(5,150,105,0.1)",
        },
      ].map((t, i) => (
        <div
          key={i}
          style={{
            ...LIGHT,
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "10px 12px",
            marginBottom: 7,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
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
                  fontSize: 11,
                  color: C.ink,
                  margin: 0,
                }}
              >
                {t.name}
              </p>
              <p style={{ fontSize: 9, color: C.grey, margin: 0 }}>{t.date}</p>
            </div>
          </div>
          <span style={{ fontWeight: 800, fontSize: 12, color: t.color }}>
            {t.amt}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── MEMBER BOTTOM NAV ──────────────────────────────────────────────────────────
function MemberBottomNav({
  activePage,
  onNavigate,
}: {
  activePage: ActivePage;
  onNavigate: (p: ActivePage) => void;
}) {
  const nav = [
    { id: "mdashboard" as MemberPage, icon: Home, label: "Home" },
    { id: "subscriptions" as MemberPage, icon: CreditCard, label: "Subs" },
    { id: "community" as MemberPage, icon: Building2, label: "Space" },
    { id: "checkin" as MemberPage, icon: QrCode, label: "Check In" },
    { id: "mpayments" as MemberPage, icon: Receipt, label: "Payments" },
  ];
  return (
    <div
      style={{
        ...LIGHT,
        display: "flex",
        background: C.white,
        borderTop: `1px solid ${C.border}`,
        padding: "5px 0 8px",
        flexShrink: 0,
      }}
    >
      {nav.map((item) => {
        const active = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              ...LIGHT,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "4px 0",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: active ? C.teal : C.grey,
              fontFamily: "Nunito, sans-serif",
            }}
          >
            <item.icon size={15} strokeWidth={active ? 2.5 : 1.8} />
            <span style={{ fontSize: 8, fontWeight: active ? 700 : 500 }}>
              {item.label}
            </span>
            {active && (
              <div
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: C.teal,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
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
  mobile,
}: {
  step: number;
  total: number;
  title: string;
  text: string;
  pos?: { top: number; left: number };
  onNext: () => void;
  onSkip: () => void;
  mobile?: boolean;
}) {
  const base: React.CSSProperties = {
    ...LIGHT,
    background: C.white,
    border: `1.5px solid ${C.teal}`,
    borderRadius: 10,
    zIndex: 200,
    fontFamily: "Nunito, sans-serif",
    animation: "tooltipIn 0.35s ease forwards",
  };
  const style: React.CSSProperties = mobile
    ? {
        ...base,
        position: "absolute",
        bottom: 60,
        left: 8,
        right: 8,
        padding: "12px 14px",
        boxShadow: "0 8px 32px rgba(13,148,136,0.22)",
      }
    : {
        ...base,
        position: "absolute",
        top: pos?.top ?? 180,
        left: pos?.left ?? 200,
        width: 220,
        padding: "13px 15px",
        boxShadow: "0 8px 32px rgba(13,148,136,0.2)",
      };
  return (
    <div style={style}>
      <div style={{ display: "flex", gap: 4, marginBottom: 7 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 4,
              borderRadius: 2,
              width: i === step - 1 ? 12 : 4,
              background: i < step ? C.teal : C.border,
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
      <p
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: C.teal,
          letterSpacing: "2px",
          textTransform: "uppercase",
          margin: "0 0 4px",
        }}
      >
        Step {step} of {total}
      </p>
      <p
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: C.ink,
          margin: "0 0 5px",
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: 11,
          color: C.grey,
          lineHeight: 1.6,
          margin: "0 0 10px",
        }}
      >
        {text}
      </p>
      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
        <button
          onClick={onSkip}
          style={{
            ...LIGHT,
            padding: "5px 10px",
            borderRadius: 5,
            fontSize: 10,
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
            ...LIGHT,
            padding: "5px 12px",
            borderRadius: 5,
            fontSize: 10,
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

// ── TOUR STEPS ─────────────────────────────────────────────────────────────────
const ORG_STEPS: TourStep[] = [
  {
    page: "dashboard",
    title: "Your numbers at a glance",
    text: "Members, revenue, and who's expiring — live. No spreadsheet needed.",
  },
  {
    page: "members",
    title: "Your full member list",
    text: "Every member, their plan, expiry and status. See who needs attention instantly.",
  },
  {
    page: "payments",
    title: "Every payment, verified",
    text: "Who paid, when, how much. Pending flagged automatically.",
  },
  {
    page: "ping",
    title: "Ping members directly",
    text: "Select who to message and send renewal reminders in seconds.",
  },
];

const MEMBER_STEPS: TourStep[] = [
  {
    page: "mdashboard",
    title: "Member dashboard",
    text: "Active subs, expiry alerts, and quick actions — clean and clear.",
  },
  {
    page: "checkin",
    title: "Check-in with a code",
    text: "Generate a secure 6-digit code to show at the door. History logged automatically.",
  },
  {
    page: "mpayments",
    title: "Payment history",
    text: "Every invoice and renewal in one place. No chasing receipts.",
  },
];

const ORG_TOOLTIP_POS: Record<string, { top: number; left: number }> = {
  dashboard: { top: 190, left: 195 },
  members: { top: 190, left: 195 },
  payments: { top: 190, left: 195 },
  ping: { top: 190, left: 195 },
};

// ══════════════════════════════════════════════════════════════════════════════
// LAPTOP FRAME
// ══════════════════════════════════════════════════════════════════════════════
function LaptopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          background: "linear-gradient(160deg, #2C2C2E 0%, #1C1C1E 100%)",
          borderRadius: "14px 14px 0 0",
          padding: "10px 10px 0",
          boxShadow:
            "0 0 0 1px #3A3A3C, 0 -1px 0 rgba(255,255,255,0.07) inset, 0 8px 32px rgba(0,0,0,0.28)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 7,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#2A2A2C",
              border: "1.5px solid #444",
              boxShadow: "0 0 0 2px rgba(255,255,255,0.04)",
            }}
          />
        </div>
        <div
          style={{
            borderRadius: "6px 6px 0 0",
            overflow: "hidden",
            background: C.snow,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.5) inset",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 50,
              background:
                "linear-gradient(180deg,rgba(255,255,255,0.035) 0%,transparent 100%)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
          {children}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: 5,
          background: "linear-gradient(180deg, #3C3C3E 0%, #28282A 100%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset",
          border: "1px solid #3A3A3C",
          borderTop: "none",
          borderBottom: "none",
        }}
      />
      <div
        style={{
          width: "108%",
          height: 20,
          background: "linear-gradient(180deg, #2C2C2E 0%, #1E1E20 100%)",
          borderRadius: "0 0 10px 10px",
          border: "1px solid #3A3A3C",
          borderTop: "none",
          boxShadow:
            "0 8px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 10,
            borderRadius: 4,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        />
      </div>
      <div
        style={{
          width: "85%",
          height: 8,
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, transparent 70%)",
          marginTop: 1,
        }}
      />
    </div>
  );
}

// ── DESKTOP APP CONTENT ────────────────────────────────────────────────────────
function DesktopApp({
  activePage,
  onNavigate,
  tourStep,
  tourSteps,
  onNext,
  onSkip,
}: {
  activePage: ActivePage;
  onNavigate: (p: ActivePage) => void;
  tourStep: number | null;
  tourSteps: TourStep[];
  onNext: () => void;
  onSkip: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <OrgDashboardDesktop />;
      case "members":
        return <OrgMembersDesktop />;
      case "payments":
        return <OrgPaymentsDesktop />;
      case "ping":
        return <OrgPingDesktop />;
      default:
        return <OrgDashboardDesktop />;
    }
  };
  const currentStep = tourStep !== null ? tourSteps[tourStep] : null;
  return (
    <div
      style={{
        ...LIGHT,
        display: "flex",
        height: "100%",
        background: C.snow,
        position: "relative",
      }}
    >
      <DesktopSidebar
        activePage={activePage}
        collapsed={collapsed}
        onNavigate={onNavigate}
      />
      <button
        onClick={() => setCollapsed((c) => !c)}
        style={{
          ...LIGHT,
          position: "relative",
          marginLeft: -1,
          width: 18,
          border: `1px solid ${C.border}`,
          borderLeft: "none",
          background: C.white,
          color: C.grey,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "2px 0 6px rgba(0,0,0,0.05)",
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
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {renderPage()}
      </div>
      {currentStep && (
        <TourTooltip
          step={tourStep! + 1}
          total={tourSteps.length}
          title={currentStep.title}
          text={currentStep.text}
          pos={ORG_TOOLTIP_POS[currentStep.page]}
          onNext={onNext}
          onSkip={onSkip}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// IPHONE FRAME
// ══════════════════════════════════════════════════════════════════════════════
function IPhoneFrame({
  children,
  time,
}: {
  children: React.ReactNode;
  time: string;
}) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div
        style={{
          borderRadius: 40,
          background: "#1A1A1A",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1.5px #3A3A3A, inset 0 0 0 1.5px rgba(255,255,255,0.06)",
          padding: "10px 10px 12px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -2.5,
            top: 88,
            width: 3,
            height: 24,
            background: "#2A2A2A",
            borderRadius: "2px 0 0 2px",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -2.5,
            top: 124,
            width: 3,
            height: 42,
            background: "#2A2A2A",
            borderRadius: "2px 0 0 2px",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -2.5,
            top: 178,
            width: 3,
            height: 42,
            background: "#2A2A2A",
            borderRadius: "2px 0 0 2px",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -2.5,
            top: 130,
            width: 3,
            height: 60,
            background: "#2A2A2A",
            borderRadius: "0 2px 2px 0",
          }}
        />
        <div
          style={{
            ...LIGHT,
            borderRadius: 32,
            overflow: "hidden",
            background: C.snow,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 9,
              left: "50%",
              transform: "translateX(-50%)",
              width: 90,
              height: 26,
              background: "#000",
              borderRadius: 14,
              zIndex: 50,
            }}
          />
          <div
            style={{
              ...LIGHT,
              height: 42,
              background: C.white,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              padding: "0 20px 7px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.ink,
                fontFamily: "Nunito, sans-serif",
              }}
            >
              {time}
            </span>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <svg width="13" height="10" viewBox="0 0 13 10">
                <rect
                  x="0"
                  y="5"
                  width="2.5"
                  height="5"
                  rx="0.4"
                  fill={C.ink}
                />
                <rect
                  x="3.5"
                  y="3"
                  width="2.5"
                  height="7"
                  rx="0.4"
                  fill={C.ink}
                />
                <rect
                  x="7"
                  y="1.5"
                  width="2.5"
                  height="8.5"
                  rx="0.4"
                  fill={C.ink}
                />
                <rect
                  x="10.5"
                  y="0"
                  width="2.5"
                  height="10"
                  rx="0.4"
                  fill={C.ink}
                  opacity="0.3"
                />
              </svg>
              <svg width="12" height="10" viewBox="0 0 12 10">
                <path d="M6 8a.8.8 0 100 1.6A.8.8 0 006 8z" fill={C.ink} />
                <path
                  d="M3.5 6a3.6 3.6 0 015 0"
                  stroke={C.ink}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M1 3.5a7 7 0 0110 0"
                  stroke={C.ink}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <svg width="20" height="10" viewBox="0 0 20 10">
                <rect
                  x="0.5"
                  y="0.5"
                  width="16"
                  height="9"
                  rx="2"
                  stroke={C.ink}
                  strokeWidth="0.8"
                />
                <rect
                  x="17"
                  y="3"
                  width="1.5"
                  height="4"
                  rx="0.7"
                  fill={C.ink}
                />
                <rect
                  x="1.5"
                  y="1.5"
                  width="11"
                  height="7"
                  rx="1.2"
                  fill={C.ink}
                />
              </svg>
            </div>
          </div>
          {children}
          <div
            style={{
              ...LIGHT,
              background: C.white,
              paddingBottom: 5,
              display: "flex",
              justifyContent: "center",
              paddingTop: 3,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 90,
                height: 4,
                borderRadius: 2,
                background: "#D1D5DB",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PHONE APP CONTENT ──────────────────────────────────────────────────────────
function PhoneApp({
  activePage,
  onNavigate,
  tourStep,
  tourSteps,
  onNext,
  onSkip,
}: {
  activePage: ActivePage;
  onNavigate: (p: ActivePage) => void;
  tourStep: number | null;
  tourSteps: TourStep[];
  onNext: () => void;
  onSkip: () => void;
}) {
  const renderPage = () => {
    switch (activePage) {
      case "mdashboard":
        return <MemberDashboardMobile />;
      case "checkin":
        return <MemberCheckInMobile />;
      case "mpayments":
        return <MemberPaymentsMobile />;
      default:
        return <MemberDashboardMobile />;
    }
  };
  const currentStep = tourStep !== null ? tourSteps[tourStep] : null;
  return (
    <div
      style={{
        ...LIGHT,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          ...LIGHT,
          background: C.white,
          borderBottom: `1px solid ${C.border}`,
          padding: "4px 10px 6px",
          display: "flex",
          alignItems: "center",
          gap: 5,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            flex: 1,
            background: C.snow,
            borderRadius: 6,
            padding: "3px 8px",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: C.green,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 9,
              color: C.grey,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            reetrack.com/member
          </span>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {renderPage()}
        {currentStep && (
          <TourTooltip
            step={tourStep! + 1}
            total={tourSteps.length}
            title={currentStep.title}
            text={currentStep.text}
            onNext={onNext}
            onSkip={onSkip}
            mobile
          />
        )}
      </div>
      <MemberBottomNav activePage={activePage} onNavigate={onNavigate} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════════════════════
export default function ReetrackDualDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 800;

  // ── ALL HOOKS DECLARED FIRST — never conditionally ──────────────────────────
  const [orgPage, setOrgPage] = useState<ActivePage>("dashboard");
  const [orgTourStep, setOrgTourStep] = useState<number | null>(null);
  const [memberPage, setMemberPage] = useState<ActivePage>("mdashboard");
  const [memberTourStep, setMemberTourStep] = useState<number | null>(null);
  const [time, setTime] = useState(() => {
    const now = new Date();
    return (
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0")
    );
  });
  const tourStarted = useRef(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.getHours().toString().padStart(2, "0") +
          ":" +
          now.getMinutes().toString().padStart(2, "0"),
      );
    };
    const t = setInterval(tick, 10000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (!tourStarted.current) {
            tourStarted.current = true;
            setTimeout(() => {
              setOrgTourStep(0);
              setMemberTourStep(0);
            }, 700);
          }
        }
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (orgTourStep !== null && ORG_STEPS[orgTourStep])
      setOrgPage(ORG_STEPS[orgTourStep].page);
  }, [orgTourStep]);

  useEffect(() => {
    if (memberTourStep !== null && MEMBER_STEPS[memberTourStep])
      setMemberPage(MEMBER_STEPS[memberTourStep].page);
  }, [memberTourStep]);
  // ── END HOOKS ────────────────────────────────────────────────────────────────

  // Safe to return null now — all hooks are above this line
  if (isMobile) return null;

  const handleOrgNext = () => {
    if (orgTourStep === null) return;
    if (orgTourStep < ORG_STEPS.length - 1) setOrgTourStep(orgTourStep + 1);
    else setOrgTourStep(null);
  };

  const handleMemberNext = () => {
    if (memberTourStep === null) return;
    if (memberTourStep < MEMBER_STEPS.length - 1)
      setMemberTourStep(memberTourStep + 1);
    else setMemberTourStep(null);
  };

  return (
    <div
      className="reetrack-demo"
      style={{ background: C.white, colorScheme: "light" }}
    >
      <section
        ref={sectionRef}
        className="reetrack-demo"
        style={{
          ...LIGHT,
          width: "100%",
          maxWidth: 1100,
          margin: "0 auto",
          padding: "80px 24px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
          fontFamily: "Nunito, sans-serif",
          boxSizing: "border-box",
          background: C.white,
          color: C.ink,
        }}
      >
        <style>{`
        @keyframes tooltipIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        .reetrack-demo, .reetrack-demo * { color-scheme: light !important; }
        @media (prefers-color-scheme: dark) {
          .reetrack-demo { background: #ffffff !important; }
          .reetrack-demo section { background: #ffffff !important; }
        }
      `}</style>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: C.ink,
              margin: "0 0 10px",
              letterSpacing: "-0.5px",
            }}
          >
            See Reetrack in action
          </h2>
        </div>

        {/* Side by side */}
        <div
          className="reetrack-dual-inner"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 24,
            transformOrigin: "top center",
          }}
        >
          {/* Left: Laptop */}
          <div style={{ flex: "0 0 auto", width: 620 }}>
            <div
              style={{
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: C.teal,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.grey,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                Organization View
              </span>
            </div>
            <LaptopFrame>
              <div
                style={{
                  ...LIGHT,
                  background: "#F0F0F5",
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <div style={{ display: "flex", gap: 4 }}>
                  {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                    <div
                      key={c}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: c,
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    ...LIGHT,
                    flex: 1,
                    background: C.white,
                    borderRadius: 5,
                    padding: "3px 10px",
                    fontSize: 10,
                    color: C.grey,
                    border: `1px solid ${C.border}`,
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  reetrack.com/organization/{orgPage}
                </div>
              </div>
              <div style={{ height: 400 }}>
                <DesktopApp
                  activePage={orgPage}
                  onNavigate={(p) => {
                    setOrgTourStep(null);
                    setOrgPage(p);
                  }}
                  tourStep={orgTourStep}
                  tourSteps={ORG_STEPS}
                  onNext={handleOrgNext}
                  onSkip={() => setOrgTourStep(null)}
                />
              </div>
            </LaptopFrame>
          </div>

          {/* Right: iPhone */}
          <div style={{ flex: "0 0 auto" }}>
            <div
              style={{
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: C.teal,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.grey,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                Member View
              </span>
            </div>
            <IPhoneFrame time={time}>
              <div style={{ height: 430 }}>
                <PhoneApp
                  activePage={memberPage}
                  onNavigate={(p) => {
                    setMemberTourStep(null);
                    setMemberPage(p);
                  }}
                  tourStep={memberTourStep}
                  tourSteps={MEMBER_STEPS}
                  onNext={handleMemberNext}
                  onSkip={() => setMemberTourStep(null)}
                />
              </div>
            </IPhoneFrame>
          </div>
        </div>

        <style>{`
        @media (max-width: 1100px) { .reetrack-dual-inner { transform: scale(0.85); } }
        @media (max-width: 900px)  { .reetrack-dual-inner { transform: scale(0.7);  } }
      `}</style>
      </section>
    </div>
  );
}
