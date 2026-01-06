'use client';

import React, { useState } from 'react';
import { useSubscription } from '../../features/subscriptions/useSubscription';
import { usePayment } from '../../features/payments/usePayment';
import { SubscriptionCard } from '../../components/dashboard/subscriptionCard';
import { UsageMetrics } from '../../components/dashboard/usageMetrics';
import { PaymentHistoryTable } from '../../components/dashboard/paymentHistoryTable';
import { PlanComparison } from '../../components/dashboard/planComparison';
import { SettingsModal } from '../../components/dashboard/settingsModal';
import { Button } from '../../components/ui/Button';
import { SkeletonCard, SkeletonTable } from '../../components/ui/Skeleton';
import { PlanId, BillingCycle } from '../../types/subscription';

export default function DashboardPage() {
  const { subscription, isLoading: subscriptionLoading, changePlan, cancelSubscription } = useSubscription();
  const { payments, isLoading: paymentsLoading, downloadInvoice, exportHistory } = usePayment();
  
  const [showPlanComparison, setShowPlanComparison] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleChangePlan = async (planId: PlanId, billingCycle: BillingCycle) => {
    await changePlan(planId, billingCycle);
  };

  const handleCancelSubscription = async () => {
    if (confirm('Are you sure you want to cancel your subscription?')) {
      await cancelSubscription();
    }
  };

  if (subscriptionLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonTable />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          No Active Subscription
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Get started by selecting a plan
        </p>
        <Button onClick={() => setShowPlanComparison(true)}>
          View Plans
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your subscription and view analytics
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowSettings(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </Button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubscriptionCard
          subscription={subscription}
          onUpgrade={() => setShowPlanComparison(true)}
          onCancel={handleCancelSubscription}
        />
        <UsageMetrics subscription={subscription} />
      </div>

      {/* Payment History */}
      <PaymentHistoryTable
        payments={payments}
        onDownloadInvoice={downloadInvoice}
        onExport={exportHistory}
      />

      {/* Modals */}
      <PlanComparison
        isOpen={showPlanComparison}
        onClose={() => setShowPlanComparison(false)}
        currentPlanId={subscription.planId}
        onSelectPlan={handleChangePlan}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}