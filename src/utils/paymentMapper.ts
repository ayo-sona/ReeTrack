import { Payment as ApiPayment } from "../lib/organizationAPI/paymentsApi";
import { PaymentStatus, Payment as UiPayment } from "../types/organization";
import { PaymentGateway } from "../types/common";

export const mapApiPaymentToUiPayment = (apiPayment: ApiPayment): UiPayment => {
  const memberPlan = apiPayment.invoice?.member_subscription?.plan;
  const orgPlan = apiPayment.invoice?.organization_subscription?.plan;

  return {
    id: apiPayment.id,
    payer_user: {
      first_name: apiPayment.payer_user?.first_name || "Unknown",
      last_name: apiPayment.payer_user?.last_name || "Unknown",
      email: apiPayment.payer_user?.email || "",
      avatar_url: apiPayment.payer_user?.avatar_url ?? null, 
    },
    amount: apiPayment.amount,
    currency: apiPayment.currency as "NGN" | "USD",
    provider: apiPayment.provider as PaymentGateway,
    status: apiPayment.status as PaymentStatus,
    created_at: apiPayment.created_at,
    description: apiPayment.description || "",
    provider_reference: apiPayment.provider_reference,
    plan_name: memberPlan?.name ?? orgPlan?.name ?? "",
    is_auto_renewal:
      apiPayment.invoice?.member_subscription?.auto_renew ??
      apiPayment.invoice?.organization_subscription?.auto_renew ??
      false,
  };
};

// ✅ Fix: guard against the API returning a paginated object ({ data: [], meta: {} })
// or null/undefined instead of a bare array — which caused the original TypeError
export const mapApiPaymentsToUiPayments = (
  apiPayments: ApiPayment[] | unknown,
): UiPayment[] => {
  if (!Array.isArray(apiPayments)) return [];
  return apiPayments.map(mapApiPaymentToUiPayment);
};