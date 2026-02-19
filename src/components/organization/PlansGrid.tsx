"use client";

import { MoreVertical, Edit, Trash2, Users, Eye, PowerOff, Power } from "lucide-react";
import { useState } from "react";
import { SubscriptionPlan } from "../../types/organization";
import { Button } from "@/components/ui/button";

interface PlansGridProps {
  plans: SubscriptionPlan[];
  onEditPlan: (plan: SubscriptionPlan) => void;
  onTogglePlanStatus: (planId: string) => void;
  onDeletePlan: (planId: string) => void;
  onViewMembers: (plan: SubscriptionPlan) => void;
}

export function PlansGrid({
  plans,
  onEditPlan,
  onTogglePlanStatus,
  onDeletePlan,
  onViewMembers,
}: PlansGridProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (plans.length === 0) {
    return (
      <div
        className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <div className="mx-auto w-16 h-16 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-[#0D9488]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-[#1F2937] mb-1">No plans yet</h3>
        <p className="text-sm text-[#9CA3AF]">Get started by creating your first subscription plan</p>
      </div>
    );
  }

  return (
    <div
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="relative rounded-xl border border-gray-100 bg-white shadow-sm p-6 transition-all duration-200 hover:shadow-md hover:border-[#0D9488]/30 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-2">
              <h3 className="text-base font-bold text-[#1F2937]">{plan.name}</h3>
              {plan.description && (
                <p className="mt-1 text-sm text-[#9CA3AF] line-clamp-2">{plan.description}</p>
              )}
            </div>

            {/* Kebab menu */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setOpenMenuId(openMenuId === plan.id ? null : plan.id)}
                className="rounded-lg p-1.5 hover:bg-[#F9FAFB] transition-colors"
              >
                <MoreVertical className="h-4 w-4 text-[#9CA3AF]" />
              </button>

              {openMenuId === plan.id && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                  <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white shadow-lg border border-gray-100 z-20 overflow-hidden">
                    <div className="py-1">
                      <button
                        onClick={() => { onEditPlan(plan); setOpenMenuId(null); }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#1F2937] hover:bg-[#F9FAFB] transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5 text-[#9CA3AF]" />
                        Edit Plan
                      </button>
                      <button
                        onClick={() => { onTogglePlanStatus(plan.id); setOpenMenuId(null); }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#1F2937] hover:bg-[#F9FAFB] transition-colors"
                      >
                        {plan.isActive
                          ? <PowerOff className="h-3.5 w-3.5 text-[#9CA3AF]" />
                          : <Power className="h-3.5 w-3.5 text-[#9CA3AF]" />
                        }
                        {plan.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => { onDeletePlan(plan.id); setOpenMenuId(null); }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-[#1F2937]">
                ₦{plan.price != null ? plan.price.toLocaleString() : "0"}
              </span>
              <span className="text-sm text-[#9CA3AF]">/{plan.duration || "month"}</span>
            </div>
          </div>

          {/* Features */}
          {plan.features && plan.features.length > 0 && (
            <div className="mb-4 space-y-2 flex-1">
              {plan.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <svg className="h-4 w-4 text-[#0D9488] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-[#1F2937]">
                    {typeof feature === "string" ? feature : feature.name}
                  </span>
                </div>
              ))}
              {plan.features.length > 3 && (
                <p className="text-xs text-[#9CA3AF] ml-6">
                  +{plan.features.length - 3} more features
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-sm text-[#9CA3AF]">
                <Users className="h-3.5 w-3.5" />
                <span className="font-semibold text-[#1F2937]">{plan.subscriptions?.length || 0}</span>
                <span>members</span>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  plan.isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-gray-100 text-[#9CA3AF]"
                }`}
              >
                {plan.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onViewMembers(plan)}
              className="w-full"
            >
              View Members
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}