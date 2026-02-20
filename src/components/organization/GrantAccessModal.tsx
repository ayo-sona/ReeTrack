"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Member } from "../../types/organization";
import { GrantAccessData } from "@/app/organization/members/[id]/page";
import { Button } from "@/components/ui/button";

interface GrantAccessModalProps {
  member: Member;
  onClose: () => void;
  onGrant: (data: GrantAccessData) => void;
  currentSubscription?: any;
}

export function GrantAccessModal({
  member,
  onClose,
  onGrant,
  currentSubscription,
}: GrantAccessModalProps) {
  const [reason, setReason] = useState("");

  const memberName = `${member.user.first_name} ${member.user.last_name}`.trim();
  const memberEmail = member.user.email;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGrant({
      memberId: member.id,
      planId: currentSubscription?.plan?.id || "",
      subscriptionId: currentSubscription?.id || "",
      intervalCount: currentSubscription?.plan?.interval || 30,
      interval: currentSubscription?.plan?.interval || "days",
      metadata: {
        grantedReason: reason,
        grantedAt: new Date().toISOString(),
      },
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-xl border border-gray-100 bg-white shadow-xl max-h-[90vh] flex flex-col"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          {/* Header */}
          <div className="border-b border-gray-100 px-6 py-5 flex-shrink-0">
            <h2 className="text-lg font-bold text-[#1F2937]">Grant Subscription Access</h2>
            <p className="text-sm text-[#9CA3AF] mt-0.5">
              Manually extend access to a member
            </p>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1">
            <form onSubmit={handleSubmit} id="grant-form" className="p-6 space-y-4">
              {/* Member info */}
              <div className="rounded-lg bg-[#F9FAFB] border border-gray-100 p-4">
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">
                  Granting access to
                </p>
                <p className="text-sm font-bold text-[#1F2937]">{memberName}</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">{memberEmail}</p>

                {currentSubscription && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">
                      Current Plan
                    </p>
                    <p className="text-sm font-semibold text-[#1F2937]">
                      {currentSubscription.plan.name}
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      Expires {new Date(currentSubscription.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Conflict warning */}
              {currentSubscription && (
                <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    This member already has an active subscription. Granting access may override or conflict with the existing one.
                  </p>
                </div>
              )}

              {/* Plan display */}
              {currentSubscription?.plan && (
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">
                    Plan
                  </label>
                  <div className="rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#1F2937]">
                    {currentSubscription.plan.name} — ₦{currentSubscription.plan.price?.toLocaleString()}/{currentSubscription.plan.interval}
                  </div>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">
                  Reason <span className="text-[#F06543]">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  required
                  placeholder="e.g., Complimentary access for loyalty..."
                  className="w-full rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all resize-none"
                />
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" form="grant-form" variant="secondary" size="sm">
              Grant Access
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}