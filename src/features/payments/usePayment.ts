import { useState, useEffect } from "react";
import { Payment, PaymentIntent } from "../../types/payment";
import { paymentAPI } from "./paymentApi";
import { PaymentFactory } from "../../lib/payments/paymentFactory";
import { useAuth } from "../../features/auth/authContext";

export function usePayment() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const data = await paymentAPI.getHistory();
      setPayments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const initiatePayment = async (intent: PaymentIntent) => {
    if (!user) throw new Error("User not authenticated");

    try {
      // Create payment intent on backend
      const { reference } = await paymentAPI.createIntent(intent);

      // Initialize payment gateway
      const gateway = PaymentFactory.createGateway(user.preferredGateway);
      gateway.initialize();

      // Open checkout
      await gateway.checkout({
        amount: intent.amount,
        currency: intent.currency,
        planId: intent.planId,
        billingCycle: intent.billingCycle,
        email: user.email,
        reference,
      });

      // Verify payment
      const verified = await gateway.verifyPayment(reference);

      if (verified) {
        await fetchPayments();
        return { success: true };
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (err) {
      throw err;
    }
  };

  const downloadInvoice = async (paymentId: string) => {
    try {
      const blob = await paymentAPI.downloadInvoice(paymentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      throw err;
    }
  };

  const exportHistory = async (format: "csv" | "pdf") => {
    try {
      const blob = await paymentAPI.exportHistory(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payment-history.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      throw err;
    }
  };

  return {
    payments,
    isLoading,
    error,
    refetch: fetchPayments,
    initiatePayment,
    downloadInvoice,
    exportHistory,
  };
}
