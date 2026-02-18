export interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

export interface SMSOptions {
  to: string;
  message: string;
}

export enum NotificationType {
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  PAYMENT_REMINDER = 'payment_reminder',
  SUBSCRIPTION_CREATED = 'subscription_created',
  SUBSCRIPTION_RENEWED = 'subscription_renewed',
  SUBSCRIPTION_EXPIRING = 'subscription_expiring',
  SUBSCRIPTION_EXPIRED = 'subscription_expired',
  SUBSCRIPTION_CANCELLED = 'subscription_cancelled',
  RENEWAL_FAILED = 'renewal_failed',
  INVOICE_CREATED = 'invoice_created',
  INVOICE_OVERDUE = 'invoice_overdue',
  WELCOME_EMAIL = 'welcome_email',
  REGISTER_MEMBER_EMAIL = 'register_member_email',
  REGISTER_STAFF_EMAIL = 'register_staff_email',
  CUSTOM_EMAIL = 'custom_email',
  PASSWORD_RESET = 'password_reset',
}
