import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberApi } from '@/lib/memberAPI/memberAPI';
import { Member, Subscription, Wallet, Transaction, Payment, CheckIn, Notification, Referral } from '@/types/memberTypes/member';

// Profile hooks
export const useProfile = () => {
  return useQuery<Member, Error>({
    queryKey: ['member', 'profile'],
    queryFn: memberApi.getProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Member>) => memberApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', 'profile'] });
    },
  });
};

// Subscription hooks
export const useSubscriptions = () => {
  return useQuery<Subscription[], Error>({
    queryKey: ['member', 'subscriptions'],
    queryFn: memberApi.getSubscriptions,
  });
};

export const useSubscription = (id: string) => {
  return useQuery<Subscription, Error>({
    queryKey: ['member', 'subscriptions', id],
    queryFn: () => memberApi.getSubscription(id),
    enabled: !!id,
  });
};

export const usePauseSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => memberApi.pauseSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', 'subscriptions'] });
    },
  });
};

export const useResumeSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => memberApi.resumeSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', 'subscriptions'] });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => memberApi.cancelSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', 'subscriptions'] });
    },
  });
};

export const useUpgradeSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, planId }: { id: string; planId: string }) => 
      memberApi.upgradeSubscription(id, planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', 'subscriptions'] });
    },
  });
};

// Wallet hooks
export const useWallet = () => {
  return useQuery<Wallet, Error>({
    queryKey: ['member', 'wallet'],
    queryFn: memberApi.getWallet,
  });
};

export const useCreateWallet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: memberApi.createWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', 'wallet'] });
    },
  });
};

export const useTopUpWallet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ amount, method }: { amount: number; method: 'card' | 'transfer' }) =>
      memberApi.topUpWallet(amount, method),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', 'wallet'] });
      queryClient.invalidateQueries({ queryKey: ['member', 'transactions'] });
    },
  });
};

export const useTransactions = () => {
  return useQuery<Transaction[], Error>({
    queryKey: ['member', 'transactions'],
    queryFn: memberApi.getTransactions,
  });
};

// Payment hooks
export const usePayments = () => {
  return useQuery<Payment[], Error>({
    queryKey: ['member', 'payments'],
    queryFn: memberApi.getPayments,
  });
};

// Check-in hooks
export const useGenerateCheckInCode = () => {
  return useMutation({
    mutationFn: (subscriptionId: string) => memberApi.generateCheckInCode(subscriptionId),
  });
};

// Notification hooks
export const useNotifications = () => {
  return useQuery<Notification[], Error>({
    queryKey: ['member', 'notifications'],
    queryFn: memberApi.getNotifications,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => memberApi.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', 'notifications'] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: memberApi.markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', 'notifications'] });
    },
  });
};

// Referral hooks
export const useReferral = () => {
  return useQuery<Referral, Error>({
    queryKey: ['member', 'referral'],
    queryFn: memberApi.getReferral,
  });
};

export const useReferredMembers = () => {
  return useQuery({
    queryKey: ['member', 'referral', 'members'],
    queryFn: memberApi.getReferredMembers,
  });
};