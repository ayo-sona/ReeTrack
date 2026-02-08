import { Currency, PaymentGateway } from "./common";

// organization/Business Types
export interface Organization {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  website?: string;
  currency: Currency;
  preferred_gateway: PaymentGateway;
  created_at: string;
  owner_id: string;
}

// Plan Types
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

// Member Types
export type MemberStatus = "active" | "inactive" | "expired";
export type MembershipType = "self_signup" | "manual_add" | "invite";

/// Member type based on ACTUAL API response from /api/v1/members
export interface Member {
  // Core member fields
  id: string;
  organization_user_id: string;
  user_id: string;
  check_in_count: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;

  // Direct user object from API
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    status: "active" | "inactive";
    email_verified: boolean;
    date_of_birth: string | null;
    address: string | null;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
  };

  // Subscriptions array
  subscriptions: Array<{
    id: string;
    member_id: string;
    plan_id: string;
    organization_id: string;
    status: "active" | "expired" | "canceled" | "pending";
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
      features: string[]; // Changed from nested object to array
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
  }>;
}

// Payment Types
export type PaymentMethod = "card" | "bank_transfer" | "ussd";
export type PaymentStatus = "success" | "pending" | "failed" | "refunded";
export type PaymentProvider = PaymentGateway; // Reuse PaymentGateway type

export interface Payment {
  id: string;
  plan_name: string;
  payer_user: {
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
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

// Reminder Types
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

// Export Types
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

// Analytics Types
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

// Notification Types
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