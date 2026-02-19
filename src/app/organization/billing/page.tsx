"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CreditCard, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
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
      return { icon: <CheckCircle className="w-3 h-3" />, className: "bg-emerald-50 text-emerald-700 border border-emerald-100" };
    case "failed":
      return { icon: <AlertCircle className="w-3 h-3" />, className: "bg-red-50 text-red-600 border border-red-100" };
    default:
      return { icon: <Clock className="w-3 h-3" />, className: "bg-amber-50 text-amber-700 border border-amber-100" };
  }
};

export default function BillingPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [subRes, invRes] = await Promise.all([
      apiClient.get("/subscriptions/organizations"),
      apiClient.get("/invoices/organization"),
    ]);
    setSubscription(subRes.data.data || null);
    setInvoices(invRes.data.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;
    try {
      setIsCancelling(true);
      await apiClient.patch(`/subscriptions/organizations/${subscription?.id}/cancel`);
      toast.success("Subscription cancelled");
      loadData();
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
      toast.error("Failed to cancel subscription");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24" style={{ fontFamily: "Nunito, sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-100 border-t-[#0D9488] rounded-full animate-spin" />
          <p className="text-sm text-[#9CA3AF]">Loading billing details...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-3xl mx-auto py-10 px-4 sm:px-6 space-y-6"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Current Subscription */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#1F2937]">Current Subscription</h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Your active plan and billing details</p>
        </div>

        <div className="px-6 py-5">
          {subscription ? (
            <div className="space-y-5">
              {/* Plan info */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-extrabold text-[#1F2937]">{subscription.plan.name}</p>
                  <p className="text-sm text-[#9CA3AF] mt-0.5">
                    ₦{subscription.plan.price.toLocaleString()}
                    <span className="ml-0.5">/{subscription.plan.interval}</span>
                  </p>
                </div>
                <span
                  className={clsx(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize flex-shrink-0",
                    subscription.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-amber-50 text-amber-700 border border-amber-100"
                  )}
                >
                  <span className={clsx("w-1.5 h-1.5 rounded-full", subscription.status === "active" ? "bg-emerald-500" : "bg-amber-400")} />
                  {subscription.status}
                </span>
              </div>

              {/* Billing date */}
              <div className="bg-[#F9FAFB] border border-gray-100 rounded-lg px-4 py-3">
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-0.5">
                  {subscription.auto_renew ? "Next Billing Date" : "Expires On"}
                </p>
                <p className="text-sm font-bold text-[#1F2937]">
                  {new Date(subscription.expires_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Saved card */}
              {subscription.organizationUser?.paystack_card_last4 && (
                <div className="flex items-center gap-3 bg-[#F9FAFB] border border-gray-100 rounded-lg px-4 py-3">
                  <CreditCard className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">Payment Method</p>
                    <p className="text-sm font-bold text-[#1F2937]">
                      {subscription.organizationUser.paystack_card_brand} ···· {subscription.organizationUser.paystack_card_last4}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end pt-1">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Cancelling..." : "Cancel Subscription"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="w-7 h-7 text-[#0D9488]" />
              </div>
              <p className="text-base font-bold text-[#1F2937] mb-1">No active subscription</p>
              <p className="text-sm text-[#9CA3AF]">You don't have an active plan yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#1F2937]">Billing History</h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">All your past invoices</p>
        </div>

        <div className="divide-y divide-gray-50">
          {invoices.length > 0 ? (
            invoices.map((invoice) => {
              const statusCfg = getInvoiceStatusConfig(invoice.status);
              return (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-[#F9FAFB] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0D9488]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-[#0D9488]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1F2937]">{invoice.invoice_number}</p>
                      <p className="text-xs text-[#9CA3AF]">
                        {new Date(invoice.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="text-sm font-bold text-[#1F2937]">
                      ₦{invoice.amount.toLocaleString()}
                    </p>
                    <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize", statusCfg.className)}>
                      {statusCfg.icon}
                      {invoice.status}
                    </span>
                    {invoice.status === "failed" && (
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => router.push(`/organization/invoices/${invoice.id}/pay`)}
                      >
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-[#0D9488]" />
              </div>
              <p className="text-base font-bold text-[#1F2937] mb-1">No invoices yet</p>
              <p className="text-sm text-[#9CA3AF]">Your billing history will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}