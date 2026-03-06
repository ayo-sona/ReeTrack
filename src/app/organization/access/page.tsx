"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, CreditCard, Crown, XCircle } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "overview" | "plans";
type BillingCycle = "monthly" | "annually";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  interval: string;
  features: string[];
}

interface Subscription {
  id: string;
  plan: { name: string; price: number; interval: string };
  status: string;
  expires_at: string;
  auto_renew: boolean;
  organizationUser?: {
    paystack_card_last4?: string;
    paystack_card_brand?: string;
  };
}

interface Invoice {
  id: string;
  invoice_number: string;
  created_at: string;
  amount: number;
  status: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatPrice(price: string | null, cycle: BillingCycle): string {
  if (price === null || price === "0") return "Free";
  const base = Number(price);
  return cycle === "annually"
    ? `${parseCurrency(base / 12)}/mo`
    : parseCurrency(base);
}

const invoiceStatusConfig = (status: string) => {
  switch (status) {
    case "paid":
      return {
        className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        label: "Paid",
      };
    case "failed":
      return {
        className: "bg-red-50 text-red-600 border border-red-200",
        label: "Failed",
      };
    default:
      return {
        className: "bg-amber-50 text-amber-700 border border-amber-200",
        label: "Pending",
      };
  }
};

const includedFeatures = [
  { feature: "Admin/staff accounts", BASIC: 1, PLATINUM: 3, GOLD: Infinity },
  { feature: "Custom emails/month", BASIC: 2, PLATINUM: 20, GOLD: 200 },
  { feature: "Transaction Fees", BASIC: "10%", PLATINUM: "7%", GOLD: "4%" },
  { feature: "Member Plans access", BASIC: 1, PLATINUM: 3, GOLD: Infinity },
  { feature: "Check-in service", BASIC: false, PLATINUM: true, GOLD: true },
  {
    feature: "Organization Reports Generation",
    BASIC: false,
    PLATINUM: true,
    GOLD: true,
  },
  { feature: "Priority support", BASIC: false, PLATINUM: true, GOLD: true },
];

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div
      className="w-full max-w-5xl mx-auto py-8 lg:py-12 px-4 sm:px-6 lg:px-8 space-y-6"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="space-y-2">
        <div className="h-9 w-52 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-4 w-72 bg-gray-100 rounded-lg animate-pulse" />
      </div>
      <div className="h-12 w-72 bg-gray-100 rounded-2xl animate-pulse" />
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-5 bg-gray-100 rounded-lg animate-pulse"
            style={{ width: `${70 - i * 10}%` }}
          />
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="px-6 py-4 flex items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-6 w-16 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SubscriptionPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  // Overview data
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  // Plans data
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [plansLoaded, setPlansLoaded] = useState(false);

  // Load overview data on mount
  useEffect(() => {
    (async () => {
      setLoadingOverview(true);
      try {
        const [subRes, invRes] = await Promise.all([
          apiClient.get("/subscriptions/organizations"),
          apiClient.get("/invoices/organization"),
        ]);
        console.log(subRes);
        setSubscription(subRes.data.data || null);
        setInvoices(invRes.data.data || []);
      } catch {
        toast.error("Failed to load billing information");
      } finally {
        setLoadingOverview(false);
      }
    })();
  }, []);

