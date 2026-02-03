export interface MRRData {
  current_mrr: number;
  previous_mrr: number;
  growth_rate: number;
  growth_amount: number;
}

export interface ChurnData {
  churned_members: number;
  total_members: number;
  churn_rate: number;
  period: string;
}

export interface RevenueData {
  total_revenue: number;
  period_revenue: number;
  growth_rate: number;
  average_transaction: number;
}

export interface MemberGrowthData {
  new_members: number;
  churned_members: number;
  net_growth: number;
  total_members: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  subscriptions: number;
  members: number;
}

export interface PlanPerformanceData {
  plan_id: string;
  plan_name: string;
  active_subscriptions: number;
  revenue: number;
  conversion_rate: number;
}

export interface MemberReportItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  subscriptionStatus: string;
  joinDate: string;
  nextBilling: string;
}

export interface MemberReport {
  members: MemberReportItem[];
}

export interface PaymentReportItem {
  id: string;
  date: string;
  memberName: string;
  amount: number;
  plan: string;
  paymentProvider: string;
  status: string;
  reference: string;
}

export interface PaymentReport {
  payments: PaymentReportItem[];
}

export interface RevenueReportItem {
  period: string;
  totalRevenue: number;
  subscriptions: number;
  averagePerMember: number;
  growth: string;
}

export interface RevenueReport {
  revenue: RevenueReportItem[];
}

export interface PlanReportItem {
  id: string;
  name: string;
  price: number;
  duration: string;
  activeMembers: number;
  totalRevenue: number;
  status: string;
}

export interface PlanReport {
  plans: PlanReportItem[];
}
