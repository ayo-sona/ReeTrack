// lib/api/organizationNotificationsApi.ts

import apiClient from "@/lib/apiClient";

// ============================================
// TYPES
// ============================================

export interface SubscriptionData {
  id: string;
  status: "active" | "cancelled" | "expired" | "pending" | "failed";
  expires_at: string;
  started_at: string;
  plan?: {
    name: string;
    price: number;
    interval: string;
  };
}

export interface PaymentData {
  id: string;
  amount: number;
  status: "success" | "failed" | "pending";
  created_at: string;
  type?: string;
  reference?: string;
}

export interface MemberData {
  id: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    email?: string;
  };
}

export interface StatsData {
  totalUsers: number;
  totalMembers: number;
  totalPlans: number;
  activeSubscriptions: number;
}

// ============================================
// API CALLS
// ============================================

/**
 * Fetches the current organization subscription.
 * GET /api/v1/subscriptions/organizations
 */
export const fetchOrganizationSubscription = async (): Promise<SubscriptionData | null> => {
  const res = await apiClient.get("/subscriptions/organizations");
  // Handle both { data: {...} } and direct object responses
  return res.data?.data ?? res.data ?? null;
};

/**
 * Fetches all organization payments.
 * GET /api/v1/payments
 * NOTE: This endpoint returns paginated data: { data: [...], meta: {...} }
 * We extract the data array here so callers don't have to worry about it.
 */
export const fetchOrganizationPayments = async (): Promise<PaymentData[]> => {
  const res = await apiClient.get("/payments");
  const body = res.data;

  // Paginated response: { data: [...], meta: {...} }
  if (body && Array.isArray(body.data)) return body.data;

  // Direct array response (fallback)
  if (Array.isArray(body)) return body;

  return [];
};

/**
 * Fetches all organization members.
 * GET /api/v1/members
 * NOTE: This endpoint returns a direct array of members.
 */
export const fetchOrganizationMembers = async (): Promise<MemberData[]> => {
  const res = await apiClient.get("/members");
  const body = res.data;

  // Direct array
  if (Array.isArray(body)) return body;

  // Paginated (defensive, in case it changes)
  if (body && Array.isArray(body.data)) return body.data;

  return [];
};

/**
 * Fetches organization stats.
 * GET /api/v1/organizations/me/stats
 * Response example: { totalUsers, totalMembers, totalPlans, activeSubscriptions }
 */
export const fetchOrganizationStats = async (): Promise<StatsData | null> => {
  const res = await apiClient.get("/organizations/me/stats");
  return res.data?.data ?? res.data ?? null;
};

/**
 * Fetches all data needed for notifications in parallel.
 * Failures in individual calls are silenced so one bad endpoint
 * doesn't break the whole notification system.
 */
export const fetchAllNotificationData = async () => {
  const [subscription, payments, members, stats] = await Promise.all([
    fetchOrganizationSubscription().catch(() => null),
    fetchOrganizationPayments().catch(() => []),
    fetchOrganizationMembers().catch(() => []),
    fetchOrganizationStats().catch(() => null),
  ]);

  return { subscription, payments, members, stats };
};