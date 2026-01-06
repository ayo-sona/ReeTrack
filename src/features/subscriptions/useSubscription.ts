import { useState, useEffect } from 'react';
import { Subscription, PlanId, BillingCycle } from '../../types/subscription';
import { subscriptionAPI } from './subscriptionApi';

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      const data = await subscriptionAPI.getCurrent();
      setSubscription(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const changePlan = async (planId: PlanId, billingCycle: BillingCycle) => {
    try {
      await subscriptionAPI.changePlan(planId, billingCycle);
      await fetchSubscription();
    } catch (err) {
      throw err;
    }
  };

  const cancelSubscription = async () => {
    try {
      await subscriptionAPI.cancel();
      await fetchSubscription();
    } catch (err) {
      throw err;
    }
  };

  const reactivateSubscription = async () => {
    try {
      await subscriptionAPI.reactivate();
      await fetchSubscription();
    } catch (err) {
      throw err;
    }
  };

  return {
    subscription,
    isLoading,
    error,
    refetch: fetchSubscription,
    changePlan,
    cancelSubscription,
    reactivateSubscription,
  };
}