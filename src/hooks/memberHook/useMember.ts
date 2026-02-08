import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { memberApi } from "@/lib/memberAPI/memberAPI";
import type {
  Member,
  MemberSubscription,
  MemberPayment,
  MemberInvoice,
  InvoiceStats,
  MemberStats,
  UpdateMemberDto,
  InitializePaymentDto,
  PaginatedResponse,
} from "@/types/memberTypes/member";

// ============================================
// TYPE DEFINITIONS FOR API RESPONSES
// ============================================

/**
 * Type for the subscription API response
 * The API returns members with nested subscriptions
 */
interface MemberWithSubscriptions {
  id: string;
  subscriptions?: MemberSubscription[];
}

interface SubscriptionApiResponse {
  data: MemberWithSubscriptions[];
}

// ============================================
// PROFILE HOOKS
// ============================================

/**
 * Get current member profile
 * GET /api/v1/members/me
 */
export const useProfile = () => {
  return useQuery<Member, Error>({
    queryKey: ["member", "profile"],
    queryFn: memberApi.getProfile,
    retry: 1,
  });
};

/**
 * Update member profile
 * PUT /api/v1/members
 * 
 * Note: Updates user.date_of_birth and user.address
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMemberDto) => memberApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", "profile"] });
    },
  });
};

/**
 * Delete member account
 * DELETE /api/v1/members
 */
export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: memberApi.deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member"] });
      // Optionally redirect to login or show success message
    },
  });
};

/**
 * Get member statistics
 * GET /api/v1/members/stats
 */
export const useMemberStats = () => {
  return useQuery<MemberStats, Error>({
    queryKey: ["member", "stats"],
    queryFn: memberApi.getStats,
    retry: 1,
  });
};

// ============================================
// SUBSCRIPTION HOOKS
// ============================================

/**
 * Get current member's subscription
 * GET /api/v1/subscriptions/members/subscription
 * 
 * Response structure can be either:
 * 1. { data: [{ id: "member-id", subscriptions: [...] }] }
 * 2. [{ id: "member-id", subscriptions: [...] }]
 * 
 * This hook normalizes both formats
 */
export const useMySubscription = () => {
  return useQuery<SubscriptionApiResponse | MemberWithSubscriptions[], Error>({
    queryKey: ["member", "subscription", "current"],
    queryFn: memberApi.getMySubscription,
    retry: 1,
  });
};

/**
 * Get all member subscriptions (paginated)
 * GET /api/v1/subscriptions/members?page=1&limit=10&status=active
 * ⚠️ WARNING: This endpoint requires ADMIN access, not for regular members
 */
export const useSubscriptions = (
  page: number = 1,
  limit: number = 10,
  status?: string
) => {
  return useQuery<PaginatedResponse<MemberSubscription>, Error>({
    queryKey: ["member", "subscriptions", page, limit, status],
    queryFn: () => memberApi.getSubscriptions(page, limit, status),
    placeholderData: keepPreviousData,
    retry: 1,
  });
};

/**
 * Get single subscription by ID
 * ✅ FIXED: Uses useMySubscription instead of admin-only endpoint
 * 
 * This version works for regular members by:
 * 1. Getting all member subscriptions via useMySubscription
 * 2. Flattening the nested structure
 * 3. Finding the specific subscription by ID
 */
export const useSubscription = (subscriptionId: string) => {
  const { data: rawResponse, isLoading, error, ...rest } = useMySubscription();

  // Normalize the response to get member data array
  const memberData = normalizeSubscriptionResponse(rawResponse);
  
  // Flatten all subscriptions across all members
  const allSubscriptions = memberData.flatMap((member) => 
    member.subscriptions?.filter((sub) => sub.plan) || []
  );
  
  // Find the specific subscription
  const subscription = allSubscriptions.find((sub) => sub.id === subscriptionId);

  return {
    data: subscription || null,
    isLoading,
    error: !subscription && !isLoading ? new Error("Subscription not found") : error,
    ...rest,
  };
};

/**
 * Cancel subscription
 * PATCH /api/v1/subscriptions/members/:subscriptionId/cancel
 */
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) =>
      memberApi.cancelSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", "subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["member", "stats"] });
    },
  });
};

