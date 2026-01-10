export interface MRRData {
  current_mrr: number;
  previous_mrr: number;
  growth_rate: number;
  growth_amount: number;
}

export interface ChurnData {
  churned_customers: number;
  total_customers: number;
  churn_rate: number;
  period: string;
}

export interface RevenueData {
  total_revenue: number;
  period_revenue: number;
  growth_rate: number;
  average_transaction: number;
}

export interface CustomerGrowthData {
  new_customers: number;
  churned_customers: number;
  net_growth: number;
  total_customers: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  subscriptions: number;
  customers: number;
}

export interface PlanPerformanceData {
  plan_id: string;
  plan_name: string;
  active_subscriptions: number;
  revenue: number;
  conversion_rate: number;
}
