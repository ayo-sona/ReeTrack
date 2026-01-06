import { PaymentGatewayInterface, PaymentCheckoutParams } from './types';

// Kora type declarations
interface KoraCheckoutOptions {
  amount: number;
  currency: string;
  reference: string;
  customer: {
    email: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

interface KoraInstance {
  checkout: (options: KoraCheckoutOptions) => void;
}

interface KoraSDK {
  initialize: (publicKey: string) => KoraInstance;
}

declare global {
  interface Window {
    Kora: KoraSDK;
  }
}

export class KoraGateway implements PaymentGatewayInterface {
  private publicKey: string;

  constructor(publicKey: string) {
    this.publicKey = publicKey;
  }

  initialize(): void {
    // Load Kora script
    if (typeof window === 'undefined') return;
    
    const script = document.createElement('script');
    script.src = 'https://cdn.korahq.com/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }

  async checkout(params: PaymentCheckoutParams): Promise<void> {
    const kora = window.Kora.initialize(this.publicKey);

    return new Promise((resolve, reject) => {
      kora.checkout({
        amount: params.amount,
        currency: params.currency,
        reference: params.reference,
        customer: {
          email: params.email,
        },
        onClose: () => reject(new Error('Payment cancelled')),
        onSuccess: () => resolve(),
      });
    });
  }

  async verifyPayment(_reference: string): Promise<boolean> {
    // In production, verify on backend
    // For now, mock verification
    return true;
  }
}