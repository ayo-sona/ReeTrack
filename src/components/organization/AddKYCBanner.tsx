"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert, X } from "lucide-react";
import { useState } from "react";
// import { useKycStatus } from "@/hooks/useKYC";

export function KycBanner() {
  // const { isVerified, isLoading } = useKycStatus();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  // if (isLoading || isVerified || dismissed) return null;
  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center gap-3 font-[Nunito,sans-serif]">
      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
        <ShieldAlert className="w-4 h-4 text-amber-600" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-amber-800">
          Verify your identity to unlock member management & payments
        </p>
        <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
          You won't be able to add members or collect payments until your BVN is
          verified.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => router.push("/organization/kyc")}
          className="text-xs font-extrabold text-amber-700 hover:text-amber-900 transition-colors whitespace-nowrap bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg"
        >
          Verify now →
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-400 hover:text-amber-600 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
