import { Currency, PaymentGateway } from './common';
import { PlanId, BillingCycle } from './subscription';

export type MemberStatus = 'active' | 'inactive' | 'expired';
export type PaymentMethod = 'card' | 'bank_transfer' | 'ussd' | 'cash';
export type PaymentStatus = 'success' | 'pending' | 'failed' | 'refunded';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  subscriptionPlan: PlanId;
  status: MemberStatus;
  subscriptionStartDate: string;
  subscriptionExpiryDate: string;
  lastPaymentDate?: string;
  totalPaid: number;
  joinedDate: string;
  address?: string;
  emergencyContact?: string;
  gateway?: PaymentGateway;
  billingCycle?: BillingCycle;
}

export interface MemberPaymentHistory {
  id: string;
  memberId: string;
  date: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  method: PaymentMethod;
  reference: string;
  description: string;
  gateway: PaymentGateway;
}

export interface MemberFilters {
  status: MemberStatus | 'all';
  plan: PlanId | 'all';
  search: string;
}

export interface AccessGrant {
  memberId: string;
  duration: number;
  durationType: 'days' | 'months';
  expiryDate: string;
  reason: string;
  grantedBy: string;
  grantedAt: string;
}

export interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newThisMonth: number;
  expiringThisMonth: number;
}