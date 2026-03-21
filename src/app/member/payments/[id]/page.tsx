"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowLeft,
  Download,
  Check,
  X,
  Receipt,
  CreditCard,
  FileText,
  Building2,
  RefreshCw,
} from "lucide-react";
import { usePayment } from "@/hooks/usePayments";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const C = {
  teal: "#0D9488",
  coral: "#F06543",
  snow: "#F9FAFB",
  white: "#FFFFFF",
  ink: "#1F2937",
  coolGrey: "#9CA3AF",
  border: "#E5E7EB",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

const formatCurrency = (amount: number | string) => {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(n)) return "₦0.00";
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function PaymentReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: payment, isLoading } = usePayment(id);

  // Redirect non-success payments — no receipt for pending or failed
  useEffect(() => {
    if (!isLoading && payment && payment.status !== "success") {
      if (payment.status === "failed") {
        router.replace(`/member/payments/${id}/failed`);
      } else {
        router.replace("/member/payments");
      }
    }
  }, [payment, isLoading, router, id]);

  const handlePrint = () => window.print();

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.snow,
          fontFamily: "Nunito, sans-serif",
          padding: "32px 24px",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        `}</style>
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              height: "32px",
              width: "150px",
              background: C.white,
              borderRadius: "8px",
              border: `1px solid ${C.border}`,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              height: "600px",
              background: C.white,
              borderRadius: "16px",
              border: `1px solid ${C.border}`,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    );
  }

  // ─── Not found ──────────────────────────────────────────────────────────────
  if (!payment) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.snow,
          fontFamily: "Nunito, sans-serif",
          padding: "32px 24px",
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');`}</style>
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            textAlign: "center",
            paddingTop: "80px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: C.snow,
              border: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              color: C.coolGrey,
            }}
          >
            <Receipt size={32} />
          </div>
          <h3
            style={{
              fontWeight: 700,
              fontSize: "20px",
              color: C.ink,
              marginBottom: "8px",
            }}
          >
            Payment not found
          </h3>
          <p
            style={{
              fontWeight: 400,
              fontSize: "15px",
              color: C.coolGrey,
              marginBottom: "24px",
              lineHeight: 1.6,
            }}
          >
            The payment you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="secondary" asChild>
            <Link href="/member/payments">Back to Payments</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Non-success payments are being redirected — show nothing while that happens
  if (payment.status !== "success") return null;

  // ─── Data ───────────────────────────────────────────────────────────────────
  const subscription =
    payment.invoice?.member_subscription ||
    payment.invoice?.organization_subscription;

  const planName = subscription?.plan?.name || "Unknown Plan";
  const communityName =
    payment.metadata?.webhook_data?.subaccount?.business_name || null;
  const reference = payment.provider_reference || payment.id;
  const autoRenew = subscription?.auto_renew ?? false;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.snow,
        fontFamily: "Nunito, sans-serif",
        padding: "32px 24px 96px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @media print {
          body { background: white; }
          .print-hidden { display: none !important; }
          @page { margin: 0.5in; }
        }
      `}</style>

      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        {/* Header actions */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="print-hidden"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <Button variant="ghost" size="sm" asChild>
            <Link href="/member/payments">
              <ArrowLeft size={16} /> Back to Payments
            </Link>
          </Button>
          <Button variant="secondary" size="sm" onClick={handlePrint}>
            <Download size={16} /> Print Receipt
          </Button>
        </motion.div>

        {/* Receipt card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          style={{
            background: C.white,
            borderRadius: "16px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            border: `1px solid ${C.border}`,
            overflow: "hidden",
          }}
        >
          {/* Status header */}
          <div
            style={{
              padding: "32px",
              borderBottom: `4px solid ${C.teal}`,
              background: "rgba(13,148,136,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Receipt size={28} style={{ color: C.ink }} />
                <div>
                  <h1
                    style={{
                      fontWeight: 800,
                      fontSize: "24px",
                      color: C.ink,
                      letterSpacing: "-0.3px",
                    }}
                  >
                    Payment Receipt
                  </h1>
                  <p
                    style={{
                      fontWeight: 400,
                      fontSize: "13px",
                      color: C.coolGrey,
                    }}
                  >
                    Ref: {reference}
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "999px",
                  background: "rgba(13,148,136,0.1)",
                  color: C.teal,
                  border: "2px solid rgba(13,148,136,0.3)",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                <Check size={18} /> Payment Successful
              </div>
            </div>
            <div style={{ marginTop: "20px" }}>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: "13px",
                  color: C.coolGrey,
                  marginBottom: "6px",
                }}
              >
                Amount Paid
              </p>
              <p
                style={{
                  fontWeight: 800,
                  fontSize: "36px",
                  color: C.ink,
                  letterSpacing: "-0.5px",
                }}
              >
                {formatCurrency(payment.amount)}
              </p>
            </div>
          </div>

          {/* Body */}
          <div
            style={{
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            {/* Plan + Community */}
            <div>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  color: C.teal,
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <CreditCard size={18} /> What You Paid For
              </h2>
              <div
                style={{
                  background: "rgba(13,148,136,0.05)",
                  borderRadius: "12px",
                  padding: "20px",
                  border: "1px solid rgba(13,148,136,0.12)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Plan row */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "14px" }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      background: C.teal,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.white,
                      fontWeight: 800,
                      fontSize: "18px",
                      flexShrink: 0,
                    }}
                  >
                    {planName.charAt(0)}
                  </div>
                  <div>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "11px",
                        color: C.coolGrey,
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
                        marginBottom: "2px",
                      }}
                    >
                      Plan
                    </p>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "16px",
                        color: C.ink,
                      }}
                    >
                      {planName}
                    </p>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "12px",
                        color: C.coolGrey,
                        marginTop: "2px",
                      }}
                    >
                      {autoRenew
                        ? "Auto-renews each period"
                        : "Does not auto-renew"}
                    </p>
                  </div>
                </div>

                {/* Community row */}
                {communityName && (
                  <>
                    <div
                      style={{
                        height: "1px",
                        background: "rgba(13,148,136,0.12)",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "10px",
                          background: "rgba(13,148,136,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: C.teal,
                          flexShrink: 0,
                        }}
                      >
                        <Building2 size={20} />
                      </div>
                      <div>
                        <p
                          style={{
                            fontWeight: 400,
                            fontSize: "11px",
                            color: C.coolGrey,
                            textTransform: "uppercase",
                            letterSpacing: "0.6px",
                            marginBottom: "2px",
                          }}
                        >
                          Community
                        </p>
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: "16px",
                            color: C.ink,
                          }}
                        >
                          {communityName}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Transaction Details */}
            <div
              style={{ paddingTop: "28px", borderTop: `1px solid ${C.border}` }}
            >
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  color: C.teal,
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FileText size={18} /> Transaction Details
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "20px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontWeight: 400,
                      fontSize: "12px",
                      color: C.coolGrey,
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Reference Number
                  </p>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: "13px",
                      color: C.ink,
                      fontFamily: "monospace",
                    }}
                  >
                    {reference}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: 400,
                      fontSize: "12px",
                      color: C.coolGrey,
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Transaction Date
                  </p>
                  <p
                    style={{ fontWeight: 600, fontSize: "14px", color: C.ink }}
                  >
                    {formatDate(payment.created_at)}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: 400,
                      fontSize: "12px",
                      color: C.coolGrey,
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Currency
                  </p>
                  <p
                    style={{ fontWeight: 600, fontSize: "14px", color: C.ink }}
                  >
                    {payment.currency?.toUpperCase() || "NGN"}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div
              style={{ paddingTop: "28px", borderTop: `1px solid ${C.border}` }}
            >
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  color: C.teal,
                  marginBottom: "16px",
                }}
              >
                Payment Summary
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: "14px",
                      color: C.coolGrey,
                    }}
                  >
                    Subtotal
                  </span>
                  <span
                    style={{ fontWeight: 600, fontSize: "14px", color: C.ink }}
                  >
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: "14px",
                      color: C.coolGrey,
                    }}
                  >
                    Tax / Fees
                  </span>
                  <span
                    style={{ fontWeight: 600, fontSize: "14px", color: C.ink }}
                  >
                    {formatCurrency(0)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "12px",
                    borderTop: `2px solid ${C.border}`,
                  }}
                >
                  <span
                    style={{ fontWeight: 700, fontSize: "18px", color: C.ink }}
                  >
                    Total Paid
                  </span>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: "20px",
                      color: C.ink,
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Success notice */}
            <div
              style={{
                background: "rgba(13,148,136,0.08)",
                border: "1px solid rgba(13,148,136,0.3)",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "rgba(13,148,136,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Check size={18} style={{ color: C.teal }} />
              </div>
              <div>
                <h3
                  style={{
                    fontWeight: 600,
                    fontSize: "15px",
                    color: C.teal,
                    marginBottom: "4px",
                  }}
                >
                  Payment Confirmed
                </h3>
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "13px",
                    color: C.ink,
                    lineHeight: 1.6,
                  }}
                >
                  Your payment has been processed and your subscription is now
                  active. Keep this receipt for your records.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              background: C.snow,
              padding: "24px 32px",
              borderTop: `1px solid ${C.border}`,
              textAlign: "center",
            }}
          >
            <p style={{ fontWeight: 400, fontSize: "13px", color: C.coolGrey }}>
              If you have any questions about this receipt, please contact
              support.
            </p>
            <p
              style={{
                fontWeight: 400,
                fontSize: "11px",
                color: C.coolGrey,
                marginTop: "8px",
              }}
            >
              This is an electronic receipt and does not require a signature.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
