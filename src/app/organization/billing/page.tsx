"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

interface Plan {
  name: string;
  price: number;
  interval: string;
}

interface OrganizationUser {
  paystack_card_last4?: string;
  paystack_card_brand?: string;
}

interface Subscription {
  id: string;
  plan: Plan;
  status: string;
  expires_at: string;
  auto_renew: boolean;
  organizationUser?: OrganizationUser;
}

interface Invoice {
  id: string;
  invoice_number: string;
  created_at: string;
  amount: number;
  status: string;
}

const getInvoiceStatusConfig = (status: string) => {
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

function BillingSkeleton() {
  return (
    <div
      className="w-full max-w-4xl mx-auto py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-4 w-80 bg-gray-100 rounded-lg animate-pulse" />
      </div>

      {/* Subscription card skeleton */}
      <div className="card">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#E5E7EB]">
          <div className="h-5 w-40 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <div className="px-4 sm:px-6 py-5 sm:py-6 space-y-6">
          <div className="flex justify-between pb-6 border-b border-[#E5E7EB]">
            <div className="space-y-2">
              <div className="h-7 w-48 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-4 w-32 bg-gray-100 rounded-lg animate-pulse" />
            </div>
            <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-5 w-36 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
            <div className="h-10 w-32 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-10 w-40 bg-gray-100 rounded-lg animate-pulse ml-auto" />
          </div>
        </div>
      </div>

      {/* Billing history skeleton */}
      <div className="card">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#E5E7EB]">
          <div className="h-5 w-32 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <div className="divide-y divide-[#E5E7EB]">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="h-5 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-7 w-20 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subRes, invRes] = await Promise.all([
        apiClient.get("/subscriptions/organizations"),
        apiClient.get("/invoices/organization"),
      ]);
      setSubscription(subRes.data.data || null);
      setInvoices(invRes.data.data || []);
    } catch (error) {
      console.error("Failed to load billing data:", error);
      toast.error("Failed to load billing information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? This action cannot be undone.",
      )
    )
      return;
    try {
      setIsCancelling(true);
      await apiClient.patch(
        `/subscriptions/organizations/${subscription?.id}/cancel`,
      );
      toast.success("Subscription cancelled successfully");
      loadData();
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
      toast.error("Failed to cancel subscription");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) return <BillingSkeleton />;

  return (
    <div
      className="w-full max-w-4xl mx-auto py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
          Billing & Subscription
        </h1>
        <p className="text-sm sm:text-base text-[#9CA3AF]">
          Manage your subscription and view billing history
        </p>
      </div>

      {/* Current Subscription Card */}
      <div className="card">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#E5E7EB]">
          <h2 className="text-base sm:text-lg font-bold text-[#0D9488]">
            Current Subscription
          </h2>
        </div>

        <div className="px-4 sm:px-6 py-5 sm:py-6">
          {subscription ? (
            <div className="space-y-6">
              {/* Plan Info */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 pb-6 border-b border-[#E5E7EB]">
                <div className="flex-1">
                  <p className="text-xl sm:text-2xl font-extrabold text-[#1F2937]">
                    {subscription.plan.name}
                  </p>
                  <p className="text-sm sm:text-base text-[#9CA3AF] mt-1">
                    <span className="font-bold text-[#1F2937]">
                      ₦{subscription.plan.price.toLocaleString()}
                    </span>
                    <span className="ml-1">/{subscription.plan.interval}</span>
                  </p>
                </div>
                <span
                  className={clsx(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold capitalize flex-shrink-0 self-start",
                    subscription.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200",
                  )}
                  style={{ borderRadius: "8px" }}
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

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-2">
                    {subscription.auto_renew ? "Next Billing Date" : "Expires On"}
                  </p>
                  <p className="text-sm sm:text-base font-bold text-[#1F2937]">
                    {new Date(subscription.expires_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-2">
                    Auto-Renewal
                  </p>
                  <p className="text-sm sm:text-base font-bold text-[#1F2937]">
                    {subscription.auto_renew ? "Enabled" : "Disabled"}
                  </p>
                </div>

                {subscription.organizationUser?.paystack_card_last4 && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-2">
                      Payment Method
                    </p>
                    <p className="text-sm sm:text-base font-bold text-[#1F2937]">
                      {subscription.organizationUser.paystack_card_brand} ····{" "}
                      {subscription.organizationUser.paystack_card_last4}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E5E7EB]">
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/organization/subscription/upgrade")}
                >
                  Upgrade Plan
                </Button>
                <Button
                  type="button"
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
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
              <p className="text-base sm:text-lg font-extrabold text-[#1F2937] mb-2">
                No active subscription
              </p>
              <p className="text-sm sm:text-base text-[#9CA3AF] mb-6 max-w-sm">
                You don&apos;t have an active plan yet. Choose a plan to get started.
              </p>
              <Button
                type="button"
                variant="default"
                size="lg"
                onClick={() => router.push("/#pricing")}
                className="shadow-lg shadow-[#F06543]/20"
              >
                View Plans
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Billing History */}
      <div className="card">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#E5E7EB]">
          <h2 className="text-base sm:text-lg font-bold text-[#0D9488]">
            Billing History
          </h2>
        </div>

        <div className="divide-y divide-[#E5E7EB]">
          {invoices.length > 0 ? (
            invoices.map((invoice) => {
              const statusCfg = getInvoiceStatusConfig(invoice.status);
              return (
                <div
                  key={invoice.id}
                  className="px-4 sm:px-6 py-4 sm:py-5 hover:bg-[#F9FAFB] transition-colors"
                >
                  {/* Mobile Layout */}
                  <div className="flex flex-col sm:hidden gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1F2937] truncate">
                          {invoice.invoice_number}
                        </p>
                        <p className="text-xs text-[#9CA3AF] mt-1">
                          {new Date(invoice.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <p className="text-base font-extrabold text-[#1F2937] flex-shrink-0">
                        ₦{invoice.amount.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={clsx(
                          "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold flex-1",
                          statusCfg.className,
                        )}
                        style={{ borderRadius: "8px" }}
                      >
                        {statusCfg.label}
                      </span>
                      {invoice.status === "failed" && (
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={() =>
                            router.push(`/organization/invoices/${invoice.id}/pay`)
                          }
                          className="flex-shrink-0"
                        >
                          Retry Payment
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1F2937] truncate">
                        {invoice.invoice_number}
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-1">
                        {new Date(invoice.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <p className="text-base font-extrabold text-[#1F2937] min-w-[120px] text-right">
                        ₦{invoice.amount.toLocaleString()}
                      </p>
                      <span
                        className={clsx(
                          "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold min-w-[90px] justify-center",
                          statusCfg.className,
                        )}
                        style={{ borderRadius: "8px" }}
                      >
                        {statusCfg.label}
                      </span>
                      {invoice.status === "failed" && (
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={() =>
                            router.push(`/organization/invoices/${invoice.id}/pay`)
                          }
                        >
                          Retry Payment
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
              <p className="text-base sm:text-lg font-extrabold text-[#1F2937] mb-2">
                No invoices yet
              </p>
              <p className="text-sm sm:text-base text-[#9CA3AF] max-w-sm">
                Your billing history will appear here once you have transactions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}