"use client";

import { useState, useEffect } from "react";
import { Search, CreditCard, X, QrCode, CheckCircle } from "lucide-react";
import { useAllSubscriptions } from "@/hooks/memberHook/useMember";
import Link from "next/link";

export default function SubscriptionsPage() {
  const { data: subscriptions, isLoading, error } = useAllSubscriptions();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "expired" | "canceled" | "pending"
  >("all");

  // 🔍 DEBUG: Log the actual data structure
  useEffect(() => {
    console.log("=== SUBSCRIPTIONS DEBUG ===");
    console.log("Raw subscriptions:", subscriptions);
    console.log("Is Array:", Array.isArray(subscriptions));
    console.log("Length:", subscriptions?.length);
    if (subscriptions && subscriptions.length > 0) {
      console.log("First subscription:", subscriptions[0]);
      console.log("Has plan?:", subscriptions[0]?.plan);
      console.log("Plan structure:", JSON.stringify(subscriptions[0]?.plan, null, 2));
    }
  }, [subscriptions]);

  // Filter subscriptions with comprehensive null checks
  const filteredSubscriptions = subscriptions?.filter((sub) => {
    // 🔍 DEBUG: Log each subscription during filtering
    console.log("Filtering sub:", { 
      id: sub?.id, 
      hasPlan: !!sub?.plan,
      planName: sub?.plan?.name,
      status: sub?.status 
    });

    // ✅ Safety check: ensure plan exists
    if (!sub?.plan) {
      console.warn("⚠️ Subscription missing plan:", sub);
      return false;
    }
    
    const planName = sub.plan.name || "";
    const planDescription = sub.plan.description || "";
    
    const matchesSearch =
      planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      planDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort by expiry date (soonest first)
  const sortedSubscriptions = filteredSubscriptions
    ? [...filteredSubscriptions].sort(
        (a, b) =>
          new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime()
      )
    : [];

  // Check if subscription expires within 7 days
  const isExpiringSoon = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "expired":
        return "bg-red-100 text-red-700";
      case "canceled":
        return "bg-gray-100 text-gray-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "canceled":
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Show error state
  if (error) {
    console.error("❌ Subscription error:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-red-800 font-bold mb-2">Error Loading Subscriptions</h3>
            <p className="text-red-600 mb-4">{error.message}</p>
            <details className="text-sm text-red-700">
              <summary className="cursor-pointer font-medium">Error Details</summary>
              <pre className="mt-2 p-2 bg-red-100 rounded overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
          <p className="text-gray-600 mt-1">
            Manage all your active and past subscriptions
          </p>
        </div>

        {/* 🔍 DEBUG INFO - Remove this in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-medium text-blue-900 mb-2">Debug Info:</p>
            <ul className="text-blue-800 space-y-1">
              <li>• Subscriptions count: {subscriptions?.length || 0}</li>
              <li>• Filtered count: {filteredSubscriptions?.length || 0}</li>
              <li>• Loading: {isLoading ? 'Yes' : 'No'}</li>
              <li>• Has error: {error ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {["all", "active", "pending", "expired", "canceled"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setStatusFilter(
                        status as
                          | "all"
                          | "active"
                          | "expired"
                          | "canceled"
                          | "pending"
                      )
                    }
                    className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                      statusFilter === status
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Subscriptions List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-white rounded-xl border border-gray-100"></div>
              </div>
            ))}
          </div>
        ) : sortedSubscriptions && sortedSubscriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedSubscriptions.map((sub) => {
              // ✅ Additional safety check
              if (!sub?.plan) {
                console.warn("⚠️ Skipping subscription without plan:", sub);
                return null;
              }

              const expiringSoon =
                sub.status === "active" && isExpiringSoon(sub.expires_at);

              return (
                <Link key={sub.id} href={`/member/subscriptions/${sub.id}`}>
                  <div
                    className={`bg-white rounded-xl p-6 shadow-sm border transition-all cursor-pointer ${
                      expiringSoon
                        ? "border-orange-300 bg-orange-50 hover:bg-orange-100"
                        : "border-gray-100 hover:border-emerald-300 hover:shadow-md"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                          {sub.plan.name?.charAt(0) || "S"}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {sub.plan.name || "Subscription"}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {sub.plan.description || "No description"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                          sub.status
                        )}`}
                      >
                        {getStatusIcon(sub.status)}
                        {sub.status.charAt(0).toUpperCase() +
                          sub.status.slice(1)}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        ₦{sub.plan.price?.toLocaleString() || "0"}
                      </span>
                      <span className="text-gray-600">/{sub.plan.interval || "month"}</span>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {sub.plan.features?.features?.slice(0, 3).map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                          {feature}
                        </div>
                      )) || (
                        <p className="text-sm text-gray-500">No features listed</p>
                      )}
                      {(sub.plan.features?.features?.length || 0) > 3 && (
                        <p className="text-sm text-gray-500">
                          +{sub.plan.features.features.length - 3} more features
                        </p>
                      )}
                    </div>

                    {/* Expiry Info */}
                    {sub.status === "active" && (
                      <div className="pt-4 border-t border-gray-100">
                        <p
                          className={`text-sm ${
                            expiringSoon
                              ? "text-orange-600 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {expiringSoon && "⚠️ "}
                          {sub.auto_renew ? "Renews" : "Expires"}:{" "}
                          <span className="font-medium">
                            {new Date(sub.expires_at).toLocaleDateString()}
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Canceled Info */}
                    {sub.status === "canceled" && sub.canceled_at && (
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          Canceled on:{" "}
                          <span className="font-medium text-gray-900">
                            {new Date(sub.canceled_at).toLocaleDateString()}
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Check-in Button for Active Subs - 🔜 Placeholder */}
                    {sub.status === "active" && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // Navigate to check-in
                        }}
                        className="mt-4 w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <QrCode className="w-4 h-4" />
                        Check In
                      </button>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchQuery || statusFilter !== "all"
                ? "No subscriptions found"
                : "No subscriptions yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Subscribe to a plan to get started"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Browse Plans
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}