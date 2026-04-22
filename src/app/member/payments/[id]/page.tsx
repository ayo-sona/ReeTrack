"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Download,
  Check,
  X,
  Receipt,
  CreditCard,
  FileText,
  Building2,
} from "lucide-react";
import { usePayment } from "@/hooks/usePayments";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useMemberOrgs } from "@/hooks/memberHook/useMember";

const C = {
  teal: "#0D9488",
  coral: "#F06543",
  snow: "#F9FAFB",
  white: "#FFFFFF",
  ink: "#1F2937",
  mid: "#4B5563",
  coolGrey: "#9CA3AF",
  border: "#E5E7EB",
  softBorder: "#F3F4F6",
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

function ReceiptRow({
  label,
  value,
  mono = false,
  large = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  large?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 16,
        padding: "13px 0",
        borderBottom: `1px solid ${C.softBorder}`,
      }}
    >
      <span
        style={{
          fontWeight: 500,
          fontSize: 13,
          color: C.coolGrey,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontWeight: large ? 700 : 600,
          fontSize: large ? 15 : 13,
          color: large ? C.ink : C.mid,
          textAlign: "right",
          fontFamily: mono ? "monospace" : "inherit",
          letterSpacing: mono ? "-0.2px" : 0,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function SectionLabel({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        marginBottom: 16,
      }}
    >
      <div style={{ color: C.teal }}>{icon}</div>
      <p
        style={{
          fontWeight: 700,
          fontSize: 12,
          color: C.coolGrey,
          textTransform: "uppercase",
          letterSpacing: "0.8px",
        }}
      >
        {children}
      </p>
    </div>
  );
}

export default function PaymentReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: payment, isLoading } = usePayment(id);
  const { data: memberOrgs } = useMemberOrgs();

  // ✅ Must be before any early returns
  const [currentOrg] = useState<{
    name: string;
    logoUrl: string | null;
  } | null>(() => {
    try {
      const stored = localStorage.getItem("currentOrg");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!isLoading && payment?.status === "pending") {
      router.push("/member/payments");
    }
  }, [payment, isLoading, router]);

  const handlePrint = () => window.print();

  // Loading
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
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap'); @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              height: 32,
              width: 150,
              background: C.white,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              height: 600,
              background: C.white,
              borderRadius: 20,
              border: `1px solid ${C.border}`,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    );
  }

  // Not found / pending
  if (!payment || payment.status === "pending") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.snow,
          fontFamily: "Nunito, sans-serif",
          padding: "32px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: C.white,
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
              fontSize: 20,
              color: C.ink,
              marginBottom: 8,
            }}
          >
            {payment?.status === "pending"
              ? "Receipt Not Available"
              : "Payment not found"}
          </h3>
          <p
            style={{
              fontWeight: 400,
              fontSize: 15,
              color: C.coolGrey,
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            {payment?.status === "pending"
              ? "Receipts are only available for completed payments."
              : "The payment you're looking for doesn't exist."}
          </p>
          <Button variant="secondary" asChild>
            <Link href="/member/payments">Back to Payments</Link>
          </Button>
        </div>
      </div>
    );
  }

  const planName =
    payment.invoice?.member_subscription?.plan?.name ||
    payment.invoice?.organization_subscription?.plan?.name ||
    "Unknown Plan";

  const firstOrg = memberOrgs?.[0]?.organization_user?.organization;
  const orgName = firstOrg?.name ?? null;
  const orgLogo = firstOrg?.logo_url ?? null;
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
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @media print {
          body { background: white; }
          .print-hidden { display: none !important; }
          @page { margin: 0.5in; }
        }
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Nav row */}
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
            marginBottom: 24,
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
            borderRadius: 24,
            border: `1px solid ${C.border}`,
            overflow: "hidden",
            boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
          }}
        >
          {/* Top header */}
          <div
            style={{
              padding: "36px 36px 28px",
              borderBottom: `1px solid ${C.softBorder}`,
            }}
          >
            {/* Org identity row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: C.teal,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.white,
                  fontWeight: 800,
                  fontSize: 20,
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                  boxShadow: "0 4px 14px rgba(13,148,136,0.25)",
                }}
              >
                {orgLogo ? (
                  <Image
                    src={orgLogo}
                    alt={orgName ?? "Organization"}
                    fill
                    className="object-cover"
                  />
                ) : orgName ? (
                  orgName.charAt(0).toUpperCase()
                ) : (
                  <Building2 size={22} />
                )}
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: C.ink,
                    lineHeight: 1.2,
                  }}
                >
                  {orgName ?? "ReeTrack"}
                </p>
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: 12,
                    color: C.coolGrey,
                    marginTop: 2,
                  }}
                >
                  Powered by ReeTrack
                </p>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    borderRadius: 999,
                    background: isSuccess
                      ? "rgba(13,148,136,0.08)"
                      : "rgba(240,101,67,0.08)",
                    border: `1.5px solid ${isSuccess ? "rgba(13,148,136,0.2)" : "rgba(240,101,67,0.2)"}`,
                    color: isSuccess ? C.teal : C.coral,
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.2px",
                  }}
                >
                  {isSuccess ? (
                    <Check size={13} strokeWidth={3} />
                  ) : (
                    <X size={13} strokeWidth={3} />
                  )}
                  {payment.status.charAt(0).toUpperCase() +
                    payment.status.slice(1)}
                </div>
              </div>
            </div>

            {/* Amount */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <p
                  style={{
                    fontWeight: 500,
                    fontSize: 12,
                    color: C.coolGrey,
                    textTransform: "uppercase",
                    letterSpacing: "0.7px",
                    marginBottom: 6,
                  }}
                >
                  Amount {isSuccess ? "Paid" : "Attempted"}
                </p>
                <p
                  style={{
                    fontWeight: 800,
                    fontSize: 40,
                    color: C.ink,
                    letterSpacing: "-1px",
                    lineHeight: 1,
                  }}
                >
                  {formatCurrency(payment.amount)}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontWeight: 500,
                    fontSize: 11,
                    color: C.coolGrey,
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    marginBottom: 4,
                  }}
                >
                  Receipt ID
                </p>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: 12,
                    color: C.mid,
                    fontFamily: "monospace",
                  }}
                >
                  {payment.id}
                </p>
              </div>
            </div>

            {/* Accent bar */}
            <div
              style={{
                height: 3,
                borderRadius: 999,
                background: isSuccess
                  ? `linear-gradient(90deg, ${C.teal}, ${C.teal}44)`
                  : `linear-gradient(90deg, ${C.coral}, ${C.coral}44)`,
                marginTop: 24,
              }}
            />
          </div>

          {/* Body */}
          <div
            style={{
              padding: "28px 36px",
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            {/* Transaction details */}
            <div>
              <SectionLabel icon={<FileText size={14} />}>
                Transaction Details
              </SectionLabel>
              <ReceiptRow label="Reference Number" value={reference} mono />
              <ReceiptRow
                label="Payment Provider"
                value={
                  (payment.provider || "Paystack").charAt(0).toUpperCase() +
                  (payment.provider || "Paystack").slice(1)
                }
              />
              <ReceiptRow
                label="Transaction Date"
                value={formatDate(payment.created_at)}
              />
              <ReceiptRow
                label="Currency"
                value={payment.currency?.toUpperCase() || "NGN"}
              />
            </div>

            {/* Billed to */}
            {payment.payer_user && (
              <div
                style={{
                  paddingTop: 20,
                  borderTop: `1px solid ${C.softBorder}`,
                }}
              >
                <SectionLabel icon={<FileText size={14} />}>
                  Billed To
                </SectionLabel>
                <div
                  style={{
                    background: C.snow,
                    borderRadius: 12,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "rgba(13,148,136,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 16,
                      color: C.teal,
                      flexShrink: 0,
                    }}
                  >
                    {payment.payer_user.first_name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>
                      {payment.payer_user.first_name}{" "}
                      {payment.payer_user.last_name}
                    </p>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: 13,
                        color: C.coolGrey,
                        marginTop: 2,
                      }}
                    >
                      {payment.payer_user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Plan details */}
            <div
              style={{ paddingTop: 20, borderTop: `1px solid ${C.softBorder}` }}
            >
              <SectionLabel icon={<CreditCard size={14} />}>
                Plan Details
              </SectionLabel>
              <div
                style={{
                  background: C.snow,
                  borderRadius: 12,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: C.teal,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.white,
                    fontWeight: 800,
                    fontSize: 16,
                    overflow: "hidden",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  {orgLogo ? (
                    <Image
                      src={orgLogo}
                      alt={planName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    planName.charAt(0)
                  )}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>
                    {planName}
                  </p>
                  <p
                    style={{
                      fontWeight: 400,
                      fontSize: 12,
                      color: C.coolGrey,
                      marginTop: 2,
                    }}
                  >
                    {payment.invoice?.member_subscription?.auto_renew
                      ? "Auto-renews each period"
                      : "Does not auto-renew"}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment summary */}
            <div
              style={{ paddingTop: 20, borderTop: `1px solid ${C.softBorder}` }}
            >
              <SectionLabel icon={<Receipt size={14} />}>
                Payment Summary
              </SectionLabel>
              <ReceiptRow
                label="Subtotal"
                value={formatCurrency(payment.amount)}
              />
              <ReceiptRow label="Tax / Fees" value={formatCurrency(0)} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 16,
                  padding: "16px 20px",
                  borderRadius: 12,
                  background: isSuccess
                    ? "rgba(13,148,136,0.06)"
                    : "rgba(240,101,67,0.06)",
                  border: `1px solid ${isSuccess ? "rgba(13,148,136,0.15)" : "rgba(240,101,67,0.15)"}`,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>
                  Total {isSuccess ? "Paid" : "Amount"}
                </span>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 22,
                    color: isSuccess ? C.teal : C.coral,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {formatCurrency(payment.amount)}
                </span>
              </div>
            </div>

            {/* Status message */}
            <div
              style={{ paddingTop: 20, borderTop: `1px solid ${C.softBorder}` }}
            >
              <div
                style={{
                  borderRadius: 14,
                  padding: "18px 20px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  background: isSuccess
                    ? "rgba(13,148,136,0.06)"
                    : "rgba(240,101,67,0.06)",
                  border: `1px solid ${isSuccess ? "rgba(13,148,136,0.15)" : "rgba(240,101,67,0.15)"}`,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: isSuccess
                      ? "rgba(13,148,136,0.12)"
                      : "rgba(240,101,67,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {isSuccess ? (
                    <Check
                      size={16}
                      style={{ color: C.teal }}
                      strokeWidth={3}
                    />
                  ) : (
                    <X size={16} style={{ color: C.coral }} strokeWidth={3} />
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: isSuccess ? C.teal : C.coral,
                      marginBottom: 4,
                    }}
                  >
                    {isSuccess ? "Payment Successful" : "Payment Failed"}
                  </p>
                  <p
                    style={{
                      fontWeight: 400,
                      fontSize: 13,
                      color: C.mid,
                      lineHeight: 1.65,
                    }}
                  >
                    {isSuccess
                      ? `Your payment has been processed successfully. A copy of this receipt has been sent to ${payment.payer_user?.email || "your email"}.`
                      : "This payment was not successful. Please contact support if you believe this is an error, or try again."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              background: C.snow,
              padding: "20px 36px",
              borderTop: `1px solid ${C.softBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <p style={{ fontWeight: 400, fontSize: 12, color: C.coolGrey }}>
              For questions, please contact support.
            </p>
            <p style={{ fontWeight: 400, fontSize: 11, color: C.border }}>
              Electronic receipt · No signature required
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