/**
 * Renew subscription
 * POST /api/v1/subscriptions/members/:subscriptionId/renew
 */
export const useRenewSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) =>
      memberApi.renewSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", "subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["member", "stats"] });
    },
  });
};

/**
 * Change subscription plan (upgrade/downgrade)
 * POST /api/v1/subscriptions/members/:subscriptionId/change-plan
 */
export const useChangeSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subscriptionId,
      newPlanId,
    }: {
      subscriptionId: string;
      newPlanId: string;
    }) => memberApi.changeSubscriptionPlan(subscriptionId, newPlanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", "subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["member", "stats"] });
    },
  });
};

// ============================================
// PAYMENT HOOKS
// ============================================

/**
 * Get member payments (paginated)
 * GET /api/v1/payments/member?page=1&limit=10
 */
export const usePayments = (page: number = 1, limit: number = 10) => {
  return useQuery<PaginatedResponse<MemberPayment>, Error>({
    queryKey: ["member", "payments", page, limit],
    queryFn: () => memberApi.getPayments(page, limit),
    placeholderData: keepPreviousData,
    retry: 1,
  });
};

/**
 * Initialize payment
 * POST /api/v1/payments/paystack/initialize
 */
export const useInitializePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InitializePaymentDto) =>
      memberApi.initializePayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", "payments"] });
    },
  });
};

/**
 * Verify payment
 * GET /api/v1/payments/paystack/verify/:reference
 */
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reference: string) => memberApi.verifyPayment(reference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", "payments"] });
      queryClient.invalidateQueries({ queryKey: ["member", "subscriptions"] });
    },
  });
};

// ============================================
// INVOICE HOOKS
// ============================================

/**
 * Get all member invoices
 * GET /api/v1/invoices/member?status=...
 */
export const useInvoices = (
  status?: "pending" | "paid" | "cancelled" | "failed"
) => {
  return useQuery<MemberInvoice[], Error>({
    queryKey: ["member", "invoices", status],
    queryFn: () => memberApi.getInvoices(status),
    retry: 1,
  });
};

/**
 * Get invoice stats
 * GET /api/v1/invoices/member/all/stats
 */
export const useInvoiceStats = () => {
  return useQuery<InvoiceStats, Error>({
    queryKey: ["member", "invoices", "stats"],
    queryFn: memberApi.getInvoiceStats,
    retry: 1,
  });
};

/**
 * Get overdue invoices
 * GET /api/v1/invoices/member/all/overdue
 */
export const useOverdueInvoices = () => {
  return useQuery<MemberInvoice[], Error>({
    queryKey: ["member", "invoices", "overdue"],
    queryFn: memberApi.getOverdueInvoices,
    retry: 1,
  });
};

/**
 * Get invoice by ID
 * GET /api/v1/invoices/member/:invoiceId
 */
export const useInvoice = (invoiceId: string) => {
  return useQuery<MemberInvoice, Error>({
    queryKey: ["member", "invoices", invoiceId],
    queryFn: () => memberApi.getInvoiceById(invoiceId),
    enabled: !!invoiceId,
    retry: 1,
  });
};

/**
 * Mark invoice as paid
 * PATCH /api/v1/invoices/member/:invoiceId/mark-paid
 */
export const useMarkInvoiceAsPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invoiceId: string) => memberApi.markInvoiceAsPaid(invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", "invoices"] });
    },
  });
};

/**
 * Cancel invoice
 * PATCH /api/v1/invoices/member/:invoiceId/cancel
 */
export const useCancelInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invoiceId: string) => memberApi.cancelInvoice(invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", "invoices"] });
    },
  });
};

// ============================================
// HELPER HOOKS FOR DATA TRANSFORMATION
// ============================================

/**
 * Helper function to normalize subscription API response
 * Handles both response formats:
 * 1. { data: [...] }
 * 2. [...]
 */
const normalizeSubscriptionResponse = (
  response: SubscriptionApiResponse | MemberWithSubscriptions[] | undefined
): MemberWithSubscriptions[] => {
  if (!response) return [];
  
  // Check if response has a 'data' property (wrapped format)
  if ('data' in response && Array.isArray(response.data)) {
    return response.data;
  }
  
  // Response is already an array
  if (Array.isArray(response)) {
    return response;
  }
  
  return [];
};

