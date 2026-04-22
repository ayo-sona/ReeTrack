"use client";

import { useState } from "react";
import {
  Search,
  Check,
  X,
  Clock,
  CreditCard,
  FileText,
  RefreshCw,
} from "lucide-react";
import { usePayments, useInvoices, useMemberOrgs } from "@/hooks/memberHook/useMember";
import { Pagination } from "@/components/organization/Pagination";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { MemberInvoice, MemberPayment } from "@/types/organization";
import { toast } from "sonner";
import { useCancelInvoice } from "@/hooks/memberHook/useMember";
import Image from "next/image";

const C = {
  teal: "#0D9488",
  coral: "#F06543",
  snow: "#F9FAFB",
  white: "#FFFFFF",
  ink: "#1F2937",
  coolGrey: "#9CA3AF",
  border: "#E5E7EB",
  amber: "#D97706",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

type PaymentStatusFilter = "all" | "success" | "pending" | "failed";
const PAYMENT_FILTERS: PaymentStatusFilter[] = [
  "all",
  "success",
  "pending",
  "failed",
];

type InvoiceStatusFilter = "all" | "pending" | "paid" | "cancelled" | "failed";
const INVOICE_FILTERS: InvoiceStatusFilter[] = [
  "all",
  "pending",
  "paid",
  "cancelled",
  "failed",
];

const ITEMS_PER_PAGE = 5;

const formatCurrency = (amount: number | string) => {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(n)) return "₦0.00";
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const toNumber = (v: number | string) => {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return isNaN(n) ? 0 : n;
};

const PAYMENT_STATUS_CONFIG: Record<
  string,
  { bg: string; color: string; icon: React.ReactNode }
> = {
  success: {
    bg: "rgba(13,148,136,0.1)",
    color: C.teal,
    icon: <Check size={11} />,
  },
  pending: {
    bg: "rgba(251,191,36,0.12)",
    color: C.amber,
    icon: <Clock size={11} />,
  },
  failed: { bg: "rgba(240,101,67,0.1)", color: C.coral, icon: <X size={11} /> },
};

const INVOICE_STATUS_CONFIG: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  paid: { bg: "rgba(13,148,136,0.1)", color: C.teal, label: "Paid" },
  pending: { bg: "rgba(251,191,36,0.12)", color: C.amber, label: "Pending" },
  cancelled: {
    bg: "rgba(156,163,175,0.15)",
    color: C.coolGrey,
    label: "Cancelled",
  },
  failed: { bg: "rgba(240,101,67,0.1)", color: C.coral, label: "Failed" },
};

