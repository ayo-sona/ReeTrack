"use client";

import { useParams } from "next/navigation";
import { useAvailablePlans } from "@/hooks/memberHook/useCommunity";
import { useProfile } from "@/hooks/memberHook/useMember";
import { SharedCheckout } from "@/components/shared/checkout";
import { useSearchParams } from "next/navigation";

export default function MemberCheckoutPage() {
  const params = useParams();
  const planId = params.planId as string;
  const searchParams = useSearchParams();
  const invoiceStatus = searchParams.get("invoice");
  const invoiceId = searchParams.get("id");

  const { data: allPlans, isLoading: plansLoading } = useAvailablePlans();
  // const { data: profile } = useProfile();

  const plan = allPlans?.find((p) => p.id === planId);

  if (plansLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center font-[Nunito,sans-serif]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-100 border-t-[#0D9488] rounded-full animate-spin" />
          <p className="text-sm text-[#9CA3AF]">Loading plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center font-[Nunito,sans-serif] px-4">
        <div className="text-center space-y-2 max-w-sm">
          <p className="text-base font-bold text-[#1F2937]">Plan not found</p>
          <p className="text-sm text-[#9CA3AF]">
            This plan doesn&apos;t exist or is no longer available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SharedCheckout
      mode="member"
      plan={plan}
      backHref={`/member/communities/${plan.organization_id}`}
      backLabel="Back to Plans"
      // userEmail={profile?.email}
      failedInvoice={invoiceStatus === "failed" ? true : false}
      failedInvoiceId={invoiceId || ""}
    />
  );
}
