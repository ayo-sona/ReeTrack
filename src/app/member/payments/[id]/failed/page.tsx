"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
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

export default function PaymentFailedPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: payment, isLoading } = usePayment(id);

  const subscription =
    payment?.invoice?.member_subscription ||
    payment?.invoice?.organization_subscription;

  const planName = subscription?.plan?.name || "your plan";
  const communityName = subscription?.organization?.name || null;

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.snow,
          fontFamily: "Nunito, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
        <div
          style={{
            width: "400px",
            height: "300px",
            background: C.white,
            borderRadius: "16px",
            border: `1px solid ${C.border}`,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.snow,
        fontFamily: "Nunito, sans-serif",
        padding: "32px 24px 96px",
      }}
    >

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "120px 16px" }}>

        {/* Card */}
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
          {/* Red top bar */}
          <div style={{ height: "4px", background: C.coral }} />

          <div
            style={{
              padding: "40px 32px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "rgba(240,101,67,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertCircle size={32} style={{ color: C.coral }} />
            </div>

            {/* Message */}
            <div>
              <h1
                style={{
                  fontWeight: 800,
                  fontSize: "22px",
                  color: C.ink,
                  marginBottom: "8px",
                  letterSpacing: "-0.3px",
                }}
              >
                Payment Failed
              </h1>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: "14px",
                  color: C.coolGrey,
                  lineHeight: 1.7,
                  maxWidth: "360px",
                }}
              >
                We couldn't process your payment for{" "}
                <strong style={{ color: C.ink }}>{planName}</strong>
                {communityName ? (
                  <>
                    {" "}
                    at <strong style={{ color: C.ink }}>{communityName}</strong>
                  </>
                ) : (
                  ""
                )}
                . No money was charged.
              </p>
            </div>

            {/* Amount attempted */}
            {payment?.amount && (
              <div
                style={{
                  padding: "16px 24px",
                  borderRadius: "10px",
                  background: C.snow,
                  border: `1px solid ${C.border}`,
                  width: "100%",
                }}
              >
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    color: C.coolGrey,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "4px",
                  }}
                >
                  Amount Attempted
                </p>
                <p style={{ fontWeight: 800, fontSize: "24px", color: C.ink }}>
                  {formatCurrency(payment.amount)}
                </p>
              </div>
            )}

            {/* Actions */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "100%",
              }}
            >
              {/* Retry links to the invoice checkout if we have the invoice id */}
              {payment?.invoice?.member_subscription && (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => router.back()}
                >
                  <RefreshCw size={15} /> Try Again
                </Button>
              )}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/member/payments">Back to Payments</Link>
              </Button>
            </div>

            <p
              style={{
                fontWeight: 400,
                fontSize: "12px",
                color: C.coolGrey,
                lineHeight: 1.6,
              }}
            >
              Need help? Contact support and quote reference:{" "}
              <span style={{ fontFamily: "monospace", color: C.ink }}>
                {payment?.provider_reference || id}
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
