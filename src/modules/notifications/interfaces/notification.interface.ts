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
  SUBSCRIPTION_CREATED = 'subscription_created',
  SUBSCRIPTION_RENEWED = 'subscription_renewed',
  SUBSCRIPTION_EXPIRING = 'subscription_expiring',
  SUBSCRIPTION_EXPIRED = 'subscription_expired',
  SUBSCRIPTION_CANCELED = 'subscription_canceled',
  INVOICE_CREATED = 'invoice_created',
  INVOICE_OVERDUE = 'invoice_overdue',
  WELCOME_EMAIL = 'welcome_email',
}
