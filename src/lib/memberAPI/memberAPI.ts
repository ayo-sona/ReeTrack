import apiClient from "../apiClient";

// ============================================
// MEMBER API - Matches OpenAPI Spec
// ============================================

/**
 * Get current member profile
 * GET /api/v1/members/me
 */
export const getProfile = async () => {
  const {
    data: { data },
  } = await apiClient.get("/members/me");
  return data;
};

/**
 * Get all members (with optional search)
 * GET /api/v1/members?search=...
 */
export const getMembers = async (search?: string) => {
  const { data } = await apiClient.get("/members", {
    params: { search },
  });
  return data;
};

/**
 * Update current member profile
 * PUT /api/v1/members
 */
export const updateProfile = async (updateData: {
  date_of_birth?: string;
  address?: string;
}) => {
  const { data } = await apiClient.put("/members", updateData);
  return data;
};

/**
 * Delete current member account
 * DELETE /api/v1/members
 */
export const deleteMember = async () => {
  const { data } = await apiClient.delete("/members");
  return data;
};

/**
 * Get member stats
 * GET /api/v1/members/stats
 */
export const getStats = async () => {
  const { data } = await apiClient.get("/members/stats");
  return data;
};

/**
 * Get member organizations
 * GET /api/v1/members/orgs
 */
export const getMemberOrgs = async () => {
  const {
    data: { data },
  } = await apiClient.get("/members/orgs");
  return data;
};

// ============================================
// SUBSCRIPTION API - Member Subscriptions
// ============================================

/**
 * Get current member's subscription
 * GET /api/v1/subscriptions/members/subscription
 */
export const getMySubscription = async () => {
  const { data } = await apiClient.get("/subscriptions/members/subscription");
  return data;
};

/**
 * Get all member subscriptions (paginated)
 * GET /api/v1/subscriptions/members?page=1&limit=10&status=active
 */
export const getSubscriptions = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
) => {
  const { data } = await apiClient.get("/subscriptions/members", {
    params: { page, limit, status },
  });
  return data;
};

/**
 * Cancel a subscription
 * PATCH /api/v1/subscriptions/members/:subscriptionId/cancel
 */
export const cancelSubscription = async (subscriptionId: string) => {
  const { data } = await apiClient.patch(
    `/subscriptions/members/${subscriptionId}/cancel`,
  );
  return data;
};

/**
 * Renew a subscription
 * POST /api/v1/subscriptions/members/:subscriptionId/renew
 */
export const renewSubscription = async (subscriptionId: string) => {
  const { data } = await apiClient.post(
    `/subscriptions/members/${subscriptionId}/renew`,
  );
  return data;
};

/**
 * Change subscription plan
 * POST /api/v1/subscriptions/members/:subscriptionId/change-plan
 */
export const changeSubscriptionPlan = async (
  subscriptionId: string,
  newPlanId: string,
) => {
  const { data } = await apiClient.post(
    `/subscriptions/members/${subscriptionId}/change-plan`,
    { newPlanId },
  );
  return data;
};

// ============================================
// PAYMENT API - Member Payments
// ============================================

/**
 * Get member payments (paginated)
 * GET /api/v1/payments/member?page=1&limit=10
 */
export const getPayments = async (page: number = 1, limit: number = 10) => {
  const { data } = await apiClient.get("/payments/member", {
    params: { page, limit },
  });
  return data;
};

/**
 * Initialize payment
 * POST /api/v1/payments/paystack/initialize
 */
export const initializePayment = async (paymentData: {
  email: string;
  amount: number;
  planId?: string;
  subscriptionId?: string;
}) => {
  const { data } = await apiClient.post(
    "/payments/paystack/initialize",
    paymentData,
  );
  return data;
};

// Add this section to your member API file

// ============================================
// PLANS API - Member Plans
// ============================================

/**
 * Get available plans from organization for member
 * GET /api/v1/plans/member/available
 */
export const getAvailablePlans = async () => {
  const { data } = await apiClient.get("/plans/member/available");
  return data;
};

/**
 * Get all member plans (paginated)
 * GET /api/v1/plans/member?page=1&limit=10
 */
