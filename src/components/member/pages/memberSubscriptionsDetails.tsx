'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, CreditCard, Pause, Play, X, TrendingUp, QrCode, Check } from 'lucide-react';
import { 
  useSubscription, 
  usePauseSubscription, 
  useResumeSubscription, 
  useCancelSubscription 
} from '@/hooks/memberHook/useMember';
import Link from 'next/link';

export default function SubscriptionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const subscriptionId = params.id as string;

  const { data: subscription, isLoading } = useSubscription(subscriptionId);
  const pauseSub = usePauseSubscription();
  const resumeSub = useResumeSubscription();
  const cancelSub = useCancelSubscription();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handlePause = async () => {
    try {
      await pauseSub.mutateAsync(subscriptionId);
    } catch (error) {
      console.error('Failed to pause subscription:', error);
    }
  };

  const handleResume = async () => {
    try {
      await resumeSub.mutateAsync(subscriptionId);
    } catch (error) {
      console.error('Failed to resume subscription:', error);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelSub.mutateAsync(subscriptionId);
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
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
      case 'active': return 'bg-green-100 text-green-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      case 'expired': return 'bg-red-100 text-red-700';
      case 'canceled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
                {subscription.organizationName.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{subscription.organizationName}</h1>
                <p className="text-gray-600">{subscription.planName}</p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold text-gray-900">₦{subscription.planPrice.toLocaleString()}</span>
            <span className="text-xl text-gray-600">/{subscription.planInterval}</span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50 rounded-lg p-4">
              <Calendar className="w-5 h-5 text-emerald-600 mb-2" />
              <p className="text-sm text-gray-600">Started</p>
              <p className="font-semibold text-gray-900">
                {new Date(subscription.currentPeriodStart).toLocaleDateString()}
              </p>
            </div>

            {subscription.nextBillingDate && (
              <div className="bg-orange-50 rounded-lg p-4">
                <CreditCard className="w-5 h-5 text-orange-600 mb-2" />
                <p className="text-sm text-gray-600">Next Billing</p>
                <p className="font-semibold text-gray-900">
                  {new Date(subscription.nextBillingDate).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="bg-purple-50 rounded-lg p-4">
              <TrendingUp className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-sm text-gray-600">Auto-Renew</p>
              <p className="font-semibold text-gray-900">
                {subscription.autoRenew ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">What&apos;s Included</h2>
          <div className="space-y-3">
            {subscription.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Manage Subscription</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Check In */}
            {subscription.status === 'active' && (
              <Link href={`/member/check-in?subscription=${subscription.id}`}>
                <button className="w-full p-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Check In Now
                </button>
              </Link>
            )}

            {/* Pause/Resume */}
            {subscription.status === 'active' && (
              <button
                onClick={handlePause}
                disabled={pauseSub.isPending}
                className="w-full p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Pause className="w-5 h-5" />
                {pauseSub.isPending ? 'Pausing...' : 'Pause Subscription'}
              </button>
            )}

            {subscription.status === 'paused' && (
              <button
                onClick={handleResume}
                disabled={resumeSub.isPending}
                className="w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Play className="w-5 h-5" />
                {resumeSub.isPending ? 'Resuming...' : 'Resume Subscription'}
              </button>
            )}

            {/* Upgrade */}
            {subscription.status === 'active' && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Upgrade Plan
              </button>
            )}

            {/* Cancel */}
            {(subscription.status === 'active' || subscription.status === 'paused') && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="w-full p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel Subscription
              </button>
            )}
          </div>

          {subscription.cancelAtPeriodEnd && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ This subscription will be canceled at the end of the current billing period ({new Date(subscription.currentPeriodEnd).toLocaleDateString()})
              </p>
            </div>
          )}
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Subscription?</h3>
              <p className="text-gray-600 mb-6">
                Your subscription will remain active until the end of your current billing period. You won&apos;t be charged again.
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
                  {cancelSub.isPending ? 'Canceling...' : 'Yes, Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}