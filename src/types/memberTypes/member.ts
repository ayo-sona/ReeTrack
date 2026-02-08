// ============================================
// MEMBER TYPES - Based on Actual API Response
// ============================================

/**
 * User object (nested in Member)
 * Contains personal info including date_of_birth and address
 */
export interface MemberUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string | null; // ⭐ MOVED TO USER TABLE
  address: string | null; // ⭐ MOVED TO USER TABLE
  status: "active" | "inactive";
  email_verified: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Member - Main member object
 * Based on GET /api/v1/members response
 */
export interface Member {
  // Core member fields
  id: string;
  organization_user_id: string;
  user_id: string;
  check_in_count: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;

  // ⚠️ REMOVED FIELDS (as per your instructions):
  // - emergency_contact_phone
  // - emergency_contact_name
  // - medical_notes
  // - date_of_birth (moved to user table)
  // - address (moved to user table)

  // Nested user object with personal info
  user: MemberUser;

  // Subscriptions array (if populated)
  subscriptions?: MemberSubscription[];
}

// ============================================
// SUBSCRIPTION TYPES
// ============================================

/**
 * Plan object nested in subscription
 */
export interface SubscriptionPlan {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string; // "monthly", "yearly", etc.
  interval_count: number;
  features: {
    features: string[];
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Member Subscription
 * Based on GET /api/v1/subscriptions/members response
 */
export interface MemberSubscription {
  id: string;
  member_id: string;
  plan_id: string;
  organization_id: string;
  status: "active" | "expired" | "canceled" | "pending";
  started_at: string;
  expires_at: string;
  canceled_at: string | null;
  auto_renew: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;

  // Nested plan object
  plan: SubscriptionPlan;
}

// ============================================
// PAYMENT TYPES
// ============================================

/**
 * Member Payment
 * Based on GET /api/v1/payments/member response
 */
export interface MemberPayment {
  id: string;
  member_id: string;
  invoice_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_provider: string;
  provider_reference: string;
  status: "pending" | "success" | "failed";
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;

  // Nested invoice object (if populated)
  invoice?: {
    id: string;
    amount: number;
    due_date: string;
    status: string;
    member_subscription?: {
      plan: SubscriptionPlan;
    };
  };
}

// ============================================
// INVOICE TYPES
// ============================================

/**
 * Member Invoice
 * Based on GET /api/v1/invoices/member response
 */
export interface MemberInvoice {
  id: string;
  member_id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "cancelled" | "failed";
  due_date: string;
  paid_at: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;

  // Nested subscription (if populated)
  subscription?: MemberSubscription;
}

/**
 * Invoice Stats
 * Based on GET /api/v1/invoices/member/all/stats response
 */
export interface InvoiceStats {
  total_invoices: number;
  pending_invoices: number;
  paid_invoices: number;
  cancelled_invoices: number;
  failed_invoices: number;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
}

// ============================================
// MEMBER STATS TYPES
// ============================================

/**
 * Member Stats
 * Based on GET /api/v1/members/stats response
 */
export interface MemberStats {
  total_subscriptions: number;
  active_subscriptions: number;
  expired_subscriptions: number;
  total_payments: number;
  total_spent: number;
  pending_invoices: number;
  check_in_count: number;
}

// ============================================
// NOTIFICATION TYPES (Synthetic)
// ============================================

/**
 * Synthetic Notification
 * Generated from existing API data (subscriptions, payments, profile)
 * Stored in localStorage for read status
 */
export interface SyntheticNotification {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  link?: string;
  createdAt: string;
  category: "subscription" | "payment" | "achievement" | "system";
}

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Standard API response
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ============================================
// FORM/UPDATE DTOs
// ============================================

/**
 * Update member profile DTO
 * PUT /api/v1/members
 */
export interface UpdateMemberDto {
  date_of_birth?: string; // ⭐ Will update user.date_of_birth
  address?: string; // ⭐ Will update user.address
}

/**
 * Initialize payment DTO
 * POST /api/v1/payments/paystack/initialize
 */
export interface InitializePaymentDto {
  email: string;
  amount: number;
  planId?: string;
  subscriptionId?: string;
}

/**
 * Change subscription plan DTO
 * POST /api/v1/subscriptions/members/:id/change-plan
 */
export interface ChangeSubscriptionPlanDto {
  newPlanId: string;
  metadata?: Record<string, unknown>;
}

// ============================================
// UI-SPECIFIC TYPES (For Components)
// ============================================

/**
 * Flattened subscription for UI display
 * Combines subscription + plan data for easier rendering
 */
export interface SubscriptionDisplay {
  id: string;
  organizationId: string;
  organizationName: string; // ⚠️ Needs to be fetched separately or passed in
  organizationLogo?: string; // ⚠️ Not in API response
  planId: string;
  planName: string;
  planPrice: number;
  planInterval: string;
  planCurrency: string;
  status: "active" | "expired" | "canceled" | "pending";
  features: string[];
  autoRenew: boolean;
  startedAt: string;
  expiresAt: string;
  nextBillingDate?: string;
  canceledAt?: string | null;
  createdAt: string;
}

/**
 * Flattened payment for UI display
 */
export interface PaymentDisplay {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  paymentMethod: string;
  reference: string;
  organizationName: string; // ⚠️ Needs to be fetched separately
  planName: string;
  description: string;
  receiptUrl?: string; // ⚠️ Not in API - might need to be generated
  createdAt: string;
}

// ============================================
// HELPER TYPE GUARDS
// ============================================

export const isMemberSubscription = (
  obj: unknown
): obj is MemberSubscription => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "member_id" in obj &&
    "plan_id" in obj
  );
};

export const isMemberPayment = (obj: unknown): obj is MemberPayment => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "amount" in obj &&
    "provider_reference" in obj
  );
};

// ============================================
// NOTES ON MISSING FEATURES
// ============================================

/*
 * ⚠️ FEATURES NOT IN API (Referenced in old components but don't exist):
 * 
 * 1. WALLET - No wallet system
 *    - Old types: Wallet, Transaction
 *    - Components expect: balance, accountNumber, bankName, etc.
 *    - Action: Remove wallet-related components or mock the data
 * 
 * 2. CHECK-IN - No check-in system
 *    - Old types: CheckIn
 *    - Components expect: code, qrCode, expiresAt, etc.
 *    - Action: Remove check-in components or wait for backend
 * 
 * 3. NOTIFICATIONS - ✅ IMPLEMENTED AS SYNTHETIC
 *    - Using SyntheticNotification type
 *    - Generated from subscriptions, payments, profile data
 *    - Read status tracked in localStorage
 *    - See: hooks/memberHook/useSyntheticNotifications.ts
 * 
 * 4. REFERRALS - No referral system
 *    - Old types: Referral, ReferredMember
 *    - Components expect: code, qrCode, referredMembers, etc.
 *    - Action: Remove referral components or wait for backend
 * 
 * 5. PAUSE/RESUME - Not in subscription endpoints
 *    - Components expect: pauseSubscription(), resumeSubscription()
 *    - Available: cancelSubscription(), renewSubscription()
 *    - Action: Update components to use cancel/renew instead
 */
