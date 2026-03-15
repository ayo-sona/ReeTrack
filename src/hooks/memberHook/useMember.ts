import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { memberApi } from "@/lib/memberAPI/memberAPI";
import type {
  Member,
  MemberSubscription,
  MemberPayment,
  MemberInvoice,
  InvoiceStats,
  MemberStats,
  UpdateMemberDto,
  InitializePaymentDto,
  PaginatedResponse,
} from "@/types/organization";

// ============================================
// TYPE DEFINITIONS FOR API RESPONSES
// ============================================

interface MemberWithSubscriptions {
  id: string;
  subscriptions?: MemberSubscription[];
}

interface SubscriptionApiResponse {
  data: MemberWithSubscriptions[];
}

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
  email_verified: boolean;
  date_of_birth: string | null;
  address: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// PROFILE HOOKS
// ============================================

export const useProfile = () => {
  return useQuery<UserProfile, Error>({
    queryKey: ["member", "profile"],
    queryFn: memberApi.getProfile,
    retry: 1,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMemberDto) => memberApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", "profile"] });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: memberApi.deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member"] });
    },
  });
};

export const useMemberStats = () => {
  return useQuery<MemberStats, Error>({
    queryKey: ["member", "stats"],
    queryFn: memberApi.getStats,
    retry: 1,
  });
};

export const useMemberOrgs = () => {
  return useQuery<Member[], Error>({
    queryKey: ["member", "orgs"],
    queryFn: memberApi.getMemberOrgs,
    retry: 1,
  });
};

// ============================================
// SUBSCRIPTION HOOKS
// ============================================

export const useMySubscription = () => {
  return useQuery<SubscriptionApiResponse | MemberWithSubscriptions[], Error>({
    queryKey: ["member", "subscription", "current"],
    queryFn: memberApi.getMySubscription,
    retry: 1,
  });
};

/**
 * Get single subscription by ID
 * GET /api/v1/subscriptions/member/:subscriptionId
 */
export const useSubscription = (subscriptionId: string) => {
  return useQuery({
    queryKey: ["member", "subscription", subscriptionId],
    queryFn: () => memberApi.getSubscriptionById(subscriptionId),
    enabled: !!subscriptionId,
    retry: 1,
  });
};

export const useSubscriptions = (
  page: number = 1,
  limit: number = 10,
  status?: string,
) => {
  return useQuery<PaginatedResponse<MemberSubscription>, Error>({
    queryKey: ["member", "subscriptions", page, limit, status],
    queryFn: () => memberApi.getSubscriptions(page, limit, status),
    placeholderData: keepPreviousData,
    retry: 1,
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) =>
      memberApi.cancelSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", "subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["member", "subscription"] });
      queryClient.invalidateQueries({ queryKey: ["member", "stats"] });
    },
  });
};

export const useReactivateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) =>
      memberApi.reactivateSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", "subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["member", "subscription"] });
      queryClient.invalidateQueries({ queryKey: ["member", "stats"] });
    },
  });
};

export const useRenewSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) =>
      memberApi.renewSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", "subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["member", "subscription"] });
      queryClient.invalidateQueries({ queryKey: ["member", "stats"] });
    },
  });
};

export const useChangeSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subscriptionId,
      newPlanId,
    }: {
      subscriptionId: string;
      newPlanId: string;
    }) => memberApi.changeSubscriptionPlan(subscriptionId, newPlanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", "subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["member", "subscription"] });
      queryClient.invalidateQueries({ queryKey: ["member", "stats"] });
    },
  });
};

// ============================================
// PAYMENT HOOKS
// ============================================

export const usePayments = (page: number = 1, limit: number = 10) => {
  return useQuery<PaginatedResponse<MemberPayment>, Error>({
    queryKey: ["member", "payments", page, limit],
    queryFn: () => memberApi.getPayments(page, limit),
    placeholderData: keepPreviousData,
    retry: 1,
  });
};

