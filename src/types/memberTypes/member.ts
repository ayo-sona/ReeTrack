// Member Portal Types

export interface Member {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  dateOfBirth: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationLogo?: string;
  planId: string;
  planName: string;
  planPrice: number;
  planInterval: "daily" | "weekly" | "monthly" | "yearly";
  status: "active" | "paused" | "expired" | "canceled";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  features: string[];
  autoRenew: boolean;
  nextBillingDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  balance: number;
  currency: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  currency: string;
  description: string;
  reference: string;
  status: "pending" | "success" | "failed";
  balanceBefore: number;
  balanceAfter: number;
  subscriptionId?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  subscriptionId: string;
  organizationName: string;
  planName: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  paymentMethod: "wallet" | "card" | "transfer";
  reference: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface CheckIn {
  id: string;
  code: string;
  qrCode: string;
  organizationId: string;
  organizationName: string;
  subscriptionId: string;
  expiresAt: string;
  usedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Referral {
  id: string;
  code: string;
  referredMembers: number;
  totalEarnings: number;
  currency: string;
  qrCode: string;
  shareUrl: string;
}

export interface ReferredMember {
  id: string;
  name: string;
  email: string;
  status: "pending" | "active";
  reward: number;
  joinedAt: string;
}
