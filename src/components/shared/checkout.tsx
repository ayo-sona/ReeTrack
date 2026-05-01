"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, CreditCard, Shield, Building2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/apiClient";
import { usePaystack } from "@/hooks/usePaystack";
import posthog from "posthog-js";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CheckoutPlan {
  id: string;
  name: string;
  description?: string;
  price: number | null;
  interval?: string | null;
  features?: string[];
  organization_id?: string;
  organization?: {
    name: string;
    description?: string;
    address?: string;
    email?: string;
    phone?: string;
  };
}

export interface CheckoutConfig {
  /**
   * "member"       → subscribes a member to a community plan
   * "organization" → subscribes an org to a ReeTrack platform plan
   * "marketplace"  → one-time purchase of a marketplace listing
   */
  mode: "member" | "organization" | "marketplace";

  plan: CheckoutPlan;

  /** Where to send the user after clicking back */
  backHref: string;
  backLabel?: string;

  /** Email of the current user — required for member mode */
  // userEmail?: string;

  // Failed Invoice
  failedInvoice?: boolean;

  // Failed Invoice Id
  failedInvoiceId?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// const C = {
//   teal:     "#0D9488",
//   coral:    "#F06543",
//   snow:     "#F9FAFB",
//   white:    "#FFFFFF",
//   ink:      "#1F2937",
//   coolGrey: "#9CA3AF",
//   border:   "#E5E7EB",
// };

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

function parseCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatPrice(amount: number | null) {
  if (amount === null) return "Free";
  return parseCurrency(amount);
}

function getNextBillingDate(
  interval: string | null | undefined,
): string | null {
  if (!interval) return null;
  const next = new Date();
  switch (interval.toLowerCase()) {
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "yearly":
    case "annual":
      next.setFullYear(next.getFullYear() + 1);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "quarterly":
      next.setMonth(next.getMonth() + 3);
      break;
    default:
      return null;
  }
  return next.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function parseApiError(error: any): string {
  if (error?.response) {
    const { data, status } = error.response;
    if (status === 400)
      return data.message || "Invalid request. Please check your details.";
    if (status === 403)
      return "You don't have permission to perform this action.";
    if (status === 404) return "The requested resource was not found.";
    if (status >= 500)
      return "A server error occurred. Please try again later.";
    return data.message || "An error occurred. Please try again.";
  }
  if (error?.request)
    return "No response from server. Please check your connection.";
  return error?.message || "An error occurred. Please try again.";
}

// ── Shared Checkout Component ─────────────────────────────────────────────────

export function SharedCheckout({
  mode,
  plan,
  backHref,
  backLabel = "Back",
  // userEmail,
  failedInvoice,
  failedInvoiceId,
}: CheckoutConfig) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isReady, resumeTransaction } = usePaystack();

  const nextBillingDate = getNextBillingDate(plan.interval);

