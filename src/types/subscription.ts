import type { Currency } from './common';

export type PlanId = 'starter' | 'growth' | 'pro' | 'enterprise';
export type SubscriptionStatus = 
  | 'active' 
  | 'trial' 
  | 'past_due' 
  | 'cancelled' 
  | 'expired' 
  | 'paused';

export type BillingCycle = 'monthly' | 'annually';

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: number;
}

export interface Plan {
  id: PlanId;
  name: string;
  members: number;
  price: number;
  pricePerMember: number;
  currency: Currency;
  billingCycle: BillingCycle;
  features: PlanFeature[];
  limits: {
    members: number;
    apiAccess: boolean;
    smsNotifications: boolean;
    whatsappNotifications: boolean;
    emailNotifications: boolean;
    exportFeatures: boolean;
    prioritySupport: boolean;
  };
  popular?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: PlanId;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  memberCount: number;
  usage: {
    members: number;
    smsUsed: number;
    emailsUsed: number;
    whatsappUsed: number;
  };
}