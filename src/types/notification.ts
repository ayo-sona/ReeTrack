// types/notification.ts

export type NotificationType = 
  | "subscription_expiring"
  | "subscription_expired"
  | "payment_received"
  | "payment_failed"
  | "member_payment_received"
  | "member_joined"
  | "member_left"
  | "check_in_milestone"
  | "thank_you"
  | "system_update";

export interface Notification {
  id: string;
  organization_id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: "low" | "medium" | "high" | "urgent";
  read: boolean;
  created_at: string;
  action_url?: string;
  metadata?: {
    amount?: number;
    member_name?: string;
    member_id?: string;
    subscription_id?: string;
    invoice_id?: string;
    expires_at?: string;
    days_until_expiry?: number;
    payment_method?: string;
    milestone_count?: number;
    plan_name?: string;
    [key: string]: any;
  };
}