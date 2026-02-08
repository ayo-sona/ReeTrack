import {
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Eye,
  PowerOff,
  Power,
} from "lucide-react";
import { useState } from "react";
import { SubscriptionPlan } from "../../types/organization";

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
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No plans yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Get started by creating your first subscription plan
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="group relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 transition-all hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {plan.description}
              </p>
            </div>

            {/* Menu */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenMenuId(openMenuId === plan.id ? null : plan.id)
                }
                className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </button>

              {openMenuId === plan.id && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setOpenMenuId(null)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-20 border border-gray-200 dark:border-gray-700">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          onEditPlan(plan);
                          setOpenMenuId(null);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Plan
                      </button>
                      <button
                        onClick={() => {
                          onTogglePlanStatus(plan.id);
                          setOpenMenuId(null);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {plan.isActive ? (
                          <PowerOff className="h-4 w-4" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                        {plan.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => {
                          onDeletePlan(plan.id);
                          setOpenMenuId(null);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
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
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                ₦{plan.price != null ? plan.price.toLocaleString() : '0'}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                /{plan.duration || 'month'}
              </span>
            </div>
          </div>

          {/* Features */}
          {plan.features && plan.features.length > 0 && (
            <div className="mb-4 space-y-2">
              {plan.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <svg
                    className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {typeof feature === "string" ? feature : feature.name}
                  </span>
                </div>
              ))}
              {plan.features.length > 3 && (
                <p className="text-xs text-gray-500 dark:text-gray-500 ml-7">
                  +{plan.features.length - 3} more features
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {plan.subscriptions?.length || 0} members
                </span>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  plan.isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {plan.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* View Members Button */}
            <button
              onClick={() => onViewMembers(plan)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-medium text-sm"
            >
              <Eye className="h-4 w-4" />
              View Members
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}