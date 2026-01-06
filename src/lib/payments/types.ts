import { Currency, PaymentGateway } from '../../types/common';
import { PlanId, BillingCycle } from '../../types/subscription';

export interface PaymentGatewayConfig {
  name: string;
  publicKey: string;
  supportedCurrencies: Currency[];
  supportedCountries: string[];
}

export interface PaymentCheckoutParams {
  amount: number;
  currency: Currency;
  planId: PlanId;
  billingCycle: BillingCycle;
  email: string;
  reference: string;
}

export interface PaymentGatewayInterface {
  initialize(): void;
  checkout(params: PaymentCheckoutParams): Promise<void>;
  verifyPayment(reference: string): Promise<boolean>;
}