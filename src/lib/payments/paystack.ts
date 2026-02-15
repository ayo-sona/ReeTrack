// import { PaymentGatewayInterface, PaymentCheckoutParams } from './types';

// // Paystack type declarations
// interface PaystackResponse {
//   reference: string;
//   status: string;
//   trans: string;
//   transaction: string;
//   message: string;
//   trxref: string;
// }

// interface PaystackOptions {
//   key: string;
//   email: string;
//   amount: number;
//   currency: string;
//   ref: string;
//   metadata?: Record<string, unknown>;
//   onClose: () => void;
//   callback: (response: PaystackResponse) => void;
// }

// interface PaystackHandler {
//   openIframe: () => void;
// }

// interface PaystackPop {
//   setup: (options: PaystackOptions) => PaystackHandler;
// }

// declare global {
//   interface Window {
//     PaystackPop: PaystackPop;
//   }
// }

// export class PaystackGateway implements PaymentGatewayInterface {
//   private publicKey: string;

//   constructor(publicKey: string) {
//     this.publicKey = publicKey;
//   }

//   initialize(): void {
//     // Load Paystack script
//     if (typeof window === 'undefined') return;

//     const script = document.createElement('script');
//     script.src = 'https://js.paystack.co/v2/inline.js';
//     script.async = true;
//     document.body.appendChild(script);
//   }

//   async checkout(params: PaymentCheckoutParams): Promise<void> {
//     return new Promise((resolve, reject) => {
//       const handler = window.PaystackPop.setup({
//         key: this.publicKey,
//         email: params.email,
//         amount: params.amount * 100, // Convert to kobo
//         currency: params.currency,
//         ref: params.reference,
//         metadata: {
//           planId: params.planId,
//           billingCycle: params.billingCycle,
//         },
//         onClose: () => {
//           reject(new Error('Payment cancelled'));
//         },
//         callback: (_response: PaystackResponse) => {
//           // Payment successful, response contains transaction details
//           resolve();
//         },
//       });

//       handler.openIframe();
//     });
//   }

//   async verifyPayment(_reference: string): Promise<boolean> {
//     // In production, verify on backend
//     // For now, mock verification
//     return true;
//   }
// }
