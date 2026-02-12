import { PaymentGateway } from "../../types/common";
import { PaymentGatewayInterface } from "./types";
import { PaystackGateway } from "./paystack";
import { StripeGateway } from "./stripe";
import { KoraGateway } from "./kora";

// TODO: Move to environment variables
const GATEWAY_KEYS: Record<Exclude<PaymentGateway, "other">, string> = {
  paystack: "pk_test_your_paystack_key",
  stripe: "pk_test_your_stripe_key",
  kora: "pk_test_your_kora_key",
};

export class PaymentFactory {
  static createGateway(gateway: PaymentGateway): PaymentGatewayInterface {
    // Handle manual payments separately
    if (gateway === "other") {
      throw new Error("Manual payments do not require a payment gateway");
    }

    const publicKey = GATEWAY_KEYS[gateway];

    switch (gateway) {
      case "paystack":
        return new PaystackGateway(publicKey);
      case "stripe":
        return new StripeGateway(publicKey);
      case "kora":
        return new KoraGateway(publicKey);
      default:
        throw new Error(`Unsupported payment gateway: ${gateway}`);
    }
  }
}
