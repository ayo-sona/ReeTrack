import type { Currency, PaymentGateway } from './common';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    businessName: string;
    phone: string;
    country: string;
    currency: Currency;
    preferredGateway: PaymentGateway;
    role: 'organizaiton' | 'owner';
    avatar?: string;
    createdAt: string;
    onboardingCompleted: boolean;
  }