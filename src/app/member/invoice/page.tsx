"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle, X, AlertCircle } from "lucide-react";
import { useInvoices } from "@/hooks/usePayments";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const C = {
  teal: "#0D9488", coral: "#F06543", snow: "#F9FAFB",
  white: "#FFFFFF", ink: "#1F2937", coolGrey: "#9CA3AF", border: "#E5E7EB",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

const STATUS_CONFIG: Record<string, { bg: string; color: string; icon: React.ReactNode; label: string }> = {
  pending:   { bg: "rgba(251,191,36,0.12)",  color: "#D97706", icon: <Clock size={12} />,        label: "Pending" },
  paid:      { bg: "rgba(13,148,136,0.1)",   color: C.teal,    icon: <CheckCircle size={12} />,   label: "Paid" },
  cancelled: { bg: "rgba(156,163,175,0.15)", color: C.coolGrey, icon: <X size={12} />,            label: "Cancelled" },
  failed:    { bg: "rgba(240,101,67,0.1)",   color: C.coral,   icon: <AlertCircle size={12} />,   label: "Failed" },
};

type StatusFilter = "all" | "pending" | "paid" | "cancelled" | "failed";
const FILTERS: StatusFilter[] = ["all", "pending", "paid", "cancelled", "failed"];

function SkeletonCard() {
  return (
    <div style={{ background: C.white, borderRadius: "12px", border: `1px solid ${C.border}`, height: "90px", animation: "pulse 1.5s ease-in-out infinite" }} />
  );
}

function InvoiceRow({ invoice, index }: { invoice: any; index: number }) {
  const [hovered, setHovered] = useState(false);
  const cfg     = STATUS_CONFIG[invoice.status] ?? STATUS_CONFIG.pending;
  const planName = invoice.member_subscription?.plan?.name || "Subscription";
  const amount   = typeof invoice.amount === "string" ? parseFloat(invoice.amount) : (invoice.amount || 0);
  const invoiceNum = `INV-${invoice.id.slice(0, 8).toUpperCase()}`;
  const dueDate  = invoice.due_date ? new Date(invoice.due_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : null;
  const isOverdue = invoice.status === "pending" && invoice.due_date && new Date(invoice.due_date) < new Date();

  return (
    <Link href={`/member/invoices/${invoice.id}`} style={{ textDecoration: "none" }}>
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={index}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        whileHover={{ y: -1 }}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
          padding: "18px 24px", background: isOverdue ? "rgba(240,101,67,0.03)" : C.white,
          borderRadius: "12px",
          border: `1px solid ${isOverdue ? "rgba(240,101,67,0.3)" : hovered ? C.teal : C.border}`,
          boxShadow: hovered ? "0 6px 20px rgba(13,148,136,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
          cursor: "pointer", transition: "border-color 300ms, box-shadow 300ms",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0, flex: 1 }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "10px",
            background: invoice.status === "pending" ? "rgba(251,191,36,0.12)" : cfg.bg,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            color: cfg.color,
          }}>
            <FileText size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
              <p style={{ fontWeight: 700, fontSize: "14px", color: C.ink }}>{planName}</p>
              <span style={{ fontWeight: 600, fontSize: "11px", color: C.coolGrey }}>{invoiceNum}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                padding: "3px 10px", borderRadius: "999px",
                background: cfg.bg, color: cfg.color,
                fontWeight: 600, fontSize: "12px",
              }}>
                {cfg.icon}
                {cfg.label}
              </span>
              {isOverdue && (
                <span style={{ fontWeight: 600, fontSize: "12px", color: C.coral }}>
                  ⚠️ Overdue
                </span>
              )}
              {dueDate && invoice.status === "pending" && (
                <span style={{ fontSize: "12px", color: C.coolGrey }}>Due {dueDate}</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontWeight: 800, fontSize: "18px", color: C.ink, letterSpacing: "-0.3px" }}>
            ₦{amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          {invoice.status === "pending" && (
            <span style={{
              display: "inline-block", marginTop: "4px",
              padding: "3px 12px", borderRadius: "999px",
              background: C.teal, color: C.white,
              fontWeight: 700, fontSize: "11px",
            }}>
              Pay Now →
            </span>
          )}
          {invoice.status === "paid" && invoice.payment?.id && (
            <span style={{ fontSize: "11px", color: C.coolGrey, marginTop: "4px", display: "block" }}>
              View Receipt
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

export default function InvoicesPage() {
  const { data: invoices, isLoading } = useInvoices();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = (invoices || []).filter(
    (inv: any) => statusFilter === "all" || inv.status === statusFilter
  ).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const pendingCount = (invoices || []).filter((inv: any) => inv.status === "pending").length;

  return (
    <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "32px 24px 96px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: "32px", color: C.ink, letterSpacing: "-0.4px" }}>Invoices</h1>
              <p style={{ fontWeight: 400, fontSize: "15px", color: C.coolGrey, marginTop: "4px" }}>
                Your billing history and pending payments
              </p>
            </div>
            {pendingCount > 0 && (
              <div style={{
                padding: "8px 16px", borderRadius: "10px",
                background: "rgba(251,191,36,0.12)", border: "1px solid rgba(217,119,6,0.2)",
              }}>
                <span style={{ fontWeight: 700, fontSize: "13px", color: "#D97706" }}>
                  {pendingCount} pending {pendingCount === 1 ? "invoice" : "invoices"}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} style={{ marginBottom: "20px" }}>
          <div style={{
            background: C.white, borderRadius: "12px", border: `1px solid ${C.border}`,
            padding: "16px 20px", display: "flex", gap: "8px", flexWrap: "wrap",
          }}>
            {FILTERS.map((f) => (
              <Button
                key={f}
                variant={statusFilter === f ? "secondary" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* List */}
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filtered.map((invoice: any, i: number) => (
              <InvoiceRow key={invoice.id} invoice={invoice} index={i} />
            ))}
          </div>
        ) : (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            <div style={{
              background: C.white, borderRadius: "16px", border: `1px solid ${C.border}`,
              padding: "64px 32px", textAlign: "center",
            }}>
              <div style={{
                width: "68px", height: "68px", borderRadius: "18px", background: C.snow,
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px",
              }}>
                <FileText size={30} style={{ color: C.coolGrey }} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "20px", color: C.ink, marginBottom: "8px" }}>No invoices</h3>
              <p style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey, lineHeight: 1.6 }}>
                {statusFilter !== "all" ? "No invoices match this filter" : "Invoices will appear here once you subscribe to a plan"}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}