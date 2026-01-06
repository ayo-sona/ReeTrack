export type Currency = 'NGN' | 'USD' | 'GBP' | 'EUR';
export type PaymentGateway = 'paystack' | 'stripe' | 'kora';
export type Theme = 'light' | 'dark';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}