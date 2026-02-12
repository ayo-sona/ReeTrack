import { useQuery } from "@tanstack/react-query";
import { memberApi } from "@/lib/memberAPI/memberAPI";

interface Organization {
    id: string;
    name: string;
    slug: string;
    email: string;
    status: string;
    address: string;
    website: string;
    phone: string;
    description: string;
    created_at: string;
    updated_at: string;
  }
  
  interface Plan {
    id: string;
    organization_id: string;
    name: string;
    description: string;
    price: number | null;
    currency: string;
    interval: string | null;
    interval_count: number | null;
    features: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
    organization: Organization; // ✨ Add this line
  }

interface Subscription {
  id: string;
  plan_id: string;
  organization_id: string;
  status: "active" | "expired" | "canceled";
  started_at: string;
  expires_at: string;
  auto_renew: boolean;
  plan: Plan;
}

interface Payment {
  id: string;
  amount: number | string;
  status: string;
  created_at: string;
}

interface CommunityActivity {
  id: string;
  type: "check_in" | "payment" | "subscription" | "renewal";
  title: string;
  description: string;
  created_at: string;
}

interface CommunityStats {
  total_check_ins: number;
  check_ins_this_month: number;
  active_subscriptions: number;
  total_spent: number;
  member_since: string;
}

interface CommunityData {
  organization: Organization;
  stats: CommunityStats;
  subscriptions: Subscription[];
  available_plans: Plan[];
  recent_activity: CommunityActivity[];
}

interface OrganizationWithSubscription {
  organization: Organization;
  subscriptions: Subscription[];
  active_subscription_count: number;
}

// Get member's primary community data
export const useCommunity = () => {
  return useQuery<CommunityData | null>({
    queryKey: ["member", "community"],
    queryFn: async () => {
      try {
        // Fetch all data in parallel using memberApi
        const [profileResponse, subscriptionResponse, statsResponse, plansResponse, paymentsResponse] =
          await Promise.all([
            memberApi.getProfile(),
            memberApi.getMySubscription().catch(() => ({ data: [] })),
            memberApi.getStats().catch(() => ({ data: {} })),
            memberApi.getAvailablePlans().catch(() => ({ data: { plans: [] } })),
            memberApi.getPayments(1, 100).catch(() => ({ data: { data: [] } })),
          ]);

        const profile = profileResponse.data;
        const subscriptions = Array.isArray(subscriptionResponse.data)
          ? subscriptionResponse.data
          : subscriptionResponse.data
          ? [subscriptionResponse.data]
          : [];
        const stats = statsResponse.data || {};
        
        // Handle plans - they're in data.data.plans
        const plansData = plansResponse.data?.plans || plansResponse.data || [];
        const plans: Plan[] = Array.isArray(plansData) ? plansData : [];
        
        const payments: Payment[] = paymentsResponse.data?.data || paymentsResponse.data || [];

        // If no profile or organization, return null
        if (!profile || !profile.organization) {
          return null;
        }

        // Calculate total spent from successful payments
        const totalSpent = Array.isArray(payments)
          ? payments
              .filter((p: Payment) => p.status === "success")
              .reduce((sum: number, p: Payment) => sum + Number(p.amount || 0), 0)
          : 0;

        // Generate recent activity from payments and subscriptions
        const paymentActivities: CommunityActivity[] = Array.isArray(payments)
          ? payments.slice(0, 3).map((payment: Payment) => ({
              id: payment.id,
              type: "payment" as const,
              title: "Payment Received",
              description: `Payment of ₦${Number(payment.amount || 0).toLocaleString()} processed`,
              created_at: payment.created_at,
            }))
          : [];

        const subscriptionActivities: CommunityActivity[] = subscriptions
          .slice(0, 2)
          .map((sub: Subscription) => ({
            id: sub.id,
            type: "subscription" as const,
            title: "Subscription Active",
            description: `${sub.plan.name} subscription`,
            created_at: sub.started_at,
          }));

        const recent_activity: CommunityActivity[] = [
          ...paymentActivities,
          ...subscriptionActivities,
        ].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        // Count active subscriptions
        const activeSubscriptionCount = subscriptions.filter(
          (s: Subscription) => s.status === "active"
        ).length;

        return {
          organization: profile.organization,
          stats: {
            total_check_ins: stats.total_check_ins || 0,
            check_ins_this_month: stats.check_ins_this_month || 0,
            active_subscriptions: activeSubscriptionCount,
            total_spent: totalSpent,
            member_since: stats.member_since || profile.created_at,
          },
          subscriptions: subscriptions,
          available_plans: plans,
          recent_activity: recent_activity.slice(0, 5),
        };
      } catch (error) {
        console.error("Error fetching community data:", error);
        return null;
      }
    },
  });
};

// Get all communities (organizations member is subscribed to)
export const useCommunities = () => {
  return useQuery<OrganizationWithSubscription[]>({
    queryKey: ["member", "communities"],
    queryFn: async () => {
      try {
        const subscriptionResponse = await memberApi
          .getMySubscription()
          .catch(() => ({ data: [] }));

        const subscriptions: Subscription[] = Array.isArray(subscriptionResponse.data)
          ? subscriptionResponse.data
          : subscriptionResponse.data
          ? [subscriptionResponse.data]
          : [];

        // Group subscriptions by organization
        const organizationMap = new Map<string, Subscription[]>();

        subscriptions.forEach((sub: Subscription) => {
          const orgId = sub.organization_id;
          if (!organizationMap.has(orgId)) {
            organizationMap.set(orgId, []);
          }
          organizationMap.get(orgId)?.push(sub);
        });

        // For now, return empty array
        // TODO: Need backend endpoint to get all organizations
        return [];
      } catch (error) {
        console.error("Error fetching communities:", error);
        return [];
      }
    },
  });
};

// Get available plans from organization for member
export const useAvailablePlans = () => {
  return useQuery<Plan[]>({
    queryKey: ["member", "available-plans"],
    queryFn: async () => {
      try {
        const response = await memberApi.getAvailablePlans();
        // Plans are nested in data.plans
        const plansData = response.data?.plans || response.data || [];
        return Array.isArray(plansData) ? plansData : [];
      } catch (error) {
        console.error("Error fetching available plans:", error);
        return [];
      }
    },
  });
};