function StatTile({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        background: C.snow,
        borderRadius: "10px",
        border: `1px solid ${accent ? "rgba(13,148,136,0.15)" : C.border}`,
        padding: "16px 20px",
      }}
    >
      <p
        style={{
          fontWeight: 400,
          fontSize: "12px",
          color: C.coolGrey,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "6px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontWeight: 800,
          fontSize: "22px",
          color: accent ? C.teal : C.ink,
          letterSpacing: "-0.3px",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        background: C.white,
        borderRadius: "12px",
        border: `1px solid ${C.border}`,
        height: "96px",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

function SkeletonRow() {
  return (
    <tr>
      <td className="invoice-number-col" style={{ padding: "16px 20px" }}>
        <div
          style={{
            height: "16px",
            borderRadius: "6px",
            background: C.border,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </td>
      <td style={{ padding: "16px 20px" }}>
        <div
          style={{
            height: "16px",
            borderRadius: "6px",
            background: C.border,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </td>
      <td style={{ padding: "16px 20px" }}>
        <div
          style={{
            height: "16px",
            borderRadius: "6px",
            background: C.border,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </td>
    </tr>
  );
}

function PaymentRow({ payment, index, orgLogo }: { payment: MemberPayment; index: number; orgLogo: string | null }) {
  const [hovered, setHovered] = useState(false);
  const planName =
    payment.invoice?.member_subscription?.plan?.name || "Unknown Plan";
  const reference = payment.provider_reference || payment.id;
  const isClickable =
    payment.status === "success" || payment.status === "failed";
  const cfg = PAYMENT_STATUS_CONFIG[payment.status] ?? {
    bg: "rgba(156,163,175,0.12)",
    color: C.coolGrey,
    icon: null,
  };

  const inner = (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={index}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        padding: "20px 24px",
        background: C.white,
        borderRadius: "12px",
        border: `1px solid ${hovered && isClickable ? C.teal : C.border}`,
        boxShadow:
          hovered && isClickable
            ? "0 8px 24px rgba(13,148,136,0.1)"
            : "0 1px 4px rgba(0,0,0,0.04)",
        cursor: isClickable ? "pointer" : "default",
        transition: "border-color 300ms, box-shadow 300ms",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          minWidth: 0,
          flex: 1,
        }}
      >
        <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: C.teal, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "18px", color: C.white, overflow: "hidden", position: "relative" }}>
  {orgLogo ? (
    <Image src={orgLogo} alt={planName} fill className="object-cover" />
  ) : (
    planName.charAt(0)
  )}
</div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontWeight: 700,
              fontSize: "15px",
              color: C.ink,
              marginBottom: "4px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {planName}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 10px",
                borderRadius: "999px",
                background: cfg.bg,
                color: cfg.color,
                fontFamily: "Nunito, sans-serif",
                fontWeight: 600,
                fontSize: "12px",
              }}
            >
              {cfg.icon}
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </span>
            <span
              style={{
                padding: "3px 10px",
                borderRadius: "999px",
                background: C.snow,
                border: `1px solid ${C.border}`,
                fontFamily: "Nunito, sans-serif",
                fontWeight: 600,
                fontSize: "12px",
                color: C.coolGrey,
                textTransform: "capitalize",
              }}
            >
              {payment.payment_method || "card"}
            </span>
            {payment.status === "pending" && (
              <span
                style={{
                  fontWeight: 400,
                  fontSize: "12px",
                  color: C.coolGrey,
                  fontStyle: "italic",
                }}
              >
                Receipt not available
              </span>
            )}
          </div>
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p
          style={{
            fontWeight: 800,
            fontSize: "20px",
            color: C.ink,
            letterSpacing: "-0.3px",
            marginBottom: "2px",
          }}
        >
          {formatCurrency(payment.amount)}
        </p>
        <p style={{ fontWeight: 400, fontSize: "13px", color: C.coolGrey }}>
          {new Date(payment.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        <p
          className="payment-ref"
          style={{
            fontWeight: 400,
            fontSize: "11px",
            color: C.coolGrey,
            marginTop: "2px",
            maxWidth: "180px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {reference}
        </p>
      </div>
    </motion.div>
  );

  return isClickable ? (
    <Link
      href={`/member/payments/${payment.id}`}
      style={{ display: "block", textDecoration: "none" }}
    >
      {inner}
    </Link>
  ) : (
    <div>{inner}</div>
  );
}

export default function PaymentHistoryPage() {
  // ── Payments state ──────────────────────────────────────────────────────────
  const [paymentPage, setPaymentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>("all");
  const [searchFocused, setSearchFocused] = useState(false);
  const cancelInvoice = useCancelInvoice();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const { data: paymentsData, isLoading: paymentsLoading } = usePayments(
    paymentPage,
    ITEMS_PER_PAGE,
  );
  const payments = paymentsData?.data ?? [];
  const paymentsMeta = paymentsData?.meta;

  const filteredPayments = payments
    .filter((p) => {
      const planName =
        p.invoice?.member_subscription?.plan?.name || "Unknown Plan";
      const reference = p.provider_reference || "";
      const matchesSearch =
        planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.amount.toString().includes(searchQuery);
      return (
        matchesSearch && (statusFilter === "all" || p.status === statusFilter)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  const confirmCancel = async () => {
    if (!cancellingId) return;
    try {
      await cancelInvoice.mutateAsync(cancellingId);
      toast.success("Invoice cancelled");
    } catch {
      toast.error("Failed to cancel invoice");
    } finally {
      setCancellingId(null);
    }
  };

  const totalAmount = filteredPayments.reduce(
    (s, p) => s + toNumber(p.amount),
    0,
  );
  const successfulItems = filteredPayments.filter(
    (p) => p.status === "success",
  );
  const successfulAmount = successfulItems.reduce(
    (s, p) => s + toNumber(p.amount),
    0,
  );

  // ── Invoices state ──────────────────────────────────────────────────────────
  const [invoicePage, setInvoicePage] = useState(1);
  const [invoiceFilter, setInvoiceFilter] =
    useState<InvoiceStatusFilter>("all");
  const [invoiceSearchQuery, setInvoiceSearch] = useState("");
  const [invoiceSearchFocused, setInvSearchFoc] = useState(false);

  const { data: invoicesData, isLoading: invoicesLoading } = useInvoices(
    invoicePage,
    ITEMS_PER_PAGE,
    invoiceFilter === "all" ? undefined : invoiceFilter,
  );
  const { data: memberOrgs } = useMemberOrgs();
const orgLogo = memberOrgs?.[0]?.organization_user?.organization?.logo_url ?? null;

  const invoiceTotalPages = invoicesData?.meta?.totalPages ?? 1;

  const paginatedInvoices = (invoicesData?.data ?? []).filter(
    (inv: MemberInvoice) => {
      if (!invoiceSearchQuery) return true;
      const q = invoiceSearchQuery.toLowerCase();
      return (
        inv.id?.toLowerCase().includes(q) ||
        inv.amount?.toString().includes(q) ||
        inv.status?.toLowerCase().includes(q)
      );
    },
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.snow,
        fontFamily: "Nunito, sans-serif",
        padding: "24px 16px 96px",
      }}
    >
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
  input::placeholder { color: #9CA3AF; }

  .invoice-desktop-table { display: table; }
  .invoice-mobile-cards { display: none; }

  .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  @media (max-width: 640px) {
    .invoice-desktop-table { display: none; }
    .invoice-mobile-cards { display: block; }
    .stat-grid { grid-template-columns: 1fr 1fr; }
    .stat-grid > *:last-child { grid-column: span 2; }
    .payment-ref { display: none; }
    .payment-method-tag { display: none; }
    .page-title { font-size: 24px !important; }
    .section-title { font-size: 18px !important; }
    .filter-btn { font-size: 11px !important; padding: 5px 10px !important; }
  }
  @media (max-width: 400px) {
    .stat-grid { grid-template-columns: 1fr; }
    .stat-grid > *:last-child { grid-column: span 1; }
  }
`}</style>

      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* ── Page header ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          style={{ marginBottom: "32px" }}
        >
          <h1
            className="page-title"
            style={{
              fontWeight: 800,
              fontSize: "32px",
              color: C.ink,
              letterSpacing: "-0.4px",
            }}
          >
            Payment History
          </h1>
          <p
            style={{
              fontWeight: 400,
              fontSize: "15px",
              color: C.coolGrey,
              marginTop: "4px",
            }}
          >
            View all your payment transactions
          </p>
        </motion.div>

        {/* ── Search & filters ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          style={{ marginBottom: "20px" }}
        >
          <div
            style={{
              background: C.white,
              borderRadius: "12px",
              border: `1px solid ${C.border}`,
              padding: "20px 24px",
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <div
              style={{ position: "relative", flex: "1 1 200px", minWidth: 0 }}
            >
              <Search
                size={15}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: searchFocused ? C.teal : C.coolGrey,
                  transition: "color 300ms",
                }}
              />
              <input
                type="text"
                placeholder="Search by plan, amount, or reference..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPaymentPage(1);
                }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  width: "100%",
                  paddingLeft: "34px",
                  paddingRight: "14px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  borderRadius: "8px",
                  border: `1px solid ${searchFocused ? C.teal : C.border}`,
                  boxShadow: searchFocused
                    ? "0 0 0 3px rgba(13,148,136,0.12)"
                    : "none",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: C.ink,
                  background: C.white,
                  outline: "none",
                  transition: "border-color 300ms, box-shadow 300ms",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {PAYMENT_FILTERS.map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => {
                    setStatusFilter(s);
                    setPaymentPage(1);
                  }}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Summary tiles ── */}
        {filteredPayments.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            style={{ marginBottom: "20px" }}
          >
            <div className="stat-grid">
              <StatTile
                label="Total Payments"
                value={String(paymentsMeta?.total ?? filteredPayments.length)}
              />
              <StatTile
                label="Total Amount"
                value={formatCurrency(totalAmount)}
              />
              <StatTile
                label="Successful"
                value={`${successfulItems.length} · ${formatCurrency(successfulAmount)}`}
                accent
              />
            </div>
          </motion.div>
        )}

        {/* ── Payments list ── */}
        {paymentsLoading ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredPayments.length > 0 ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              {filteredPayments.map((payment, i) => (
                <PaymentRow key={payment.id} payment={payment} index={i} orgLogo={orgLogo} />
              ))}
            </div>
            {paymentsMeta && paymentsMeta.totalPages > 1 && (
              <div
                style={{
                  background: C.white,
                  borderRadius: "12px",
                  border: `1px solid ${C.border}`,
                  padding: "16px 24px",
                }}
              >
                <Pagination
                  currentPage={paymentPage}
                  totalPages={paymentsMeta.totalPages}
                  onPageChange={setPaymentPage}
                  isLoading={paymentsLoading}
                />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <div
              style={{
                background: C.white,
                borderRadius: "16px",
                border: `1px solid ${C.border}`,
                padding: "64px 32px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "18px",
                  background: C.snow,
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                  color: C.coolGrey,
                }}
              >
                <CreditCard size={30} />
              </div>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: "20px",
                  color: C.ink,
                  marginBottom: "8px",
                }}
              >
                {searchQuery || statusFilter !== "all"
                  ? "No payments found"
                  : "No payment history yet"}
              </h3>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: "14px",
                  color: C.coolGrey,
                  lineHeight: 1.6,
                }}
              >
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Your payment history will appear here"}
              </p>
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ── Invoices section ── */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          style={{ marginTop: "48px" }}
        >
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(13,148,136,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText size={18} style={{ color: C.teal }} />
            </div>
            <div>
              <h2
                style={{
                  fontWeight: 800,
                  fontSize: "22px",
                  color: C.ink,
                  letterSpacing: "-0.3px",
                }}
              >
                Invoices
              </h2>
              <p
                style={{ fontWeight: 400, fontSize: "13px", color: C.coolGrey }}
              >
                All your billing invoices
              </p>
            </div>
          </div>

          {/* Invoice search & filters */}
          <div
            style={{
              background: C.white,
              borderRadius: "12px",
              border: `1px solid ${C.border}`,
              padding: "20px 24px",
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{ position: "relative", flex: "1 1 160px", minWidth: 0 }}
            >
              <Search
                size={15}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: invoiceSearchFocused ? C.teal : C.coolGrey,
                  transition: "color 300ms",
                }}
              />
              <input
                type="text"
                placeholder="Search invoices..."
                value={invoiceSearchQuery}
                onChange={(e) => {
                  setInvoiceSearch(e.target.value);
                  setInvoicePage(1);
                }}
                onFocus={() => setInvSearchFoc(true)}
                onBlur={() => setInvSearchFoc(false)}
                style={{
                  width: "100%",
                  paddingLeft: "34px",
                  paddingRight: "14px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  borderRadius: "8px",
                  border: `1px solid ${invoiceSearchFocused ? C.teal : C.border}`,
                  boxShadow: invoiceSearchFocused
                    ? "0 0 0 3px rgba(13,148,136,0.12)"
                    : "none",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: C.ink,
                  background: C.white,
                  outline: "none",
                  transition: "border-color 300ms, box-shadow 300ms",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {INVOICE_FILTERS.map((s) => (
                <Button
                  key={s}
                  variant={invoiceFilter === s ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => {
                    setInvoiceFilter(s);
                    setInvoicePage(1);
                  }}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Invoice table / cards */}
          <div
            style={{
              background: C.white,
              borderRadius: "12px",
              border: `1px solid ${C.border}`,
              overflow: "hidden",
            }}
          >
            {/* ── Desktop table (hidden on mobile) ── */}
            <table
              className="invoice-desktop-table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "Nunito, sans-serif",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: C.snow,
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  {(["Invoice No", "Amount", "Status", "Action"] as const).map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "14px 20px",
                          textAlign:
                            h === "Amount"
                              ? "right"
                              : h === "Action"
                                ? "center"
                                : "left",
                          fontWeight: 700,
                          fontSize: "12px",
                          color: C.coolGrey,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          width: h === "Action" ? "120px" : undefined,
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {invoicesLoading ? (
                  [1, 2, 3].map((i) => <SkeletonRow key={i} />)
                ) : paginatedInvoices.length > 0 ? (
                  paginatedInvoices.map((inv, idx) => {
                    const cfg =
                      INVOICE_STATUS_CONFIG[inv.status] ??
                      INVOICE_STATUS_CONFIG.pending;
                    const isLast = idx === paginatedInvoices.length - 1;
                    return (
                      <tr
                        key={inv.id}
                        style={{
                          borderBottom: isLast
                            ? "none"
                            : `1px solid ${C.border}`,
                          transition: "background 200ms",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = C.snow)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td style={{ padding: "16px 20px" }}>
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: "13px",
                              color: C.ink,
                              fontFamily: "monospace",
                            }}
                          >
                            {(inv as any).invoice_number ??
                              `${inv.id?.slice(0, 8).toUpperCase()}…`}
                          </span>
                        </td>
                        <td
                          style={{ padding: "16px 20px", textAlign: "right" }}
                        >
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: "15px",
                              color: C.ink,
                            }}
                          >
                            {formatCurrency(inv.amount)}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "4px 10px",
                              borderRadius: "999px",
                              background: cfg.bg,
                              color: cfg.color,
                              fontWeight: 600,
                              fontSize: "12px",
                            }}
                          >
                            {cfg.label}
                          </span>
                        </td>
                        <td
                          style={{ padding: "16px 20px", textAlign: "center" }}
                        >
                          {inv.status === "pending" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setCancellingId(inv.id)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 14px",
                                fontSize: "12px",
                                fontWeight: 600,
                                borderRadius: "999px",
                                borderColor: C.coral,
                                color: C.coral,
                                background: "transparent",
                                transition: "all 200ms",
                                whiteSpace: "nowrap",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(240,101,67,0.1)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  "transparent";
                              }}
                            >
                              <X size={12} />
                              Cancel
                            </Button>
                          ) : inv.status === "failed" &&
                            inv.member_subscription?.plan_id ? (
                            <Link
                              href={`/member/checkout/${inv.member_subscription.plan_id}?invoice=failed&id=${inv.id}`}
                              style={{ textDecoration: "none" }}
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  padding: "6px 14px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  borderRadius: "999px",
                                  borderColor: C.coral,
                                  color: C.coral,
                                  background: "transparent",
                                  transition: "all 200ms",
                                  whiteSpace: "nowrap",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background =
                                    "rgba(240,101,67,0.1)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background =
                                    "transparent";
                                }}
                              >
                                <RefreshCw size={12} />
                                Retry
                              </Button>
                            </Link>
                          ) : (
                            <span
                              style={{ color: C.coolGrey, fontSize: "12px" }}
                            >
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      style={{ padding: "48px 24px", textAlign: "center" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "14px",
                            background: C.snow,
                            border: `1px solid ${C.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: C.coolGrey,
                          }}
                        >
                          <FileText size={24} />
                        </div>
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: "15px",
                            color: C.ink,
                          }}
                        >
                          No invoices found
                        </p>
                        <p
                          style={{
                            fontWeight: 400,
                            fontSize: "13px",
                            color: C.coolGrey,
                          }}
                        >
                          {invoiceSearchQuery || invoiceFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "Your invoices will appear here"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* ── Mobile cards (hidden on desktop) ── */}
            <div className="invoice-mobile-cards">
              {invoicesLoading ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "12px",
                  }}
                >
                  {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : paginatedInvoices.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {paginatedInvoices.map((inv, idx) => {
                    const cfg =
                      INVOICE_STATUS_CONFIG[inv.status] ??
                      INVOICE_STATUS_CONFIG.pending;
                    const isLast = idx === paginatedInvoices.length - 1;
                    return (
                      <div
                        key={inv.id}
                        style={{
                          padding: "16px 20px",
                          borderBottom: isLast
                            ? "none"
                            : `1px solid ${C.border}`,
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        {/* Top row: invoice number + amount */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: "13px",
                              color: C.ink,
                              fontFamily: "monospace",
                            }}
                          >
                            {(inv as any).invoice_number ??
                              `${inv.id?.slice(0, 8).toUpperCase()}…`}
                          </span>
                          <span
                            style={{
                              fontWeight: 800,
                              fontSize: "16px",
                              color: C.ink,
                              letterSpacing: "-0.3px",
                            }}
                          >
                            {formatCurrency(inv.amount)}
                          </span>
                        </div>
                        {/* Bottom row: status + retry */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "4px 10px",
                              borderRadius: "999px",
                              background: cfg.bg,
                              color: cfg.color,
                              fontWeight: 600,
                              fontSize: "12px",
                            }}
                          >
                            {cfg.label}
                          </span>
                          {inv.status === "pending" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setCancellingId(inv.id)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 14px",
                                fontSize: "12px",
                                fontWeight: 600,
                                borderRadius: "999px",
                                borderColor: C.coral,
                                color: C.coral,
                                background: "transparent",
                              }}
                            >
                              <X size={12} />
                              Cancel
                            </Button>
                          ) : inv.status === "failed" &&
                            inv.member_subscription?.plan_id ? (
                            <Link
                              href={`/member/checkout/${inv.member_subscription.plan_id}?invoice=failed&id=${inv.id}`}
                              style={{ textDecoration: "none" }}
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  padding: "6px 14px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  borderRadius: "999px",
                                  borderColor: C.coral,
                                  color: C.coral,
                                  background: "transparent",
                                }}
                              >
                                <RefreshCw size={12} />
                                Retry
                              </Button>
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: "48px 24px", textAlign: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "14px",
                        background: C.snow,
                        border: `1px solid ${C.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: C.coolGrey,
                      }}
                    >
                      <FileText size={24} />
                    </div>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "15px",
                        color: C.ink,
                      }}
                    >
                      No invoices found
                    </p>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "13px",
                        color: C.coolGrey,
                      }}
                    >
                      {invoiceSearchQuery || invoiceFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "Your invoices will appear here"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Invoice pagination */}
            {!invoicesLoading && invoiceTotalPages > 1 && (
              <div
                style={{
                  padding: "16px 24px",
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <Pagination
                  currentPage={invoicePage}
                  totalPages={invoiceTotalPages}
                  onPageChange={setInvoicePage}
                  isLoading={invoicesLoading}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
      {cancellingId && (
        <div
          onClick={() => setCancellingId(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
            padding: 16,
            fontFamily: "Nunito, sans-serif",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: C.white,
              borderRadius: 16,
              border: `1px solid ${C.border}`,
              padding: 24,
              maxWidth: 380,
              width: "100%",
            }}
          >
            <h3
              style={{
                fontWeight: 800,
                fontSize: 16,
                color: C.ink,
                marginBottom: 6,
              }}
            >
              Cancel invoice?
            </h3>
            <p
              style={{
                fontSize: 13,
                color: C.coolGrey,
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              This will cancel the invoice permanently. This action cannot be
              undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancellingId(null)}
                style={{ flex: 1 }}
              >
                Keep it
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmCancel}
                disabled={cancelInvoice.isPending}
                style={{ flex: 1 }}
              >
                {cancelInvoice.isPending ? "Cancelling..." : "Cancel Invoice"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}