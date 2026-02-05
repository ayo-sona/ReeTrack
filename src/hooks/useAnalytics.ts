import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../lib/organizationAPI/analyticsApi";
import { getCurrentOrganizationId } from "../utils/organisationUtils";
import type {
  AnalyticsOverview,
  RevenueChartData,
  ChurnData,
  MRRData,
  PlanPerformanceData,
  TopMemberData,
} from "../types/analytics";

// Get analytics overview
export const useAnalyticsOverview = (params: {
  period: string;
  startDate?: string;
  endDate?: string;
}) => {
  const organizationId = getCurrentOrganizationId();

  return useQuery<AnalyticsOverview, Error>({
    queryKey: ["analytics", "overview", organizationId, params],
    queryFn: () => analyticsApi.getOverview(organizationId!, params),
    enabled: !!organizationId, // Only run query if organizationId exists
    retry: false,
  });
};

// Get MRR (Monthly Recurring Revenue)
export const useMRR = () => {
  const organizationId = getCurrentOrganizationId();

  return useQuery<MRRData, Error>({
    queryKey: ["analytics", "mrr", organizationId],
    queryFn: () => analyticsApi.getMRR(organizationId!),
    enabled: !!organizationId,
    retry: false,
  });
};

// Get churn rate
export const useChurn = (params: {
  period: string;
  startDate?: string;
  endDate?: string;
}) => {
  const organizationId = getCurrentOrganizationId();

  return useQuery<ChurnData, Error>({
    queryKey: ["analytics", "churn", organizationId, params],
    queryFn: () => analyticsApi.getChurn(organizationId!, params),
    enabled: !!organizationId,
    retry: false,
  });
};

// Get revenue chart data
export const useRevenueChart = (params: {
  period: string;
  startDate?: string;
  endDate?: string;
}) => {
  const organizationId = getCurrentOrganizationId();

  return useQuery<RevenueChartData[], Error>({
    queryKey: ["analytics", "revenue-chart", organizationId, params],
    queryFn: () => analyticsApi.getRevenueChart(organizationId!, params),
    enabled: !!organizationId,
    retry: false,
  });
};

// Get plan performance
export const usePlanPerformance = () => {
  const organizationId = getCurrentOrganizationId();

  return useQuery<PlanPerformanceData[], Error>({
    queryKey: ["analytics", "plan-performance", organizationId],
    queryFn: () => analyticsApi.getPlanPerformance(organizationId!),
    enabled: !!organizationId,
    retry: false,
  });
};

// Get top members
export const useTopMembers = () => {
  const organizationId = getCurrentOrganizationId();

  return useQuery<TopMemberData[], Error>({
    queryKey: ["analytics", "top-members", organizationId],
    queryFn: () => analyticsApi.getTopMembers(organizationId!),
    enabled: !!organizationId,
    retry: false,
  });
};