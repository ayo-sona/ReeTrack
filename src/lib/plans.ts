export const PLAN_FEATURES = {
  BASIC: {
    adminAccounts: 1,
    customEmailsPerMonth: 2,
    transactionFeePercent: 10,
    analyticsLevel: 'basic',
    memberPlanAccess: 1,
    checkIn: false,
    reportsGeneration: false,
    prioritySupport: false,
  },
  PLATINUM: {
    adminAccounts: 3,
    customEmailsPerMonth: 50,
    transactionFeePercent: 7,
    analyticsLevel: 'advanced',
    memberPlanAccess: 3,
    checkIn: true,
    reportsGeneration: true,
    prioritySupport: true,
  },
  GOLD: {
    adminAccounts: Infinity,
    customEmailsPerMonth: 200,
    transactionFeePercent: 4,
    analyticsLevel: 'advanced',
    memberPlanAccess: Infinity,
    checkIn: true,
    reportsGeneration: true,
    prioritySupport: true,
  },
} as const;

export type PlanTier = keyof typeof PLAN_FEATURES;
export type PlanFeatures = (typeof PLAN_FEATURES)[PlanTier];
