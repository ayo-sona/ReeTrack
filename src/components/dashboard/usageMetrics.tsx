'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/progressBar';
import { Subscription } from '../../types/subscription';
import { PRICING_PLANS } from '../../lib/constants';

interface UsageMetricsProps {
  subscription: Subscription;
}

export function UsageMetrics({ subscription }: UsageMetricsProps) {
  const plan = PRICING_PLANS[subscription.planId];
  const memberPercentage = (subscription.usage.members / plan.members) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Metrics</CardTitle>
        <CardDescription>Track your plan usage</CardDescription>
      </CardHeader>

      <div className="space-y-6">
        <div>
          <ProgressBar
            value={subscription.usage.members}
            max={plan.members}
            label="Members"
          />
          {memberPercentage >= 90 && (
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
              ⚠️ You&apos;re approaching your member limit. Consider upgrading.
            </p>
          )}
        </div>

        {plan.limits.smsNotifications && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                SMS Sent
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {subscription.usage.smsUsed.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {plan.limits.emailNotifications && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Emails Sent
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {subscription.usage.emailsUsed.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {plan.limits.whatsappNotifications && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                WhatsApp Messages
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {subscription.usage.whatsappUsed.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}