  const handleCheckout = async () => {
    // if (mode === "member" && !userEmail) {
    //   setError("Unable to process payment. Please try again.");
    //   return;
    // }

    setIsProcessing(true);
    setError(null);

    posthog.capture("checkout_initiated", {
      plan_id: plan.id,
      plan_name: plan.name,
      plan_price: plan.price,
      plan_interval: plan.interval,
      mode,
    });

    try {
      let invoiceId;

      if (mode === "member") {
        if (!failedInvoice) {
          const {
            data: {
              data: { invoice },
            },
          } = await apiClient.post(
            `/subscriptions/members/subscribe/${plan.organization_id}`,
            { planId: plan.id },
          );
          invoiceId = invoice.id;
        } else {
          invoiceId = failedInvoiceId;
        }

        const {
          data: { data: paymentData },
        } = await apiClient.post("/payments/paystack/initialize", {
          invoiceId,
          metadata: {
            channels: ["card", "bank", "apple_pay", "ussd", "qr", "mobile_money", "bank_transfer", "eft", "capitec_pay", "payattitude"],
          },
        });
        if (!isReady) return;
        resumeTransaction(paymentData.access_code);

      } else if (mode === "organization") {
        if (!failedInvoice) {
          const {
            data: {
              data: { invoice },
            },
          } = await apiClient.post("/subscriptions/organizations", {
            planId: plan.id,
          });
          invoiceId = invoice.id;
        } else {
          invoiceId = failedInvoiceId;
        }

        const {
          data: { data: paymentData },
        } = await apiClient.post("/payments/paystack/organization/initialize", {
          invoiceId,
          metadata: {
            channels: ["card", "bank", "apple_pay", "ussd", "qr", "mobile_money", "bank_transfer", "eft", "capitec_pay", "payattitude"],
          },
        });
        if (!isReady) return;
        resumeTransaction(paymentData.access_code);

      } else if (mode === "marketplace") {
        const {
          data: { data: paymentData },
        } = await apiClient.post("/payments/paystack/initialize", {
          amount: plan.price,
          metadata: {
            listing_id: plan.id,
            listing_title: plan.name,
            channels: ["card", "bank", "apple_pay", "ussd", "qr", "mobile_money", "bank_transfer"],
          },
        });
        if (!isReady) return;
        resumeTransaction(paymentData.access_code);
      }

    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-[Nunito,sans-serif] px-4 py-8 sm:py-12 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-6"
        >
          <Link href={backHref}>
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} />
              {backLabel}
            </Button>
          </Link>
        </motion.div>

        {/* Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="mb-8"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-[#0D9488] mb-1">
            Checkout
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
            Review & Complete Payment
          </h1>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Confirm your subscription details before proceeding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── Left column ────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Organization card — only shown in member mode when org info exists */}
            {mode === "member" && plan.organization && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                className="bg-white rounded-xl border border-[#E5E7EB] p-6 sm:p-7"
              >
                <div className="flex items-center gap-2 mb-5">
                  <Building2 size={16} className="text-[#0D9488]" />
                  <h2 className="text-sm font-bold text-[#0D9488] uppercase tracking-wide">
                    Organisation
                  </h2>
                </div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-[#0D9488] flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0">
                    {plan.organization.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1F2937]">
                      {plan.organization.name}
                    </p>
                    {plan.organization.description && (
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        {plan.organization.description}
                      </p>
                    )}
                  </div>
                </div>
                {(plan.organization.address ||
                  plan.organization.email ||
                  plan.organization.phone) && (
                  <div className="border-t border-[#E5E7EB] pt-4 space-y-1">
                    {plan.organization.address && (
                      <p className="text-xs text-[#9CA3AF]">
                        {plan.organization.address}
                      </p>
                    )}
                    {plan.organization.email && (
                      <p className="text-xs text-[#9CA3AF]">
                        {plan.organization.email}
                      </p>
                    )}
                    {plan.organization.phone && (
                      <p className="text-xs text-[#9CA3AF]">
                        {plan.organization.phone}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Plan details */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="bg-white rounded-xl border border-[#E5E7EB] p-6 sm:p-7"
            >
              <h2 className="text-sm font-bold text-[#0D9488] uppercase tracking-wide mb-5">
                Plan Details
              </h2>
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">
                    Plan
                  </p>
                  <p className="text-lg font-extrabold text-[#1F2937]">
                    {plan.name}
                  </p>
                </div>
                {plan.description && (
                  <div>
                    <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">
                      Description
                    </p>
                    <p className="text-sm text-[#1F2937] leading-relaxed">
                      {plan.description}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">
                      Price
                    </p>
                    <p className="text-2xl font-extrabold text-[#0D9488]">
                      {formatPrice(plan.price)}
                    </p>
                  </div>
                  {plan.interval && (
                    <div>
                      <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">
                        Billing Period
                      </p>
                      <p className="text-base font-bold text-[#1F2937] capitalize">
                        {plan.interval}
                      </p>
                    </div>
                  )}
                </div>

                {nextBillingDate && (
                  <div className="bg-[#0D9488]/8 border border-[#0D9488]/20 rounded-lg px-4 py-3">
                    <p className="text-xs font-bold text-[#0D9488] uppercase tracking-wide mb-1">
                      Next Billing Date
                    </p>
                    <p className="text-sm font-bold text-[#0D9488]">
                      {nextBillingDate}
                    </p>
                  </div>
                )}

                {plan.features && plan.features.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-3">
                      What&apos;s Included
                    </p>
                    <ul className="space-y-2">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check
                            size={15}
                            className="text-[#0D9488] shrink-0 mt-0.5"
                          />
                          <span className="text-sm text-[#1F2937] leading-relaxed">
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Security notice */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4"
            >
              <Shield size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-700 mb-0.5">
                  Secure Payment
                </p>
                <p className="text-xs text-blue-500 leading-relaxed">
                  Your payment information is encrypted. We use
                  industry-standard security to protect your data.
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── Right column — Order summary ──────────────────────────────── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl border-2 border-[#E5E7EB] p-6 sm:p-7 lg:sticky lg:top-8">
              <h2 className="text-sm font-bold text-[#0D9488] uppercase tracking-wide mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#9CA3AF]">Plan</span>
                  <span className="text-sm font-semibold text-[#1F2937]">
                    {plan.name}
                  </span>
                </div>
                {plan.interval && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Billing</span>
                    <span className="text-sm font-semibold text-[#1F2937] capitalize">
                      {plan.interval}
                    </span>
                  </div>
                )}
                {nextBillingDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Next Billing</span>
                    <span className="text-sm font-semibold text-[#1F2937]">
                      {nextBillingDate}
                    </span>
                  </div>
                )}
                <div className="border-t border-[#E5E7EB] pt-3 flex justify-between items-baseline">
                  <span className="text-base font-bold text-[#1F2937]">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-[#0D9488]">
                      {formatPrice(plan.price)}
                    </span>
                    {plan.interval && (
                      <p className="text-xs text-[#9CA3AF]">/{plan.interval}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-xs font-semibold text-red-600">{error}</p>
                </div>
              )}

              {/* CTA with coral glow */}
              <div className="relative mb-4">
                <div
                  className="absolute inset-[-4px] rounded-xl bg-gradient-to-r from-[#F06543]/40 via-[#F06543]/20 to-[#F06543]/40 blur-[14px] z-0"
                  style={{
                    opacity: isProcessing || plan.price === null ? 0.2 : 0.6,
                  }}
                />
                <div className="relative z-10">
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={isProcessing || plan.price === null}
                  >
                    <CreditCard size={16} />
                    {isProcessing
                      ? "Processing..."
                      : plan.price === null
                        ? "Free Plan — Activate"
                        : "Proceed to Payment"}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-[#9CA3AF] text-center leading-relaxed">
                By subscribing you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
