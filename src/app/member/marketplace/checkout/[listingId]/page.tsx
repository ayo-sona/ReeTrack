"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SharedCheckout } from "@/components/shared/checkout";

function MarketplaceCheckoutInner() {
  const params = useParams();
  const searchParams = useSearchParams();

  const listingId = params.listingId as string;
  const title = searchParams.get("title") ?? "Listing";
  const price = parseFloat(searchParams.get("price") ?? "0");
  const description = searchParams.get("desc") ?? undefined;
  const backHref = searchParams.get("backHref") ?? "/member/explore";
  const backLabel = searchParams.get("backLabel") ?? "Back";

  return (
    <SharedCheckout
      mode="marketplace"
      plan={{
        id: listingId,
        name: title,
        description,
        price,
        interval: null,
      }}
      backHref={backHref}
      backLabel={backLabel}
    />
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-100 border-t-[#0D9488] rounded-full animate-spin" />
        </div>
      }
    >
      <MarketplaceCheckoutInner />
    </Suspense>
  );
}
