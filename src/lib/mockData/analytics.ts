import {
    MembersGrowthData,
    RevenueData,
    SubscriptionDistribution,
    PlanDistribution,
  } from '../../types/analytics';
  
  export const MOCK_GROWTH_DATA: MembersGrowthData[] = [
    { month: 'Jan', newMembers: 12, totalMembers: 45, year: 2024 },
    { month: 'Feb', newMembers: 18, totalMembers: 63, year: 2024 },
    { month: 'Mar', newMembers: 15, totalMembers: 78, year: 2024 },
    { month: 'Apr', newMembers: 22, totalMembers: 100, year: 2024 },
    { month: 'May', newMembers: 28, totalMembers: 128, year: 2024 },
    { month: 'Jun', newMembers: 25, totalMembers: 153, year: 2024 },
    { month: 'Jul', newMembers: 30, totalMembers: 183, year: 2024 },
    { month: 'Aug', newMembers: 35, totalMembers: 218, year: 2024 },
    { month: 'Sep', newMembers: 32, totalMembers: 250, year: 2024 },
    { month: 'Oct', newMembers: 40, totalMembers: 290, year: 2024 },
    { month: 'Nov', newMembers: 38, totalMembers: 328, year: 2024 },
    { month: 'Dec', newMembers: 45, totalMembers: 373, year: 2024 },
  ];
  
  export const MOCK_REVENUE_DATA: RevenueData[] = [
    { month: 'Jan', revenue: 2500000, previousYear: 1800000, currency: 'NGN' },
    { month: 'Feb', revenue: 2800000, previousYear: 2100000, currency: 'NGN' },
    { month: 'Mar', revenue: 3200000, previousYear: 2400000, currency: 'NGN' },
    { month: 'Apr', revenue: 3500000, previousYear: 2600000, currency: 'NGN' },
    { month: 'May', revenue: 3800000, previousYear: 2900000, currency: 'NGN' },
    { month: 'Jun', revenue: 4100000, previousYear: 3100000, currency: 'NGN' },
    { month: 'Jul', revenue: 4400000, previousYear: 3400000, currency: 'NGN' },
    { month: 'Aug', revenue: 4700000, previousYear: 3700000, currency: 'NGN' },
    { month: 'Sep', revenue: 5000000, previousYear: 4000000, currency: 'NGN' },
    { month: 'Oct', revenue: 5300000, previousYear: 4300000, currency: 'NGN' },
    { month: 'Nov', revenue: 5600000, previousYear: 4600000, currency: 'NGN' },
    { month: 'Dec', revenue: 6000000, previousYear: 4900000, currency: 'NGN' },
  ];
  
  export const MOCK_SUBSCRIPTION_DISTRIBUTION: SubscriptionDistribution[] = [
    { status: 'Active', count: 285, percentage: 76.4, color: '#10b981' },
    { status: 'Inactive', count: 58, percentage: 15.5, color: '#f59e0b' },
    { status: 'Expired', count: 30, percentage: 8.1, color: '#ef4444' },
  ];
  
  export const MOCK_PLAN_DISTRIBUTION: PlanDistribution[] = [
    { plan: 'Starter', count: 125, revenue: 5625000, percentage: 33.5 },
    { plan: 'Growth', count: 150, revenue: 12000000, percentage: 40.2 },
    { plan: 'Pro', count: 75, revenue: 9000000, percentage: 20.1 },
    { plan: 'Organization', count: 23, revenue: 11500000, percentage: 6.2 },
  ];