"use client";

import { Building2 } from "lucide-react";
import Link from "next/link";
import { useCommunity } from "@/hooks/memberHook/useCommunity";

export default function MyCommunityPage() {
  const { data: communityData, isLoading } = useCommunity();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!communityData || !communityData.organization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Community Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't joined any community yet. Contact an organization to get started!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { organization, subscriptions } = communityData;

  // For now, we only show the primary organization
  // TODO: Backend needs endpoint to return all organizations
  const organizations = [
    {
      organization: organization,
      subscriptions: subscriptions,
      active_subscription_count: subscriptions.filter((s) => s.status === "active").length,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Community</h1>
          <p className="text-gray-600 mt-1">
            Organizations you're subscribed to
          </p>
        </div>

        {/* Organizations Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((item) => (
            <Link
              key={item.organization.id}
              href={`/member/organizations/${item.organization.id}`}
            >
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:shadow-xl hover:border-emerald-300 transition-all duration-200 cursor-pointer group h-full">
                {/* Organization Logo/Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                    {item.organization.name.charAt(0).toUpperCase()}
                  </div>
                  {item.active_subscription_count > 0 && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                      {item.active_subscription_count} Active
                    </span>
                  )}
                </div>

                {/* Organization Info */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {item.organization.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {item.organization.address}
                </p>

                {/* Contact Info */}
                <div className="space-y-2 text-sm text-gray-500">
                  <p className="truncate">{item.organization.email}</p>
                  <p>{item.organization.phone}</p>
                </div>

                {/* Subscriptions Info */}
                {item.subscriptions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Your Subscriptions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.subscriptions.slice(0, 2).map((sub) => (
                        <span
                          key={sub.id}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs"
                        >
                          {sub.plan.name}
                        </span>
                      ))}
                      {item.subscriptions.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs">
                          +{item.subscriptions.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* View Details Arrow */}
                <div className="mt-6 flex items-center justify-end text-emerald-600 font-medium text-sm group-hover:gap-2 transition-all">
                  <span>View Details</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}