export const useInitializePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InitializePaymentDto) =>
      memberApi.initializePayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", "payments"] });
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reference: string) => memberApi.verifyPayment(reference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", "payments"] });
      queryClient.invalidateQueries({ queryKey: ["member", "subscriptions"] });
    },
  });
};

// ============================================
// INVOICE HOOKS
// ============================================

export const useInvoices = (
  page: number = 1,
  limit: number = 5,
  status?: "pending" | "paid" | "cancelled" | "failed",
) => {
  return useQuery<PaginatedResponse<MemberInvoice>, Error>({
    queryKey: ["member", "invoices", page, limit, status],
    queryFn: () => memberApi.getInvoices(page, limit, status),
    placeholderData: keepPreviousData,
    retry: 1,
  });
};

export const useInvoiceStats = () => {
  return useQuery<InvoiceStats, Error>({
    queryKey: ["member", "invoices", "stats"],
    queryFn: memberApi.getInvoiceStats,
    retry: 1,
  });
};

export const useOverdueInvoices = () => {
  return useQuery<MemberInvoice[], Error>({
    queryKey: ["member", "invoices", "overdue"],
    queryFn: memberApi.getOverdueInvoices,
    retry: 1,
  });
};

export const useInvoice = (invoiceId: string) => {
  return useQuery<MemberInvoice, Error>({
    queryKey: ["member", "invoices", invoiceId],
    queryFn: () => memberApi.getInvoiceById(invoiceId),
    enabled: !!invoiceId,
    retry: 1,
  });
};

export const useMarkInvoiceAsPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invoiceId: string) => memberApi.markInvoiceAsPaid(invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", "invoices"] });
    },
  });
};

export const useCancelInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invoiceId: string) => memberApi.cancelInvoice(invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", "invoices"] });
    },
  });
};

// ============================================
// HELPER HOOKS FOR DATA TRANSFORMATION
// ============================================

const normalizeSubscriptionResponse = (
  response: SubscriptionApiResponse | MemberWithSubscriptions[] | undefined,
): MemberWithSubscriptions[] => {
  if (!response) return [];
  if ("data" in response && Array.isArray(response.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
};

export const useAllSubscriptions = () => {
  const { data: rawResponse, isLoading, error, ...rest } = useMySubscription();
  const memberData = normalizeSubscriptionResponse(rawResponse);
  const flattenedSubscriptions = memberData.flatMap(
    (member) => member.subscriptions?.filter((sub) => sub.plan) || [],
  );
  return { data: flattenedSubscriptions, isLoading, error, ...rest };
};

export const useActiveSubscriptions = () => {
  const { data: rawResponse, isLoading, error, ...rest } = useMySubscription();
  const memberData = normalizeSubscriptionResponse(rawResponse);
  const activeSubscriptions = memberData.flatMap(
    (member) =>
      member.subscriptions?.filter(
        (sub) => sub.plan && sub.status === "active",
      ) || [],
  );
  return { data: activeSubscriptions, isLoading, error, ...rest };
};

export const useAllPayments = () => {
  const { data, ...rest } = usePayments(1, 100);
  return { data: data?.data ?? [], meta: data?.meta, ...rest };
};

// ============================================
// EXPORT ALL HOOKS
// ============================================

const memberHooks = {
  // Profile
  useProfile,
  useUpdateProfile,
  useDeleteMember,
  useMemberStats,

  // Subscriptions
  useMySubscription,
  useSubscription,
  useSubscriptions,
  useCancelSubscription,
  useReactivateSubscription,
  useRenewSubscription,
  useChangeSubscriptionPlan,
  useAllSubscriptions,
  useActiveSubscriptions,

  // Payments
  usePayments,
  useInitializePayment,
  useVerifyPayment,
  useAllPayments,

  // Invoices
  useInvoices,
  useInvoiceStats,
  useOverdueInvoices,
  useInvoice,
  useMarkInvoiceAsPaid,
  useCancelInvoice,
};

export default memberHooks;