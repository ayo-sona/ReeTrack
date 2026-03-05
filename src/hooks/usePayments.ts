import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  paymentsApi,
  InitializePaymentDto,
} from "../lib/organizationAPI/paymentsApi";
import apiClient from "../lib/apiClient"; // adjust path if your apiClient lives elsewhere

// ─── Existing hooks (unchanged) ───────────────────────────────────────────────

export const usePayments = (
  page: number = 1,
  limit: number = 10,
  status?: string,
) => {
  if (status === "all") status = undefined;
  return useQuery({
    queryKey: ["payments", page, limit, status],
    queryFn: () => paymentsApi.getAll(page, limit, status),
  });
};

export const usePayment = (id: string) => {
  return useQuery({
    queryKey: ["payments", id],
    queryFn: () => paymentsApi.getById(id),
    enabled: !!id,
  });
};

export const usePaymentStats = () => {
  return useQuery({
    queryKey: ["payments", "stats"],
    queryFn: () => paymentsApi.getStats(),
  });
};

export const useMemberPayments = (
  memberId: string,
  page: number = 1,
  limit: number = 10,
) => {
  return useQuery({
    queryKey: ["payments", "member", memberId, page, limit],
    queryFn: () => paymentsApi.getMemberPayments(memberId, page, limit),
    enabled: !!memberId,
  });
};

export const useInitializePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InitializePaymentDto) => paymentsApi.initialize(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};

// ─── UPDATED: useVerifyPayment ─────────────────────────────────────────────
// Kept as a mutation because your backend's verify is a POST, not a GET.
// On the verify callback page, call mutate(reference) inside a useEffect
// that fires once on mount. onSuccess invalidates everything that
// changes after a successful payment.
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reference: string) => paymentsApi.verify(reference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
};

// ─── New hooks ────────────────────────────────────────────────────────────────

// Step 1 of checkout: creates the subscription and auto-generates an invoice.
// The returned data contains the invoiceId you pass to useInitializePayment.
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      organizationId,
      planId,
      metadata = {},
    }: {
      organizationId: string;
      planId: string;
      metadata?: object;
    }) => {
      const response = await apiClient.post(
        `/subscriptions/members/subscribe/${organizationId}`,
        { planId, metadata },
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

// All invoices for the currently logged-in member
export const useInvoices = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await apiClient.get("/invoices/member");
      return response.data.data;
    },
  });
};

// Single invoice — used on the invoice detail / Pay Now page
export const useInvoiceById = (invoiceId: string) => {
  return useQuery({
    queryKey: ["invoices", invoiceId],
    queryFn: async () => {
      const response = await apiClient.get(`/invoices/member/${invoiceId}`);
      return response.data.data;
    },
    enabled: !!invoiceId,
  });
};