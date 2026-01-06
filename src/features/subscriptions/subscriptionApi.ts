import { apiClient } from '../../lib/apiClient';
import { Subscription } from '../../types/subscription';
import { PlanId, BillingCycle } from '../../types/subscription';
import { MOCK_SUBSCRIPTION } from '../../lib/mockData';

export const subscriptionAPI = {
  async getCurrent(): Promise<Subscription> {
    // TODO: Replace with actual API call
    // const response = await apiClient.get<Subscription>('/subscriptions/current');
    // return response.data!;
    
    // Mock for now
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_SUBSCRIPTION), 500);
    });
  },

  async changePlan(planId: PlanId, billingCycle: BillingCycle): Promise<void> {
    // TODO: Replace with actual API call
    // await apiClient.post('/subscriptions/change-plan', { planId, billingCycle });
    
    // Mock for now
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
  },

  async cancel(): Promise<void> {
    // TODO: Replace with actual API call
    // await apiClient.post('/subscriptions/cancel');
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
  },

  async reactivate(): Promise<void> {
    // TODO: Replace with actual API call
    // await apiClient.post('/subscriptions/reactivate');
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
  },
};