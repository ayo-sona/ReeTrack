"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, FileText, Clock, CheckCircle, X,
  AlertCircle, CreditCard, Calendar, Hash, Layers, Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInvoiceById, useInitializePayment } from "@/hooks/usePayments";

const C = {
  teal: "#0D9488", coral: "#F06543", snow: "#F9FAFB",
  white: "#FFFFFF", ink: "#1F2937", coolGrey: "#9CA3AF", border: "#E5E7EB",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string; headerBg: string }> = {
  pending:   { color: "#D97706", bg: "rgba(251,191,36,0.12)",  icon: <Clock size={36} />,        label: "Payment Due",          headerBg: "linear-gradient(135deg, #D97706 0%, #B45309 100%)" },
  paid:      { color: C.teal,    bg: "rgba(13,148,136,0.1)",   icon: <CheckCircle size={36} />,   label: "Invoice Paid",         headerBg: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)" },
  cancelled: { color: C.coolGrey, bg: "rgba(156,163,175,0.15)", icon: <X size={36} />,            label: "Invoice Cancelled",    headerBg: "linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)" },
  failed:    { color: C.coral,   bg: "rgba(240,101,67,0.1)",   icon: <AlertCircle size={36} />,   label: "Payment Failed",       headerBg: "linear-gradient(135deg, #F06543 0%, #DC4E32 100%)" },
};

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 0", borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ color: C.coolGrey }}>{icon}</span>
        <span style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey }}>{label}</span>
      </div>
      <span style={{ fontWeight: 600, fontSize: "14px", color: C.ink }}>{value}</span>
    </div>
  );
}

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const { data: invoice, isLoading } = useInvoiceById(id);
  const { mutateAsync: initializePayment, isPending: isInitializing } = useInitializePayment();

  const handlePayNow = async () => {
    try {
        const result = await initializePayment({ invoiceId: id } as any) as any;
      if (result?.authorization_url) {
        window.location.href = result.authorization_url;
      }
    } catch (err) {
      console.error("Payment initialization failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: C.snow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Nunito, sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: `4px solid ${C.border}`, borderTopColor: C.teal, animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: "14px", color: C.coolGrey }}>Loading invoice…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div style={{ minHeight: "100vh", background: C.snow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Nunito, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontWeight: 700, fontSize: "18px", color: C.ink }}>Invoice not found</p>
          <Button variant="outline" style={{ marginTop: "16px" }} onClick={() => router.push("/member/invoices")}>
            Back to Invoices
          </Button>
        </div>
      </div>
    );
  }

  const cfg      = STATUS_CONFIG[invoice.status] ?? STATUS_CONFIG.pending;
  const planName = invoice.member_subscription?.plan?.name || "Subscription";
  const amount   = typeof invoice.amount === "string" ? parseFloat(invoice.amount) : (invoice.amount || 0);
  const invoiceNum = `INV-${invoice.id.slice(0, 8).toUpperCase()}`;
  const createdDate = new Date(invoice.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const dueDate  = invoice.due_date
    ? new Date(invoice.due_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";
  const isOverdue = invoice.status === "pending" && invoice.due_date && new Date(invoice.due_date) < new Date();

  return (
    <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "32px 24px 96px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        {/* Back */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="no-print" style={{ marginBottom: "24px" }}>
          <button
            onClick={() => router.push("/member/invoices")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "14px", color: C.coolGrey, padding: 0,
            }}
          >
            <ArrowLeft size={16} />
            All Invoices
          </button>
        </motion.div>

        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          style={{ background: C.white, borderRadius: "20px", border: `1px solid ${C.border}`, boxShadow: "0 4px 32px rgba(0,0,0,0.06)", overflow: "hidden" }}
        >
          {/* Header */}
          <div style={{ background: cfg.headerBg, padding: "36px 32px", textAlign: "center" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "rgba(255,255,255,0.2)", display: "flex",
              alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: C.white,
            }}>
              {cfg.icon}
            </div>
            <h1 style={{ fontWeight: 800, fontSize: "22px", color: C.white, marginBottom: "6px" }}>
              {cfg.label}
            </h1>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)" }}>{invoiceNum}</p>
          </div>

          {/* Amount */}
          <div style={{ padding: "28px 32px", borderBottom: `1px solid ${C.border}`, textAlign: "center", background: C.snow }}>
            <p style={{ fontWeight: 400, fontSize: "13px", color: C.coolGrey, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>
              Amount {invoice.status === "pending" ? "Due" : invoice.status === "paid" ? "Paid" : ""}
            </p>
            <p style={{ fontWeight: 800, fontSize: "40px", color: C.ink, letterSpacing: "-1px" }}>
              ₦{amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            {isOverdue && (
              <p style={{ fontSize: "13px", color: C.coral, fontWeight: 600, marginTop: "8px" }}>
                ⚠️ This invoice is overdue
              </p>
            )}
          </div>

          {/* Details */}
          <div style={{ padding: "8px 32px 24px" }}>
            <DetailRow icon={<Layers size={15} />}    label="Plan"         value={planName} />
            <DetailRow icon={<Hash size={15} />}      label="Invoice No."  value={invoiceNum} />
            <DetailRow icon={<Calendar size={15} />}  label="Issued"       value={createdDate} />
            <DetailRow icon={<Clock size={15} />}     label="Due Date"     value={dueDate} />
            {invoice.description && (
              <DetailRow icon={<FileText size={15} />} label="Description" value={invoice.description} />
            )}
          </div>

          {/* CTA */}
          <div className="no-print" style={{ padding: "20px 32px", borderTop: `1px solid ${C.border}`, display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {invoice.status === "pending" && (
              <Button
                variant="default"
                size="lg"
                onClick={handlePayNow}
                disabled={isInitializing}
                style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
              >
                <CreditCard size={16} />
                {isInitializing ? "Redirecting to Paystack…" : "Pay Now"}
              </Button>
            )}
            {invoice.status === "paid" && invoice.payment?.id && (
              <Button
                variant="outline"
                onClick={() => router.push(`/member/payments/${invoice.payment.id}`)}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                View Payment Receipt
              </Button>
            )}
            {(invoice.status === "failed" || invoice.status === "pending") && (
              <Button variant="outline" onClick={() => window.print()}>
                <Printer size={15} />
              </Button>
            )}
            {invoice.status === "paid" && (
              <Button variant="outline" onClick={() => window.print()}>
                <Printer size={15} />
              </Button>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}