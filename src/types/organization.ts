// types/organization.ts
import { Currency, PaymentGateway } from "./common";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  logo?: string;
  logo_url?: string | null;
  logo_public_id?: string | null;
  images?: string[] | null; // ✅ facility images
  website?: string;
  created_at: string;
}

export interface PlanFeature {
  id: string;
  name: string;
  description?: string;
  included: boolean;
}

export type PlanDuration = "weekly" | "monthly" | "quarterly" | "yearly";
export type PlanVisibility = "public" | "invite_only" | "private";

export interface SubscriptionPlan {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  price: number;
  currency: Currency;
  duration: PlanDuration;
  features: PlanFeature[];
  visibility?: PlanVisibility;
  isActive: boolean;
  memberCount?: number;
  subscriptions?: [
    {
      id: string;
      status: string;
      expires_at: string;
      member: { id: string; created_at: string; user: Member["user"] };
    },
  ];
  createdAt: string;
  updatedAt: string;
}

export type MemberStatus = "active" | "inactive";
export type MembershipType = "self_signup" | "manual_add" | "invite";

export interface Member {
  id: string;
  organization_user_id: string;
  user_id: string;
  date_of_birth: string;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  medical_notes: string | null;
  check_in_count: number;
  check_in_code: string;
  checked_in_at: string[] | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  organization_user?: OrganizationUser;

  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    date_of_birth?: string | null;
    address?: string | null;
    status: "active" | "inactive";
    email_verified: boolean;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
    avatar_url: string | null;        // ✅ snake_case — members API
    avatar_public_id: string | null;
  };

  subscriptions: Array<{
    id: string;
    member_id: string;
    plan_id: string;
    organization_id: string;
    status: "active" | "expired" | "cancelled" | "pending";
    started_at: string;
    expires_at: string;
    canceled_at: string | null;
    auto_renew: boolean;
    metadata: unknown;
    created_at: string;
    updated_at: string;
    plan: {
      id: string;
      organization_id: string;
      name: string;
      description: string;
      price: number;
      currency: string;
      interval: string;
      interval_count: number;
      features: {
        features: string[];
      };
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
  }>;
}

export type MembersResponse = PaginatedResponse<Member>;

export type PaymentMethod = "card" | "bank_transfer" | "ussd";
export type PaymentStatus = "success" | "pending" | "failed" | "refunded";
export type PaymentProvider = PaymentGateway;

export interface Payment {
  id: string;
  plan_name: string;
  payer_user: {
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    avatar_url?: string | null;
  };
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  provider: PaymentProvider;
  provider_reference: string;
  description: string;
  is_auto_renewal: boolean;
  created_at: string;
}

export type ReminderType =
  | "payment_due"
  | "subscription_expiring"
  | "payment_failed"
  | "welcome";
export type ReminderStatus = "pending" | "sent" | "failed";
export type ReminderChannel = "email" | "sms" | "whatsapp";

export interface PaymentReminder {
  id: string;
  payer_user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  type: ReminderType;
  status: ReminderStatus;
  channels: ReminderChannel[];
  scheduled_for: string;
  sent_at?: string;
  message: string;
}

export interface ReminderTemplate {
  id: string;
  type: ReminderType;
  subject: string;
  message: string;
  channels: ReminderChannel[];
  is_active: boolean;
}

export interface AutomatedReminderSettings {
  enabled: boolean;
  days_before_expiry: number;
  channels: ReminderChannel[];
  template_id?: string;
}

export type ExportFormat = "csv" | "pdf" | "excel";
export type ExportType = "members" | "payments" | "revenue" | "plans";

export interface ExportRequest {
  type: ExportType;
  format: ExportFormat;
  dateRange?: {
    from: string;
    to: string;
  };
  filters?: {
    status?: MemberStatus;
    plan_id?: string;
  };
  columns?: string[];
}

export interface OrganizationAnalytics {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  expiredMembers: number;
  newMembersThisMonth: number;
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  averageRevenuePerMember: number;
}

export interface MemberGrowth {
  month: string;
  newMembers: number;
  totalMembers: number;
  active: number;
  inactive: number;
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
  previous_year?: number;
  member_count: number;
}

export interface PlanDistribution {
  plan_id: string;
  plan_name: string;
  member_count: number;
  revenue: number;
  percentage: number;
}

export type NotificationType =
  | "new_member"
  | "payment_received"
  | "payment_failed"
  | "subscription_expiring"
  | "subscription_expired"
  | "member_cancelled";

export interface OrganizationNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  member_id?: string;
  member_name?: string;
  read: boolean;
  created_at: string;
  link?: string;
}

export interface MemberSubscription {
  id: string;
  member_id: string;
  plan_id: string;
  organization_id: string;
  status: "active" | "expired" | "cancelled" | "pending";
  started_at: string;
  expires_at: string;
  canceled_at: string | null;
  auto_renew: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  plan: {
    id: string;
    organization_id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: string;
    interval_count: number;
    features: {
      features: string[];
    };
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface OrganizationUser {
  id: string;
  user_id: string;
  organization_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  role: string;
  paystack_authorization_code?: string;
  paystack_card_last4?: string;
  paystack_card_brand?: string;
  paystack_subaccount_code?: string;
  organization?: Organization;
}

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
  subscription?: MemberSubscription;
  member_subscription?: {
    id: string;
    plan_id: string;
    member_id: string;
    organization_id: string;
    status: string;
  };
}

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

export interface MemberStats {
  total_subscriptions: number;
  active_subscriptions: number;
  expired_subscriptions: number;
  total_payments: number;
  total_spent: number;
  pending_invoices: number;
  check_in_count: number;
}

export interface UpdateMemberDto {
  date_of_birth?: string;
  address?: string;
  phone?: string;
}

export interface InitializePaymentDto {
  email: string;
  amount: number;
  planId?: string;
  subscriptionId?: string;
}

export interface SyntheticNotification {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  link?: string;
  createdAt: string;
  category: "subscription" | "payment" | "achievement" | "system";
}

export interface SubscriptionDisplay {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationLogo?: string;
  planId: string;
  planName: string;
  planPrice: number;
  planInterval: string;
  planCurrency: string;
  status: "active" | "expired" | "cancelled" | "pending";
  features: string[];
  autoRenew: boolean;
  startedAt: string;
  expiresAt: string;
  nextBillingDate?: string;
  canceledAt?: string | null;
  createdAt: string;
}

export interface PaymentDisplay {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  paymentMethod: string;
  reference: string;
  organizationName: string;
  planName: string;
  description: string;
  receiptUrl?: string;
  createdAt: string;
}