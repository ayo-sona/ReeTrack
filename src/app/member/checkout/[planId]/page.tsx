"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Building2, Check, CreditCard, Shield } from "lucide-react";
import Link from "next/link";
import { useAvailablePlans } from "@/hooks/memberHook/useCommunity";
import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/memberHook/useMember";
import apiClient from "@/lib/apiClient";
import { usePaystack } from "@/hooks/usePaystack";
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
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.planId as string;

  const { data: allPlans, isLoading: plansLoading } = useAvailablePlans();
  const { data: profile } = useProfile();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isReady, resumeTransaction } = usePaystack();

  const plan = allPlans?.find((p) => p.id === planId);

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "Free";
    return `₦${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getNextBillingDate = (interval: string | null) => {
    if (!interval) return null;
    const today = new Date();
    const nextDate = new Date(today);

    switch (interval.toLowerCase()) {
      case "monthly":
        nextDate.setMonth(today.getMonth() + 1);
        break;
      case "yearly":
      case "annual":
        nextDate.setFullYear(today.getFullYear() + 1);
        break;
      case "weekly":
        nextDate.setDate(today.getDate() + 7);
        break;
      case "quarterly":
        nextDate.setMonth(today.getMonth() + 3);
        break;
      default:
        return null;
    }

    return nextDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCheckout = async () => {
    if (!profile?.email || plan?.price === null) {
      setError("Unable to process payment. Please try again.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const {
        data: {
          data: { invoice },
        },
      } = await apiClient.post(
        `/subscriptions/members/subscribe/${plan?.organization_id}`,
        { planId: plan?.id },
      );

      const {
        data: { data: paymentData },
      } = await apiClient.post("/payments/paystack/initialize", {
        invoiceId: invoice?.id,
      });

      if (!isReady) return;
      resumeTransaction(paymentData.access_code);
      router.refresh();
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        if (status === 400) {
          setError(data.message || "Invalid request. Please check your details and try again.");
        } else if (status === 403) {
          setError("You don't have permission to perform this action.");
        } else if (status === 404) {
          setError("The requested resource was not found.");
        } else if (status >= 500) {
          setError("A server error occurred. Please try again later.");
        } else {
          setError(data.message || "An error occurred. Please try again.");
        }
      } else if (error.request) {
        setError("No response from server. Please check your connection and try again.");
      } else {
        setError(error.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading state
  if (plansLoading) {
    return (
      <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "32px 24px" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        `}</style>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ height: "32px", width: "200px", background: C.white, borderRadius: "8px", border: `1px solid ${C.border}`, animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: "400px", background: C.white, borderRadius: "16px", border: `1px solid ${C.border}`, animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>
      </div>
    );
  }

  // Not found state
  if (!plan) {
    return (
      <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "32px 24px" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');`}</style>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ background: C.white, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "64px 32px", textAlign: "center" }}>
            <h3 style={{ fontWeight: 700, fontSize: "20px", color: C.ink, marginBottom: "8px" }}>Plan Not Found</h3>
            <p style={{ fontWeight: 400, fontSize: "15px", color: C.coolGrey, marginBottom: "24px", lineHeight: 1.6 }}>
              The plan you&apos;re trying to subscribe to doesn&apos;t exist or is no longer available.
            </p>
            <Button variant="secondary" asChild>
              <Link href="/member/communities">Back to My Community</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const nextBillingDate = getNextBillingDate(plan.interval);

  return (
    <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "32px 24px 96px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* Back button */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} style={{ marginBottom: "24px" }}>
          <Link href={`/member/communities/${plan.organization_id}`} style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} />
              Back to Plans
            </Button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} style={{ marginBottom: "32px" }}>
          <h1 style={{ fontWeight: 800, fontSize: "32px", color: C.ink, letterSpacing: "-0.4px" }}>Checkout</h1>
          <p style={{ fontWeight: 400, fontSize: "15px", color: C.coolGrey, marginTop: "4px" }}>
            Review your subscription and complete payment
          </p>
        </motion.div>

        <div style={{ display: "grid", gap: "24px" }} className="lg:grid-cols-3">

          {/* Left column */}
          <div className="lg:col-span-2" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Organization card */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
              style={{ background: C.white, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "28px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <Building2 size={18} style={{ color: C.teal }} />
                <h2 style={{ fontWeight: 700, fontSize: "16px", color: C.teal }}>Organization</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px", background: C.teal,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: C.white, fontWeight: 800, fontSize: "20px",
                }}>
                  {plan.organization.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "15px", color: C.ink }}>{plan.organization.name}</p>
                  <p style={{ fontWeight: 400, fontSize: "13px", color: C.coolGrey }}>{plan.organization.description}</p>
                </div>
              </div>
              <div style={{ paddingTop: "16px", borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: "6px" }}>
                <p style={{ fontWeight: 400, fontSize: "13px", color: C.coolGrey }}>{plan.organization.address}</p>
                <p style={{ fontWeight: 400, fontSize: "13px", color: C.coolGrey }}>{plan.organization.email}</p>
                <p style={{ fontWeight: 400, fontSize: "13px", color: C.coolGrey }}>{plan.organization.phone}</p>
              </div>
            </motion.div>

            {/* Plan details card */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
              style={{ background: C.white, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "28px" }}
            >
              <h2 style={{ fontWeight: 700, fontSize: "16px", color: C.teal, marginBottom: "20px" }}>Plan Details</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <p style={{ fontWeight: 400, fontSize: "12px", color: C.coolGrey, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Plan Name</p>
                  <p style={{ fontWeight: 700, fontSize: "18px", color: C.ink }}>{plan.name}</p>
                </div>
                <div>
                  <p style={{ fontWeight: 400, fontSize: "12px", color: C.coolGrey, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Description</p>
                  <p style={{ fontWeight: 400, fontSize: "14px", color: C.ink, lineHeight: 1.6 }}>{plan.description}</p>
                </div>
                <div style={{ display: "grid", gap: "16px" }} className="md:grid-cols-2">
                  <div>
                    <p style={{ fontWeight: 400, fontSize: "12px", color: C.coolGrey, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Price</p>
                    <p style={{ fontWeight: 800, fontSize: "24px", color: C.teal, letterSpacing: "-0.3px" }}>{formatCurrency(plan.price)}</p>
                  </div>
                  {plan.interval && (
                    <div>
                      <p style={{ fontWeight: 400, fontSize: "12px", color: C.coolGrey, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Billing Period</p>
                      <p style={{ fontWeight: 700, fontSize: "16px", color: C.ink, textTransform: "capitalize" }}>{plan.interval}</p>
                    </div>
                  )}
                </div>
                {nextBillingDate && (
                  <div style={{ background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.2)", borderRadius: "8px", padding: "14px" }}>
                    <p style={{ fontWeight: 600, fontSize: "12px", color: C.teal, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Next Billing Date</p>
                    <p style={{ fontWeight: 700, fontSize: "16px", color: C.teal }}>{nextBillingDate}</p>
                  </div>
                )}
                {plan.features && plan.features.length > 0 && (
                  <div>
                    <p style={{ fontWeight: 400, fontSize: "12px", color: C.coolGrey, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>What&apos;s Included</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {plan.features.map((feature: string, idx: number) => (
                        <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <Check size={16} style={{ color: C.teal, flexShrink: 0, marginTop: "2px" }} />
                          <span style={{ fontWeight: 400, fontSize: "14px", color: C.ink, lineHeight: 1.5 }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Security notice */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
              style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "12px", padding: "16px", display: "flex", gap: "12px" }}
            >
              <Shield size={18} style={{ color: "#3B82F6", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <p style={{ fontWeight: 600, fontSize: "14px", color: "#1E40AF", marginBottom: "4px" }}>Secure Payment</p>
                <p style={{ fontWeight: 400, fontSize: "13px", color: "#3B82F6", lineHeight: 1.5 }}>
                  Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right column - Order summary */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5} className="lg:col-span-1">
            <div style={{
              background: C.white, borderRadius: "16px",
              border: `2px solid ${C.border}`, padding: "28px",
              position: "sticky", top: "32px",
            }}>
              <h2 style={{ fontWeight: 700, fontSize: "16px", color: C.teal, marginBottom: "20px" }}>Order Summary</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey }}>Plan</span>
                  <span style={{ fontWeight: 600, fontSize: "14px", color: C.ink }}>{plan.name}</span>
                </div>
                {plan.interval && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey }}>Billing</span>
                    <span style={{ fontWeight: 600, fontSize: "14px", color: C.ink, textTransform: "capitalize" }}>{plan.interval}</span>
                  </div>
                )}
                {nextBillingDate && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey }}>Next Billing</span>
                    <span style={{ fontWeight: 600, fontSize: "14px", color: C.ink }}>{nextBillingDate}</span>
                  </div>
                )}
                <div style={{ paddingTop: "14px", borderTop: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600, fontSize: "16px", color: C.ink }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: "20px", color: C.teal, letterSpacing: "-0.3px" }}>{formatCurrency(plan.price)}</span>
                  </div>
                  {plan.interval && (
                    <p style={{ fontWeight: 400, fontSize: "12px", color: C.coolGrey, textAlign: "right" }}>Billed {plan.interval}</p>
                  )}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{ marginBottom: "16px", padding: "12px", background: "rgba(240,101,67,0.08)", border: "1px solid rgba(240,101,67,0.3)", borderRadius: "8px" }}>
                  <p style={{ fontWeight: 400, fontSize: "13px", color: C.coral }}>{error}</p>
                </div>
              )}

              {/* Checkout button - coral CTA with glow */}
              <div style={{ position: "relative", marginBottom: "16px" }}>
                <div style={{
                  position: "absolute", inset: "-4px", borderRadius: "12px",
                  background: `linear-gradient(to right, rgba(240,101,67,0.4), rgba(240,101,67,0.2), rgba(240,101,67,0.4))`,
                  filter: "blur(14px)",
                  opacity: isProcessing || plan.price === null ? 0.3 : 0.7,
                  zIndex: 0,
                }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={isProcessing || plan.price === null}
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard size={18} />
                        {plan.price === null ? "Free Plan" : "Proceed to Payment"}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Terms */}
              <p style={{ fontWeight: 400, fontSize: "11px", color: C.coolGrey, textAlign: "center", lineHeight: 1.4 }}>
                By subscribing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}