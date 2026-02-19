"use client";

import { useEffect, useState } from "react";
import { Card, Button, Chip, Spinner } from "@heroui/react";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSkeleton } from "@/components/ui";

// Add proper types
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

export default function BillingPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
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

    loadData();
  }, []); // Empty dependency array - only runs once on mount

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

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;

    try {
      setIsCancelling(true);
      await apiClient.patch(
        `/subscriptions/organizations/${subscription?.id}/cancel`,
      );
      toast("Subscription canceled");
      loadData();
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
      toast("Failed to cancel");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="container mx-auto py-12">
      {/* Current Subscription */}
      <Card className="mb-6 p-6 bg-default-100">
        <h1 className="text-2xl text-foreground font-bold mb-2">
          Current Subscription
        </h1>
        {subscription ? (
          <>
            <p className="text-2xl font-bold">{subscription.plan.name}</p>
            <p>
              ₦{subscription.plan.price}/{subscription.plan.interval}
            </p>
            <Chip
              color={subscription.status === "active" ? "success" : "warning"}
            >
              {subscription.status}
            </Chip>
            <p className="text-sm mt-2">
              {subscription.auto_renew
                ? `Next billing: ${new Date(subscription.expires_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
                : `Expires: ${new Date(subscription.expires_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`}
            </p>

            {/* Saved Card Info */}
            {subscription.organizationUser?.paystack_card_last4 && (
              <div className="mt-4">
                <p className="text-sm">Payment method:</p>
                <p>
                  {subscription.organizationUser?.paystack_card_brand} ••••{" "}
                  {subscription.organizationUser?.paystack_card_last4}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <Button
                color="danger"
                isLoading={isCancelling}
                disabled={isCancelling}
                variant="flat"
                onPress={handleCancel}
              >
                Cancel Subscription
              </Button>
            </div>
          </>
        ) : (
          <p>No active subscription found.</p>
        )}
      </Card>

      {/* Invoices */}
      <Card className="mb-6 p-6 bg-default-100">
        <h1 className="text-2xl text-foreground font-bold mb-2">
          Billing History
        </h1>
        <div className="space-y-2">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex justify-between items-center rounded-3xl p-3 border border-default-300"
            >
              <div>
                <p className="font-semibold text-foreground">
                  {invoice.invoice_number}
                </p>
                <p className="text-sm text-foreground">
                  {new Date(invoice.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">₦{invoice.amount}</p>
                <Chip
                  size="sm"
                  color={invoice.status === "paid" ? "success" : "warning"}
                >
                  {invoice.status}
                </Chip>
              </div>
              {invoice.status === "failed" && (
                <Button
                  size="sm"
                  color="primary"
                  onPress={() =>
                    router.push(`/organization/invoices/${invoice.id}/pay`)
                  }
                >
                  Pay Now
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
