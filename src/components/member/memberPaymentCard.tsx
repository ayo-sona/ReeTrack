"use client";

import { Check, X, Clock, CreditCard } from "lucide-react";
import { MemberPayment } from "@/types/memberTypes/member";
import { useState } from "react";

const C = {
  teal:     "#0D9488",
  coral:    "#F06543",
  snow:     "#F9FAFB",
  white:    "#FFFFFF",
  ink:      "#1F2937",
  coolGrey: "#9CA3AF",
  border:   "#E5E7EB",
};

interface PaymentCardProps {
  payment: MemberPayment;
}

export default function PaymentCard({ payment }: PaymentCardProps) {
  const [hovered, setHovered] = useState(false);

  const STATUS_CONFIG: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
    success: { bg: "rgba(13,148,136,0.1)",  color: C.teal,    icon: <Check size={11} /> },
    pending: { bg: "rgba(251,191,36,0.12)", color: "#D97706", icon: <Clock size={11} /> },
    failed:  { bg: "rgba(240,101,67,0.1)",  color: C.coral,   icon: <X size={11} />    },
  };

  const cfg = STATUS_CONFIG[payment.status] ?? { bg: "rgba(156,163,175,0.12)", color: C.coolGrey, icon: null };

  const planName = payment.invoice?.member_subscription?.plan.name || "Unknown Plan";
  const paymentMethod = payment.payment_method || "card";
  const reference = payment.provider_reference || payment.id;

  // Handle amount - convert to number if it's a string
  const amount = typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount;
  const formattedAmount = isNaN(amount) ? '0.00' : amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white,
        borderRadius: "12px",
        padding: "24px",
        border: `1px solid ${hovered ? C.teal : C.border}`,
        boxShadow: hovered ? "0 8px 24px rgba(13,148,136,0.1)" : "0 1px 4px rgba(0,0,0,0.05)",
        transition: "all 300ms",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
      className="md:flex-row md:items-center md:justify-between"
      >
        {/* Payment Info */}
        <div style={{ flex: 1, display: "flex", alignItems: "flex-start", gap: "14px" }}>
          {/* Avatar */}
          <div style={{
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
          }}>
            {planName.charAt(0)}
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontWeight: 700,
              fontSize: "15px",
              color: C.ink,
              marginBottom: "4px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {planName}
            </h3>
            <p style={{
              fontWeight: 400,
              fontSize: "13px",
              color: C.coolGrey,
              marginBottom: "8px",
            }}>
              via {payment.payment_provider || "Payment Gateway"}
            </p>

            {/* Badges */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {/* Status badge */}
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 10px",
                borderRadius: "999px",
                background: cfg.bg,
                color: cfg.color,
                fontWeight: 600,
                fontSize: "12px",
              }}>
                {cfg.icon}
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </span>

              {/* Method badge */}
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 10px",
                borderRadius: "999px",
                background: C.snow,
                border: `1px solid ${C.border}`,
                color: C.coolGrey,
                fontWeight: 600,
                fontSize: "12px",
                textTransform: "capitalize",
              }}>
                <CreditCard size={11} />
                {paymentMethod}
              </span>
            </div>
          </div>
        </div>

        {/* Amount & Date */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{
            fontWeight: 800,
            fontSize: "20px",
            color: C.ink,
            letterSpacing: "-0.3px",
            marginBottom: "2px",
          }}>
            ₦{formattedAmount}
          </p>
          <p style={{
            fontWeight: 400,
            fontSize: "13px",
            color: C.coolGrey,
          }}>
            {new Date(payment.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p style={{
            fontWeight: 400,
            fontSize: "11px",
            color: C.border,
            marginTop: "2px",
            maxWidth: "180px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {reference}
          </p>
        </div>
      </div>
    </div>
  );
}