  // Lazy load plans when tab switches
  useEffect(() => {
    if (tab !== "plans" || plansLoaded) return;
    (async () => {
      setLoadingPlans(true);
      try {
        const res = await apiClient.get("/plans/organization");
        setPlans(res.data.data);
        setPlansLoaded(true);
      } catch {
        toast.error("Failed to load plans. Please refresh.");
      } finally {
        setLoadingPlans(false);
      }
    })();
  }, [tab, plansLoaded]);

  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? This action cannot be undone.",
      )
    )
      return;
    setIsCancelling(true);
    try {
      await apiClient.patch(
        `/subscriptions/organizations/${subscription?.id}/cancel`,
      );
      toast.success("Subscription cancelled successfully");
      const subRes = await apiClient.get("/subscriptions/organizations");
      setSubscription(subRes.data.data || null);
    } catch {
      toast.error("Failed to cancel subscription");
    } finally {
      setIsCancelling(false);
    }
  };

  const sortedPlans = [...plans]
    .filter((p) => p.price !== null && p.price !== "0")
    .sort((a, b) => +a.price - +b.price);
  const groupedPlans =
    billingCycle === "annually"
      ? sortedPlans.filter(
          (p) => p.interval === "yearly" || p.interval === null,
        )
      : sortedPlans.filter(
          (p) => p.interval === "monthly" || p.interval === null,
        );
  const comparisonPlans = [...plans]
    .sort((a, b) => +a.price - +b.price)
    .filter((p) => p.interval === "monthly" || p.interval === null);

  if (loadingOverview) return <Skeleton />;

  return (
    <div
      className="w-full max-w-5xl mx-auto py-8 lg:py-12 px-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
            Subscription
          </h1>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Manage your ReeTrack plan and billing history
          </p>
        </div>

        {subscription && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#0D9488]/5 border border-[#0D9488]/20 rounded-xl self-start sm:self-auto">
            <Crown className="w-4 h-4 text-[#0D9488]" />
            <span className="text-sm font-extrabold text-[#0D9488]">
              {subscription.plan.name}
            </span>
            <span
              className={clsx(
                "ml-1 text-xs font-bold px-2 py-0.5 rounded-full capitalize",
                subscription.status === "active"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700",
              )}
            >
              {subscription.status}
            </span>
          </div>
        )}
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 w-fit shadow-sm">
        {(
          [
            { key: "overview", label: "Overview" },
            { key: "plans", label: "Plans" },
          ] as { key: Tab; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={clsx(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
              tab === key
                ? "bg-[#0D9488] text-white shadow-sm"
                : "text-[#9CA3AF] hover:text-[#1F2937]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {tab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Current Plan Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-[#0D9488]">
                  Current Plan
                </h2>
                {!subscription && (
                  <button
                    onClick={() => setTab("plans")}
                    className="text-xs font-bold text-[#F06543] hover:text-[#D85436] transition-colors"
                  >
                    View Plans →
                  </button>
                )}
              </div>

              <div className="px-6 py-6">
                {subscription ? (
                  <div className="space-y-6">
                    {/* Plan headline */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-6 border-b border-gray-100">
                      <div>
                        <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">
                          You are currently on
                        </p>
                        <p className="text-2xl font-extrabold text-[#1F2937]">
                          {subscription.plan.name}
                        </p>
                        <p className="text-sm text-[#9CA3AF] mt-1">
                          <span className="font-bold text-[#1F2937]">
                            ₦{subscription.plan.price.toLocaleString()}
                          </span>
                          <span className="ml-1">
                            / {subscription.plan.interval}
                          </span>
                        </p>
                      </div>
                      <span
                        className={clsx(
                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold capitalize self-start",
                          subscription.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200",
                        )}
                      >
                        <span
                          className={clsx(
                            "w-2 h-2 rounded-full",
                            subscription.status === "active"
                              ? "bg-emerald-500"
                              : "bg-amber-400",
                          )}
                        />
                        {subscription.status}
                      </span>
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1.5">
                          {subscription.auto_renew
                            ? "Next Billing Date"
                            : "Expires On"}
                        </p>
                        <p className="text-sm font-bold text-[#1F2937]">
                          {new Date(subscription.expires_at).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" },
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1.5">
                          Auto-Renewal
                        </p>
                        <p className="text-sm font-bold text-[#1F2937]">
                          {subscription.auto_renew ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                      {subscription.organizationUser?.paystack_card_last4 && (
                        <div className="sm:col-span-2">
                          <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1.5">
                            Payment Method
                          </p>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-[#9CA3AF]" />
                            <p className="text-sm font-bold text-[#1F2937]">
                              {
                                subscription.organizationUser
                                  .paystack_card_brand
                              }{" "}
                              ····{" "}
                              {
                                subscription.organizationUser
                                  .paystack_card_last4
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="default"
                        className="w-full sm:w-auto"
                        onClick={() => setTab("plans")}
                      >
                        Upgrade Plan
                      </Button>
                      <Button
                        variant="destructive"
                        size="default"
                        onClick={handleCancel}
                        disabled={isCancelling}
                        className="w-full sm:w-auto sm:ml-auto"
                      >
                        {isCancelling ? "Cancelling..." : "Cancel Subscription"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-14 text-center px-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#0D9488]/10 flex items-center justify-center mb-4"></div>
                    <p className="text-lg font-extrabold text-[#1F2937] mb-1">
                      No active/pending subscription
                    </p>
                    <p className="text-sm text-[#9CA3AF] mb-6 max-w-xs">
                      Choose a plan to unlock the full power of ReeTrack for
                      your organization.
                    </p>
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => setTab("plans")}
                      className="shadow-lg shadow-[#F06543]/20"
                    >
                      View Plans
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-[#0D9488]">
                  Billing History
                </h2>
              </div>

              <div className="divide-y divide-gray-50">
                {invoices.length > 0 ? (
                  invoices.map((invoice) => {
                    const cfg = invoiceStatusConfig(invoice.status);
                    return (
                      <div
                        key={invoice.id}
                        className="px-6 py-4 hover:bg-[#F9FAFB] transition-colors"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#1F2937] truncate">
                              {invoice.invoice_number}
                            </p>
                            <p className="text-xs text-[#9CA3AF] mt-0.5">
                              {new Date(invoice.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <p className="text-sm font-extrabold text-[#1F2937]">
                              ₦{invoice.amount.toLocaleString()}
                            </p>
                            <span
                              className={clsx(
                                "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold",
                                cfg.className,
                              )}
                            >
                              {cfg.label}
                            </span>
                            {invoice.status === "failed" && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  router.push(
                                    `/organization/invoices/${invoice.id}/pay`,
                                  )
                                }
                              >
                                Retry
                              </Button>
                            )}
                            {invoice.status === "pending" && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                  router.push(
                                    `/organization/invoices/${invoice.id}/checkout`,
                                  )
                                }
                              >
                                Pay Now
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-14 text-center px-4">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4"></div>
                    <p className="text-base font-extrabold text-[#1F2937] mb-1">
                      No invoices yet
                    </p>
                    <p className="text-sm text-[#9CA3AF] max-w-xs">
                      Your billing history will appear here once you have
                      transactions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Plans Tab */}
        {tab === "plans" && (
          <motion.div
            key="plans"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {/* Billing cycle toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#1F2937]">
                  Choose a Plan
                </h2>
                <p className="text-sm text-[#9CA3AF] mt-0.5">
                  Pick what fits your organization. Upgrade or downgrade
                  anytime.
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-2 py-1.5 shadow-sm w-fit">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={clsx(
                    "px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200",
                    billingCycle === "monthly"
                      ? "bg-[#0D9488] text-white shadow-sm"
                      : "text-[#9CA3AF] hover:text-[#1F2937]",
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("annually")}
                  className={clsx(
                    "px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2",
                    billingCycle === "annually"
                      ? "bg-[#0D9488] text-white shadow-sm"
                      : "text-[#9CA3AF] hover:text-[#1F2937]",
                  )}
                >
                  Annually
                  <span
                    className={clsx(
                      "text-xs px-1.5 py-0.5 rounded-full font-bold",
                      billingCycle === "annually"
                        ? "bg-white text-[#0D9488]"
                        : "bg-[#0D9488]/10 text-[#0D9488]",
                    )}
                  >
                    −15%
                  </span>
                </button>
              </div>
            </div>

            {loadingPlans ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 animate-pulse"
                  >
                    <div className="h-5 w-32 bg-gray-100 rounded-lg" />
                    <div className="h-4 w-full bg-gray-100 rounded" />
                    <div className="h-10 w-24 bg-gray-100 rounded-xl" />
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-3 bg-gray-100 rounded" />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Plan cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
                  {groupedPlans.map((plan) => {
                    const isCurrentPlan =
                      subscription?.plan.name === plan.name &&
                      +subscription?.plan.price === +plan.price;
                    const isPopular = plan.name === "Platinum";
                    return (
                      <div
                        key={plan.id}
                        className={clsx(
                          "relative bg-white rounded-2xl border flex flex-col transition-all duration-300 hover:shadow-lg",
                          isPopular
                            ? "border-[#0D9488] shadow-md ring-1 ring-[#0D9488]"
                            : "border-gray-100 shadow-sm",
                        )}
                      >
                        {isPopular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <span className="bg-[#0D9488] text-white text-xs font-bold px-4 py-1 rounded-full">
                              Most Popular
                            </span>
                          </div>
                        )}
                        {isCurrentPlan && (
                          <div className="absolute -top-3 right-4">
                            <span className="bg-[#F06543] text-white text-xs font-bold px-3 py-1 rounded-full">
                              Current
                            </span>
                          </div>
                        )}

                        <div className="px-6 pt-8 pb-5 border-b border-gray-100">
                          <h3 className="text-base font-extrabold text-[#1F2937] mb-1">
                            {plan.name}
                          </h3>
                          <p className="text-sm text-[#9CA3AF] mb-4 leading-relaxed">
                            {plan.description}
                          </p>
                          <span className="text-3xl font-extrabold text-[#1F2937]">
                            {formatPrice(plan.price, billingCycle)}
                          </span>
                          {billingCycle === "annually" &&
                            plan.price !== null && (
                              <p className="text-xs text-[#9CA3AF] mt-1">
                                Billed annually at{" "}
                                {parseCurrency(Number(plan.price))}/yr
                              </p>
                            )}
                        </div>

                        <div className="px-6 py-5 flex-1">
                          <ul className="space-y-2.5">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2.5">
                                <CheckCircle className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                                <span className="text-sm text-[#1F2937]">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="px-6 pb-6">
                          <Button
                            variant={isPopular ? "default" : "outline"}
                            className="w-full"
                            disabled={isCurrentPlan || plan.price === null}
                            onClick={() =>
                              !isCurrentPlan &&
                              plan.price !== null &&
                              router.push(`/organization/checkout/${plan.id}`)
                            }
                          >
                            {isCurrentPlan
                              ? "Current Plan"
                              : plan.price === null
                                ? "Contact Us"
                                : "Get Started"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Feature comparison */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-base font-bold text-[#1F2937]">
                      Compare plans
                    </h2>
                    <p className="text-sm text-[#9CA3AF] mt-0.5">
                      Everything included across all plans.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left px-6 py-4 text-sm font-semibold text-[#1F2937] min-w-[160px] sm:w-1/2">
                            Feature
                          </th>
                          {comparisonPlans.map((plan) => (
                            <th
                              key={plan.id}
                              className="text-center px-6 py-4 text-sm font-bold text-[#0D9488] min-w-[90px]"
                            >
                              {plan.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {includedFeatures.map((feature, i) => (
                          <tr
                            key={i}
                            className="hover:bg-[#F9FAFB] transition-colors"
                          >
                            <td className="px-6 py-3.5 text-sm text-[#1F2937]">
                              {feature.feature}
                            </td>
                            {comparisonPlans.map((plan) => {
                              const planName = plan.name.toUpperCase();
                              const featureValue =
                                feature[planName as keyof typeof feature];

                              return (
                                <td
                                  key={plan.id}
                                  className="px-6 py-3.5 text-center"
                                >
                                  {featureValue === true ? (
                                    <CheckCircle className="w-4 h-4 text-[#0D9488] mx-auto" />
                                  ) : featureValue === false ? (
                                    <XCircle className="w-4 h-4 text-[#EF4444] mx-auto" />
                                  ) : featureValue === Infinity ? (
                                    <span className="text-sm font-bold text-[#0D9488]">
                                      ∞
                                    </span>
                                  ) : typeof featureValue === "string" ? (
                                    <span className="text-sm font-semibold text-[#1F2937]">
                                      {featureValue}
                                    </span>
                                  ) : typeof featureValue === "number" ? (
                                    <span className="text-sm font-bold text-[#1F2937]">
                                      {featureValue}
                                    </span>
                                  ) : (
                                    <XCircle className="w-4 h-4 text-[#EF4444] mx-auto" />
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