export const getMemberPlans = async (page: number = 1, limit: number = 10) => {
  const { data } = await apiClient.get("/plans/member", {
    params: { page, limit },
  });
  return data;
};

/**
 * Get active plans
 * GET /api/v1/plans/member/active
 */
export const getActivePlans = async () => {
  const { data } = await apiClient.get("/plans/member/active");
  return data;
};

/**
 * Get plan statistics
 * GET /api/v1/plans/member/stats
 */
export const getPlanStats = async () => {
  const { data } = await apiClient.get("/plans/member/stats");
  return data;
};

/**
 * Verify payment
 * GET /api/v1/payments/paystack/verify/:reference
 */
export const verifyPayment = async (reference: string) => {
  const { data } = await apiClient.get(
    `/payments/paystack/verify/${reference}`,
  );
  return data;
};

// ============================================
// INVOICE API - Member Invoices
// ============================================

/**
 * Get all member invoices
 * GET /api/v1/invoices/member?status=...
 */
export const getInvoices = async (
  status?: "pending" | "paid" | "cancelled" | "failed",
) => {
  const { data } = await apiClient.get("/invoices/member", {
    params: { status },
  });
  return data;
};

/**
 * Get member invoice stats
 * GET /api/v1/invoices/member/all/stats
 */
export const getInvoiceStats = async () => {
  const { data } = await apiClient.get("/invoices/member/all/stats");
  return data;
};

/**
 * Get overdue invoices
 * GET /api/v1/invoices/member/all/overdue
 */
export const getOverdueInvoices = async () => {
  const { data } = await apiClient.get("/invoices/member/all/overdue");
  return data;
};

/**
 * Get invoice by ID
 * GET /api/v1/invoices/member/:invoiceId
 */
export const getInvoiceById = async (invoiceId: string) => {
  const { data } = await apiClient.get(`/invoices/member/${invoiceId}`);
  return data;
};

/**
 * Mark invoice as paid
 * PATCH /api/v1/invoices/member/:invoiceId/mark-paid
 */
export const markInvoiceAsPaid = async (invoiceId: string) => {
  const { data } = await apiClient.patch(
    `/invoices/member/${invoiceId}/mark-paid`,
  );
  return data;
};

/**
 * Cancel invoice
 * PATCH /api/v1/invoices/member/:invoiceId/cancel
 */
export const cancelInvoice = async (invoiceId: string) => {
  const { data } = await apiClient.patch(
    `/invoices/member/${invoiceId}/cancel`,
  );
  return data;
};

// ============================================
// EXPORT ALL
// ============================================

export const memberApi = {
  // Member
  getProfile,
  getMembers,
  updateProfile,
  deleteMember,
  getStats,
  getMemberOrgs,

  // Subscriptions
  getMySubscription,
  getSubscriptions,
  cancelSubscription,
  renewSubscription,
  changeSubscriptionPlan,

  // Payments
  getPayments,
  initializePayment,
  verifyPayment,

  // Invoices
  getInvoices,
  getInvoiceStats,
  getOverdueInvoices,
  getInvoiceById,
  markInvoiceAsPaid,
  cancelInvoice,

  // Plans (NEW)
  getAvailablePlans,
  getMemberPlans,
  getActivePlans,
  getPlanStats,
};

// ============================================
// NOTES ON MISSING ENDPOINTS
// ============================================

/*
 * ⚠️ ENDPOINTS NOT IN API (Components reference these but they don't exist):
 *
 * 1. WALLET - No wallet endpoints exist
 *    - Components use: getWallet, createWallet, topUpWallet, getTransactions
 *    - These will need to be mocked or the feature needs to be added to backend
 *
 * 2. CHECK-IN - No check-in endpoints exist
 *    - Components use: generateCheckInCode
 *    - This feature needs backend implementation
 *
 * 3. NOTIFICATIONS - No notification endpoints exist
 *    - Components use: getNotifications, markNotificationRead, markAllNotificationsRead
 *    - This feature needs backend implementation
 *
 * 4. REFERRALS - No referral endpoints exist
 *    - Components use: getReferral, getReferredMembers
 *    - This feature needs backend implementation
 */