/**
 * Get all subscriptions as a flattened array
 * ✅ FIXED: Properly handles both possible API response structures
 * 
 * API Response can be either:
 * Format 1: { data: [{ id: "member1", subscriptions: [...] }] }
 * Format 2: [{ id: "member1", subscriptions: [...] }]
 * 
 * Returns: Flattened array of all subscriptions across all members
 */
export const useAllSubscriptions = () => {
  const { data: rawResponse, isLoading, error, ...rest } = useMySubscription();

  // Normalize the response to always get an array of members
  const memberData = normalizeSubscriptionResponse(rawResponse);
  
  // Flatten the nested structure
  const flattenedSubscriptions = memberData.flatMap((member) => 
    member.subscriptions?.filter((sub) => sub.plan) || []
  );

  return {
    data: flattenedSubscriptions,
    isLoading,
    error,
    ...rest,
  };
};

/**
 * Get active subscriptions only
 * ✅ FIXED: Filters for active status from flattened subscriptions
 */
export const useActiveSubscriptions = () => {
  const { data: rawResponse, isLoading, error, ...rest } = useMySubscription();

  // Normalize the response to always get an array of members
  const memberData = normalizeSubscriptionResponse(rawResponse);
  
  // Flatten and filter for active subscriptions
  const activeSubscriptions = memberData.flatMap((member) => 
    member.subscriptions?.filter((sub) => 
      sub.plan && sub.status === 'active'
    ) || []
  );

  return {
    data: activeSubscriptions,
    isLoading,
    error,
    ...rest,
  };
};

/**
 * Get all payments as a simple array (not paginated)
 */
export const useAllPayments = () => {
  const { data, ...rest } = usePayments(1, 100); // Get all in one page

  return {
    data: data?.data ?? [],
    meta: data?.meta,
    ...rest,
  };
};

// ============================================
// ⚠️ MISSING HOOKS - NOT AVAILABLE IN API
// ============================================

/*
 * The following hooks are referenced in old components but are NOT available
 * because the backend API doesn't have these endpoints:
 *
 * 1. WALLET HOOKS (No wallet system in API):
 *    - useWallet()
 *    - useCreateWallet()
 *    - useTopUpWallet()
 *    - useTransactions()
 *
 * 2. CHECK-IN HOOKS (No check-in system in API):
 *    - useGenerateCheckInCode()
 *
 * 3. NOTIFICATION HOOKS (✅ IMPLEMENTED AS SYNTHETIC):
 *    - See: hooks/memberHook/useSyntheticNotifications.ts
 *    - useSyntheticNotifications()
 *    - useUnreadCount()
 *    - useMarkAsRead()
 *    - useMarkAllAsRead()
 *
 * 4. REFERRAL HOOKS (No referral system in API):
 *    - useReferral()
 *    - useReferredMembers()
 *
 * 5. PAUSE/RESUME HOOKS (Not in subscription endpoints):
 *    - usePauseSubscription() ❌ Not available
 *    - useResumeSubscription() ❌ Not available
 *    - Use useCancelSubscription() and useRenewSubscription() instead ✅
 *
 * ACTION REQUIRED:
 * - Remove components that use these features, OR
 * - Mock the data for now, OR
 * - Wait for backend to implement these features
 */

// ============================================
// EXPORT ALL HOOKS
// ============================================

const memberHooks = {
  // Profile
  useProfile,
  useUpdateProfile,
  useDeleteMember,
  useMemberStats,

  // Subscriptions
  useMySubscription,
  useSubscriptions,
  useSubscription,
  useCancelSubscription,
  useRenewSubscription,
  useChangeSubscriptionPlan,
  useAllSubscriptions,
  useActiveSubscriptions,

  // Payments
  usePayments,
  useInitializePayment,
  useVerifyPayment,
  useAllPayments,

  // Invoices
  useInvoices,
  useInvoiceStats,
  useOverdueInvoices,
  useInvoice,
  useMarkInvoiceAsPaid,
  useCancelInvoice,
};

export default memberHooks;
