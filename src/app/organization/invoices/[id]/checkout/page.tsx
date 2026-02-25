"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { SharedCheckout, CheckoutPlan } from "@/components/shared/checkout";
import { Button } from "@/components/ui/button";

export default function InvoiceCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const [plan, setPlan] = useState<CheckoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!invoiceId) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get(`/invoices/organization/${invoiceId}`);
        const invoice = data.data;

        // Shape the invoice into CheckoutPlan so SharedCheckout
        // can render it without any changes to the shared component
        const shaped: CheckoutPlan = {
          id: invoice.id,
          name: invoice.plan?.name ?? "Subscription",
          description: invoice.description ?? undefined,
          price: invoice.amount,
          interval: invoice.plan?.interval ?? null,
          features: invoice.plan?.features ?? [],
          invoiceId: invoice.id, // tells SharedCheckout to use invoiceId directly
        };

        setPlan(shaped);
      } catch {
        setError("Failed to load invoice. Please go back and try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center font-[Nunito,sans-serif]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-100 border-t-[#0D9488] rounded-full animate-spin" />
          <p className="text-sm text-[#9CA3AF]">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center font-[Nunito,sans-serif] px-4">
        <div className="text-center space-y-3 max-w-sm">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="text-base font-bold text-[#1F2937]">Could not load invoice</p>
          <p className="text-sm text-[#9CA3AF]">{error}</p>
          <Button variant="outline" onClick={() => router.back()}>Go back</Button>
        </div>
      </div>
    );
  }

  return (
    <SharedCheckout
      mode="organization"
      plan={plan}
      backHref="/organization/access"
      backLabel="Back to My Access"
    />
  );
}