export type NotificationType = 
  | 'payment_success'
  | 'payment_failed'
  | 'subscription_renewed'
  | 'subscription_cancelled'
  | 'plan_upgraded'
  | 'plan_downgraded'
  | 'limit_warning'
  | 'trial_ending'
  | 'feature_announcement';

export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'in_app';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
  channels: NotificationChannel[];
}