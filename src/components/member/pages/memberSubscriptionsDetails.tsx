"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  X,
  QrCode,
  Check,
  RefreshCw,
} from "lucide-react";
import {
  useSubscription,
  useCancelSubscription,
  useRenewSubscription,
} from "@/hooks/memberHook/useMember";
import Link from "next/link";

export default function SubscriptionDetailsPage() {
  const params = useParams();
  // const router = useRouter();
  const subscriptionId = params.id as string;

  const { data: subscription, isLoading } = useSubscription(subscriptionId);
  const cancelSub = useCancelSubscription();
  const renewSub = useRenewSubscription();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancel = async () => {
    try {
      await cancelSub.mutateAsync(subscriptionId);
      setShowCancelConfirm(false);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    }
  };

  const handleRenew = async () => {
    try {
      await renewSub.mutateAsync(subscriptionId);
    } catch (error) {
      console.error("Failed to renew subscription:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
          <div className="h-48 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-gray-600">Subscription not found</p>
          <Link href="/member/subscriptions">
            <button className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              Back to Subscriptions
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "expired":
        return "bg-red-100 text-red-700";
      case "canceled":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Check if subscription expires within 7 days
  const isExpiringSoon = () => {
    const now = new Date();
    const expiry = new Date(subscription.expires_at);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  // ✅ FIX: Extract nested features array
  const featuresArray = subscription.plan.features?.features || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href="/member/subscriptions">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Subscriptions
          </button>
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                {subscription.plan.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {subscription.plan.name}
                </h1>
                <p className="text-gray-600">{subscription.plan.description}</p>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                subscription.status
              )}`}
            >
              {subscription.status.charAt(0).toUpperCase() +
                subscription.status.slice(1)}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold text-gray-900">
              ₦{subscription.plan.price.toLocaleString()}
            </span>
            <span className="text-xl text-gray-600">
              /{subscription.plan.interval}
            </span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50 rounded-lg p-4">
              <Calendar className="w-5 h-5 text-emerald-600 mb-2" />
              <p className="text-sm text-gray-600">Started</p>
              <p className="font-semibold text-gray-900">
                {new Date(subscription.started_at).toLocaleDateString()}
              </p>
            </div>

            <div
              className={`rounded-lg p-4 ${
                isExpiringSoon() && subscription.status === "active"
                  ? "bg-orange-50"
                  : "bg-blue-50"
              }`}
            >
              <CreditCard
                className={`w-5 h-5 mb-2 ${
                  isExpiringSoon() && subscription.status === "active"
                    ? "text-orange-600"
                    : "text-blue-600"
                }`}
              />
              <p className="text-sm text-gray-600">
                {subscription.auto_renew ? "Renews" : "Expires"}
              </p>
              <p
                className={`font-semibold ${
                  isExpiringSoon() && subscription.status === "active"
                    ? "text-orange-600"
                    : "text-gray-900"
                }`}
              >
                {new Date(subscription.expires_at).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <RefreshCw className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-sm text-gray-600">Auto-Renew</p>
              <p className="font-semibold text-gray-900">
                {subscription.auto_renew ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
        </div>

        {/* Features - ✅ FIXED: Use featuresArray */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            What&apos;s Included
          </h2>
          {featuresArray.length > 0 ? (
            <div className="space-y-3">
              {featuresArray.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No features listed</p>
          )}
        </div>

        {/* Warning - Expiring Soon */}
        {subscription.status === "active" && isExpiringSoon() && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-900 mb-1">
                  Subscription Expiring Soon
                </h3>
                <p className="text-sm text-orange-700">
                  Your subscription expires on{" "}
                  {new Date(subscription.expires_at).toLocaleDateString()}.
                  {!subscription.auto_renew &&
                    " Renew now to continue your access."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Canceled Warning */}
        {subscription.status === "canceled" && subscription.canceled_at && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <X className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Subscription Canceled
                </h3>
                <p className="text-sm text-gray-700">
                  This subscription was canceled on{" "}
                  {new Date(subscription.canceled_at).toLocaleDateString()}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Manage Subscription
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Check In - 🔜 Placeholder */}
            {subscription.status === "active" && (
              <Link href={`/member/check-in?subscription=${subscription.id}`}>
                <button className="w-full p-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Check In Now
                </button>
              </Link>
            )}

            {/* Renew */}
            {(subscription.status === "expired" ||
              subscription.status === "canceled" ||
              (subscription.status === "active" && !subscription.auto_renew)) && (
              <button
                onClick={handleRenew}
                disabled={renewSub.isPending}
                className="w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className="w-5 h-5" />
                {renewSub.isPending ? "Renewing..." : "Renew Subscription"}
              </button>
            )}

            {/* Cancel */}
            {subscription.status === "active" && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="w-full p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel Subscription
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Cancel Subscription?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this subscription? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelSub.isPending}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {cancelSub.isPending ? "Canceling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}