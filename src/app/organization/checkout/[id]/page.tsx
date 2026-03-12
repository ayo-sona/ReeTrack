"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { SharedCheckout, CheckoutPlan } from "@/components/shared/checkout";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function OrganizationCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;
  const searchParams = useSearchParams();
  const invoiceStatus = searchParams.get("invoice");
  const invoiceId = searchParams.get("id");

  const [plan, setPlan] = useState<CheckoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!planId) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get(`/plans/organization/${planId}`);
        const p = data.data;

        const shaped: CheckoutPlan = {
          id: p.id,
          name: p.name,
          description: p.description ?? undefined,
          price: p.price ?? p.amount,
          interval: p.interval ?? null,
          features: p.features ?? [],
        };

        setPlan(shaped);
      } catch {
        setError("Failed to load plan. Please go back and try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [planId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center font-[Nunito,sans-serif]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-100 border-t-[#0D9488] rounded-full animate-spin" />
          <p className="text-sm text-[#9CA3AF]">Loading plan...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center font-[Nunito,sans-serif] px-4">
        <div className="text-center space-y-3 max-w-sm">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="text-base font-bold text-[#1F2937]">
            Could not load plan
          </p>
          <p className="text-sm text-[#9CA3AF]">{error}</p>
          <Button variant="outline" onClick={() => router.back()}>
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SharedCheckout
      mode="organization"
      plan={plan}
      backHref="/organization/access"
      backLabel="Back to plans"
      failedInvoice={invoiceStatus === "failed" ? true : false}
      failedInvoiceId={invoiceId || ""}
    />
  );
}
