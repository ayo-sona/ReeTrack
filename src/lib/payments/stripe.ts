import { PaymentGatewayInterface, PaymentCheckoutParams } from './types';

export class StripeGateway implements PaymentGatewayInterface {
  private publicKey: string;

  constructor(publicKey: string) {
    this.publicKey = publicKey;
  }

  initialize(): void {
    // Load Stripe script
    if (typeof window === 'undefined') return;
    
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    document.body.appendChild(script);
  }

  async checkout(params: PaymentCheckoutParams): Promise<void> {
    const stripe = window.Stripe(this.publicKey);

    // In production, create checkout session on backend
    // Then redirect to Stripe checkout
    console.log('Stripe checkout:', params);
    
    // Mock for now
    return Promise.resolve();
  }

  async verifyPayment(reference: string): Promise<boolean> {
    return true;
  }
}