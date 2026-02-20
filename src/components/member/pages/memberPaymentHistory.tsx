"use client";

import { useState } from "react";
import { Search, Check, X, Clock, CreditCard } from "lucide-react";
import { useAllPayments } from "@/hooks/memberHook/useMember";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const C = {
  teal:     "#0D9488",
  coral:    "#F06543",
  snow:     "#F9FAFB",
  white:    "#FFFFFF",
  ink:      "#1F2937",
  coolGrey: "#9CA3AF",
  border:   "#E5E7EB",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

type StatusFilter = "all" | "success" | "pending" | "failed";
const FILTERS: StatusFilter[] = ["all", "success", "pending", "failed"];

const formatCurrency = (amount: number | string) => {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(n)) return "₦0.00";
  return `₦${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const toNumber = (v: number | string) => {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return isNaN(n) ? 0 : n;
};

const STATUS_CONFIG: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  success: { bg: "rgba(13,148,136,0.1)",  color: C.teal,    icon: <Check size={11} /> },
  pending: { bg: "rgba(251,191,36,0.12)", color: "#D97706", icon: <Clock size={11} /> },
  failed:  { bg: "rgba(240,101,67,0.1)",  color: C.coral,   icon: <X size={11} />    },
};

function StatTile({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{
      background: C.snow, borderRadius: "10px",
      border: `1px solid ${accent ? "rgba(13,148,136,0.15)" : C.border}`,
      padding: "16px 20px",
    }}>
      <p style={{ fontWeight: 400, fontSize: "12px", color: C.coolGrey, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>{label}</p>
      <p style={{ fontWeight: 800, fontSize: "22px", color: accent ? C.teal : C.ink, letterSpacing: "-0.3px" }}>{value}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: C.white, borderRadius: "12px", border: `1px solid ${C.border}`, height: "96px", animation: "pulse 1.5s ease-in-out infinite" }} />
  );
}

function PaymentRow({ payment, index }: { payment: any; index: number }) {
  const [hovered, setHovered] = useState(false);
  const planName    = payment.invoice?.member_subscription?.plan.name || "Unknown Plan";
  const reference   = payment.provider_reference || payment.id;
  const isClickable = payment.status === "success" || payment.status === "failed";
  const cfg = STATUS_CONFIG[payment.status] ?? { bg: "rgba(156,163,175,0.12)", color: C.coolGrey, icon: null };

  const inner = (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible" custom={index}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
        padding: "20px 24px", background: C.white, borderRadius: "12px",
        border: `1px solid ${hovered && isClickable ? C.teal : C.border}`,
        boxShadow: hovered && isClickable ? "0 8px 24px rgba(13,148,136,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
        cursor: isClickable ? "pointer" : "default",
        transition: "border-color 300ms, box-shadow 300ms",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0, flex: 1 }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "10px", background: C.teal, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "18px", color: C.white,
        }}>
          {planName.charAt(0)}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: "15px", color: C.ink, marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {planName}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 10px", borderRadius: "999px", background: cfg.bg, color: cfg.color, fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "12px" }}>
              {cfg.icon}
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </span>
            <span style={{ padding: "3px 10px", borderRadius: "999px", background: C.snow, border: `1px solid ${C.border}`, fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "12px", color: C.coolGrey, textTransform: "capitalize" }}>
              {payment.payment_method || "card"}
            </span>
            {payment.status === "pending" && (
              <span style={{ fontWeight: 400, fontSize: "12px", color: C.coolGrey, fontStyle: "italic" }}>Receipt not available</span>
            )}
          </div>
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontWeight: 800, fontSize: "20px", color: C.ink, letterSpacing: "-0.3px", marginBottom: "2px" }}>{formatCurrency(payment.amount)}</p>
        <p style={{ fontWeight: 400, fontSize: "13px", color: C.coolGrey }}>
          {new Date(payment.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
        </p>
        <p style={{ fontWeight: 400, fontSize: "11px", color: C.coolGrey, marginTop: "2px", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {reference}
        </p>
      </div>
    </motion.div>
  );

  return isClickable ? (
    <Link key={payment.id} href={`/member/payments/${payment.id}`} style={{ display: "block", textDecoration: "none" }}>
      {inner}
    </Link>
  ) : (
    <div key={payment.id}>{inner}</div>
  );
}

export default function PaymentHistoryPage() {
  const { data: payments, isLoading } = useAllPayments();
  const [searchQuery, setSearchQuery]     = useState("");
  const [statusFilter, setStatusFilter]   = useState<StatusFilter>("all");
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = (payments || [])
    .filter((p) => {
      const planName  = p.invoice?.member_subscription?.plan.name || "Unknown Plan";
      const reference = p.provider_reference || "";
      const matchesSearch =
        planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.amount.toString().includes(searchQuery);
      return matchesSearch && (statusFilter === "all" || p.status === statusFilter);
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const totalAmount      = filtered.reduce((s, p) => s + toNumber(p.amount), 0);
  const successfulItems  = filtered.filter((p) => p.status === "success");
  const successfulAmount = successfulItems.reduce((s, p) => s + toNumber(p.amount), 0);

  return (
    <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "32px 24px 96px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        input::placeholder { color: #9CA3AF; }
      `}</style>

      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} style={{ marginBottom: "32px" }}>
          <h1 style={{ fontWeight: 800, fontSize: "32px", color: C.ink, letterSpacing: "-0.4px" }}>Payment History</h1>
          <p style={{ fontWeight: 400, fontSize: "15px", color: C.coolGrey, marginTop: "4px" }}>View all your payment transactions</p>
        </motion.div>

        {/* Search & filters */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} style={{ marginBottom: "20px" }}>
          <div style={{ background: C.white, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "20px 24px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 260px" }}>
              <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: searchFocused ? C.teal : C.coolGrey, transition: "color 300ms" }} />
              <input
                type="text" placeholder="Search by plan, amount, or reference..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                style={{
                  width: "100%", paddingLeft: "34px", paddingRight: "14px", paddingTop: "10px", paddingBottom: "10px",
                  borderRadius: "8px", border: `1px solid ${searchFocused ? C.teal : C.border}`,
                  boxShadow: searchFocused ? "0 0 0 3px rgba(13,148,136,0.12)" : "none",
                  fontFamily: "Nunito, sans-serif", fontWeight: 400, fontSize: "14px",
                  color: C.ink, background: C.white, outline: "none",
                  transition: "border-color 300ms, box-shadow 300ms",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {FILTERS.map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        {filtered.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} style={{ marginBottom: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              <StatTile label="Total Payments" value={String(filtered.length)} />
              <StatTile label="Total Amount"   value={formatCurrency(totalAmount)} />
              <StatTile label="Successful"     value={`${successfulItems.length} · ${formatCurrency(successfulAmount)}`} accent />
            </div>
          </motion.div>
        )}

        {/* List */}
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filtered.map((payment, i) => <PaymentRow key={payment.id} payment={payment} index={i} />)}
          </div>
        ) : (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <div style={{ background: C.white, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "64px 32px", textAlign: "center" }}>
              <div style={{ width: "68px", height: "68px", borderRadius: "18px", background: C.snow, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", color: C.coolGrey }}>
                <CreditCard size={30} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "20px", color: C.ink, marginBottom: "8px" }}>
                {searchQuery || statusFilter !== "all" ? "No payments found" : "No payment history yet"}
              </h3>
              <p style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey, lineHeight: 1.6 }}>
                {searchQuery || statusFilter !== "all" ? "Try adjusting your search or filters" : "Your payment history will appear here"}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}