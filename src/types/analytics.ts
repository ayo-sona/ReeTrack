import { Currency } from './common';

export interface AnalyticsCard {
  title: string;
  value: number | string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  prefix?: string;
  suffix?: string;
}

export interface MembersGrowthData {
  month: string;
  newMembers: number;
  totalMembers: number;
  year?: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  previousYear?: number;
  currency: Currency;
}

export interface SubscriptionDistribution {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface PlanDistribution {
  plan: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface DashboardAnalytics {
  memberStats: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
  };
  revenueStats: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  growthData: MembersGrowthData[];
  revenueData: RevenueData[];
  subscriptionDistribution: SubscriptionDistribution[];
  planDistribution: PlanDistribution[];
}