"use client";

import { useEffect, useState } from "react";
import { Card, Button, Chip, Spinner } from "@heroui/react";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";

export default function BillingPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [subRes, invRes] = await Promise.all([
      apiClient.get("/subscriptions/organizations"),
      apiClient.get("/invoices/organization"),
    ]);
    // console.log(subRes, invRes);
    setSubscription(subRes.data.data || null);
    setInvoices(invRes.data.data);
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!confirm("Cancel subscription? You can use it until expiry.")) return;

    try {
      await apiClient.patch(
        `/subscriptions/organizations/${subscription.id}/cancel`,
      );
      alert("Subscription canceled");
      loadData();
    } catch (error) {
      alert("Failed to cancel");
    }
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="container mx-auto py-12">
      {/* Current Subscription */}
      <Card className="mb-6">
        <h1 className="text-2xl font-bold">Current Subscription</h1>
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
              <Button color="danger" variant="light" onPress={handleCancel}>
                Cancel Subscription
              </Button>
            </div>
          </>
        ) : (
          <p>No active subscription found.</p>
        )}
      </Card>

      {/* Invoices */}
      <Card>
        <h1 className="text-2xl font-bold">Billing History</h1>
        <div className="space-y-2">
          {invoices.map((invoice: any) => (
            <div
              key={invoice.id}
              className="flex justify-between items-center p-3 border rounded"
            >
              <div>
                <p className="font-semibold">{invoice.invoice_number}</p>
                <p className="text-sm text-gray-600">
                  {new Date(invoice.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">₦{invoice.amount}</p>
                <Chip
                  size="sm"
                  color={invoice.status === "paid" ? "success" : "warning"}
                >
                  {invoice.status}
                </Chip>
              </div>
              {invoice.status === "pending" && (
                <Button
                  size="sm"
                  color="primary"
                  onPress={() =>
                    router.push(`/enterprise/invoices/${invoice.id}/pay`)
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
