import type { Currency, PaymentGateway } from './common';
import type { PlanId, BillingCycle } from './subscription';

export type PaymentStatus = 'succeeded' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'card' | 'bank_transfer' | 'ussd';

export interface Payment {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  gateway: PaymentGateway;
  method: PaymentMethod;
  description: string;
  invoiceUrl?: string;
  createdAt: string;
  paidAt?: string;
}

export interface PaymentIntent {
  gateway: PaymentGateway;
  amount: number;
  currency: Currency;
  planId: PlanId;
  billingCycle: BillingCycle;
}