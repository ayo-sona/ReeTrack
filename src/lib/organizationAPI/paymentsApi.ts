import apiClient from "../apiClient";

export interface InitializePaymentDto {
  invoiceId: string;
}

export interface Payment {
  id: string;
  payer_user?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  amount: number;
  currency: string;
  status: string;
  reference: string;
  provider: string;
  provider_reference: string;
  description?: string;
  metadata?: Record<string, unknown>;
  invoice: {
    member_subscription: {
      plan: { name: string };
      auto_renew: boolean;
    } | null;
    organization_subscription: {
      plan: { name: string };
      auto_renew: boolean;
    } | null;
  } | null;
  plan_name?: string;
  payment_method?: string;
  payment_provider?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentStats {
  total_member_revenue: number;
  total_expenses: number;
  successful_member_payments: number;
  failed_member_payments: number;
  pending_member_payments: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const paymentsApi = {
  // POST /payments/paystack/initialize — takes { invoiceId }
  initialize: async (data: InitializePaymentDto): Promise<{ authorization_url: string; reference: string }> => {
    const response = await apiClient.post("/payments/paystack/initialize", data);
    return response.data.data;
  },

  getAll: async (
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<PaginatedResponse<Payment>> => {
    const response = await apiClient.get("/payments", {
      params: { page, limit, ...(status ? { status } : {}) },
    });
    const paginated = response.data.data;
    return {
      data: paginated.data ?? [],
      meta: paginated.meta,
    };
  },

  getById: async (id: string): Promise<Payment> => {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data.data;
  },

  getStats: async (): Promise<PaymentStats> => {
    const response = await apiClient.get("/payments/stats");
    return response.data.data;
  },

  getMemberPayments: async (
    memberId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<Payment>> => {
    const response = await apiClient.get(`/payments/member/${memberId}`, {
      params: { page, limit },
    });
    const paginated = response.data.data;
    return {
      data: paginated.data ?? [],
      meta: paginated.meta,
    };
  },

  // GET /payments/paystack/verify/{reference} — NOT a POST
  verify: async (reference: string): Promise<Payment> => {
    const response = await apiClient.get(`/payments/paystack/verify/${reference}`);
    return response.data.data;
  },
};