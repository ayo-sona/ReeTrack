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

  // Fetch the single payment directly — no need to load all payments
  const { data: payment, isLoading } = usePayment(id);

  // Pending payments have no receipt — redirect back
  useEffect(() => {
    if (!isLoading && payment?.status === "pending") {
      router.push("/member/payments");
    }
  }, [payment, isLoading, router]);

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
            maxWidth: "1000px",
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

  // ─── Not found / pending ────────────────────────────────────────────────────
  if (!payment || payment.status === "pending") {
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
            maxWidth: "1000px",
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
            {payment?.status === "pending"
              ? "Receipt Not Available"
              : "Payment not found"}
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
            {payment?.status === "pending"
              ? "Receipts are only available for completed payments."
              : "The payment you're looking for doesn't exist or has been removed."}
          </p>
          <Button variant="secondary" asChild>
            <Link href="/member/payments">Back to Payments</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ─── Data ───────────────────────────────────────────────────────────────────
  // Payment type has: provider, provider_reference, invoice (with member_subscription
  // or organization_subscription), payer_user, amount, currency, status, created_at
  const planName =
    payment.invoice?.member_subscription?.plan?.name ||
    payment.invoice?.organization_subscription?.plan?.name ||
    "Unknown Plan";

  const reference = payment.provider_reference || payment.id;
  const isSuccess = payment.status === "success";

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

      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
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
              <ArrowLeft size={16} />
              Back to Payments
            </Link>
          </Button>
          <Button variant="secondary" size="sm" onClick={handlePrint}>
            <Download size={16} />
            Print Receipt
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
              borderBottom: `4px solid ${isSuccess ? C.teal : C.coral}`,
              background: isSuccess
                ? "rgba(13,148,136,0.06)"
                : "rgba(240,101,67,0.06)",
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
                    Transaction ID: {payment.id}
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
                  background: isSuccess
                    ? "rgba(13,148,136,0.1)"
                    : "rgba(240,101,67,0.1)",
                  color: isSuccess ? C.teal : C.coral,
                  border: `2px solid ${isSuccess ? "rgba(13,148,136,0.3)" : "rgba(240,101,67,0.3)"}`,
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                {isSuccess ? <Check size={18} /> : <X size={18} />}
                {payment.status.charAt(0).toUpperCase() +
                  payment.status.slice(1)}
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
                Amount {isSuccess ? "Paid" : "Attempted"}
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

          {/* Transaction details */}
          <div
            style={{
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            {/* Transaction info */}
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
                <FileText size={18} />
                Transaction Details
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
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
                      Payment Provider
                    </p>
                    {/* provider comes from the Payment type directly */}
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: C.ink,
                        textTransform: "capitalize",
                      }}
                    >
                      {payment.provider || "Paystack"}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
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
                      Transaction Date
                    </p>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: C.ink,
                      }}
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
                      style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: C.ink,
                      }}
                    >
                      {payment.currency?.toUpperCase() || "NGN"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payer info — comes from payer_user on the Payment type */}
            {payment.payer_user && (
              <div
                style={{
                  paddingTop: "28px",
                  borderTop: `1px solid ${C.border}`,
                }}
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
                  <FileText size={18} />
                  Billed To
                </h2>
                <p style={{ fontWeight: 600, fontSize: "15px", color: C.ink }}>
                  {payment.payer_user.first_name} {payment.payer_user.last_name}
                </p>
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "14px",
                    color: C.coolGrey,
                    marginTop: "4px",
                  }}
                >
                  {payment.payer_user.email}
                </p>
              </div>
            )}

            {/* Plan info */}
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
                <CreditCard size={18} />
                Plan Details
              </h2>
              <div
                style={{
                  background: "rgba(13,148,136,0.06)",
                  borderRadius: "12px",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "12px",
                      background: C.teal,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.white,
                      fontWeight: 800,
                      fontSize: "20px",
                      flexShrink: 0,
                    }}
                  >
                    {planName.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontWeight: 700,
                        fontSize: "18px",
                        color: C.ink,
                      }}
                    >
                      {planName}
                    </h3>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "13px",
                        color: C.coolGrey,
                        marginTop: "4px",
                      }}
                    >
                      {payment.invoice?.member_subscription?.auto_renew
                        ? "Auto-renews each period"
                        : "Does not auto-renew"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment summary */}
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
                    Total {isSuccess ? "Paid" : "Amount"}
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

            {/* Status message */}
            {isSuccess ? (
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
                    Payment Successful
                  </h3>
                  <p
                    style={{
                      fontWeight: 400,
                      fontSize: "13px",
                      color: C.ink,
                      lineHeight: 1.6,
                    }}
                  >
                    Your payment has been processed successfully. A copy of this
                    receipt has been sent to{" "}
                    {payment.payer_user?.email || "your email"}.
                  </p>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "rgba(240,101,67,0.08)",
                  border: "1px solid rgba(240,101,67,0.3)",
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
                    background: "rgba(240,101,67,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <X size={18} style={{ color: C.coral }} />
                </div>
                <div>
                  <h3
                    style={{
                      fontWeight: 600,
                      fontSize: "15px",
                      color: C.coral,
                      marginBottom: "4px",
                    }}
                  >
                    Payment Failed
                  </h3>
                  <p
                    style={{
                      fontWeight: 400,
                      fontSize: "13px",
                      color: C.ink,
                      lineHeight: 1.6,
                    }}
                  >
                    This payment was not successful. Please contact support if
                    you believe this is an error, or try again.
                  </p>
                </div>
              </div>
            )}
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
