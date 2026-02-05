// import apiClient from "@/lib/apiClient";
import {
  Member,
  Subscription,
  Wallet,
  Transaction,
  Payment,
  CheckIn,
  Notification,
  Referral,
  ReferredMember,
} from "@/types/memberTypes/member";

// MOCK DATA (Backend not ready yet)
const MOCK_MEMBER: Member = {
  id: "1",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  phone: "+234 809 457 2345",
  dateOfBirth: "1995-06-15",
  address: "123 Main St, Lagos, Nigeria",
  createdAt: "2024-01-15T00:00:00Z",
  updatedAt: "2024-01-15T00:00:00Z",
};

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "1",
    organizationId: "org1",
    organizationName: "Gold's Gym Lagos",
    planId: "plan1",
    planName: "Premium Monthly",
    planPrice: 25000,
    planInterval: "monthly",
    status: "active",
    currentPeriodStart: "2024-01-01T00:00:00Z",
    currentPeriodEnd: "2024-02-01T00:00:00Z",
    cancelAtPeriodEnd: false,
    features: [
      "Access to all equipment",
      "Free classes",
      "24/7 access",
      "Personal trainer (2 sessions)",
    ],
    autoRenew: true,
    nextBillingDate: "2024-02-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    organizationId: "org2",
    organizationName: "CrossFit Downtown",
    planId: "plan2",
    planName: "Weekly Access",
    planPrice: 8000,
    planInterval: "weekly",
    status: "active",
    currentPeriodStart: "2024-01-20T00:00:00Z",
    currentPeriodEnd: "2024-01-27T00:00:00Z",
    cancelAtPeriodEnd: false,
    features: ["CrossFit classes", "Nutrition coaching", "Community access"],
    autoRenew: true,
    nextBillingDate: "2024-01-27T00:00:00Z",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "3",
    organizationId: "org3",
    organizationName: "Yoga Studio Peace",
    planId: "plan3",
    planName: "Monthly Unlimited",
    planPrice: 15000,
    planInterval: "monthly",
    status: "paused",
    currentPeriodStart: "2023-12-01T00:00:00Z",
    currentPeriodEnd: "2024-01-01T00:00:00Z",
    cancelAtPeriodEnd: false,
    features: [
      "Unlimited yoga classes",
      "Meditation sessions",
      "Wellness workshops",
    ],
    autoRenew: false,
    createdAt: "2023-12-01T00:00:00Z",
    updatedAt: "2023-12-15T00:00:00Z",
  },
];

const MOCK_WALLET: Wallet = {
  id: "wallet1",
  balance: 45000,
  currency: "NGN",
  accountNumber: "1234567890",
  accountName: "John Doe - ReeTrack",
  bankName: "Wema Bank (ReeTrack)",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-25T00:00:00Z",
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "txn1",
    type: "credit",
    amount: 50000,
    currency: "NGN",
    description: "Wallet top-up via bank transfer",
    reference: "TXN-2024-001",
    status: "success",
    balanceBefore: 0,
    balanceAfter: 50000,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "txn2",
    type: "debit",
    amount: 25000,
    currency: "NGN",
    description: "Payment for Gold's Gym - Premium Monthly",
    reference: "TXN-2024-002",
    status: "success",
    balanceBefore: 50000,
    balanceAfter: 25000,
    subscriptionId: "1",
    createdAt: "2024-01-16T14:30:00Z",
  },
  {
    id: "txn3",
    type: "credit",
    amount: 20000,
    currency: "NGN",
    description: "Wallet top-up via card",
    reference: "TXN-2024-003",
    status: "success",
    balanceBefore: 25000,
    balanceAfter: 45000,
    createdAt: "2024-01-20T09:15:00Z",
  },
];

const MOCK_PAYMENTS: Payment[] = [
  {
    id: "pay1",
    subscriptionId: "1",
    organizationName: "Gold's Gym Lagos",
    planName: "Premium Monthly",
    amount: 25000,
    currency: "NGN",
    status: "success",
    paymentMethod: "wallet",
    reference: "PAY-2024-001",
    receiptUrl: "/receipts/pay1.pdf",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "pay2",
    subscriptionId: "2",
    organizationName: "CrossFit Downtown",
    planName: "Weekly Access",
    amount: 8000,
    currency: "NGN",
    status: "success",
    paymentMethod: "wallet",
    reference: "PAY-2024-002",
    receiptUrl: "/receipts/pay2.pdf",
    createdAt: "2024-01-20T00:00:00Z",
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif1",
    title: "Payment Successful",
    message: "Your payment of ₦25,000 for Premium Monthly was successful",
    type: "success",
    read: false,
    link: "/member/payments/pay1",
    createdAt: "2024-01-25T10:00:00Z",
  },
  {
    id: "notif2",
    title: "Subscription Renewing Soon",
    message: "Your Premium Monthly subscription renews in 3 days",
    type: "info",
    read: false,
    createdAt: "2024-01-24T09:00:00Z",
  },
  {
    id: "notif3",
    title: "New Class Available",
    message: "CrossFit Downtown added a new morning class at 6 AM",
    type: "info",
    read: true,
    link: "/member/subscriptions/2",
    createdAt: "2024-01-23T08:00:00Z",
  },
];

const MOCK_REFERRAL: Referral = {
  id: "ref1",
  code: "JOHN123",
  referredMembers: 5,
  totalEarnings: 12500,
  currency: "NGN",
  qrCode: "data:image/png;base64,mock-qr-code",
  shareUrl: "https://ReeTrack.com/join/JOHN123",
};

const MOCK_REFERRED_MEMBERS: ReferredMember[] = [
  {
    id: "refmem1",
    name: "Alice Johnson",
    email: "alice@example.com",
    status: "active",
    reward: 2500,
    joinedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "refmem2",
    name: "Bob Smith",
    email: "bob@example.com",
    status: "active",
    reward: 2500,
    joinedAt: "2024-01-15T00:00:00Z",
  },
];

// Member API (will use real endpoints when backend is ready)
export const memberApi = {
  // Profile
  getProfile: async (): Promise<Member> => {
    // TODO: Replace with real API call
    // const response = await apiClient.get('/members/me/profile');
    // return response.data.data;
    return new Promise((resolve) =>
      setTimeout(() => resolve(MOCK_MEMBER), 500),
    );
  },

  updateProfile: async (data: Partial<Member>): Promise<Member> => {
    // TODO: Replace with real API call
    return new Promise((resolve) =>
      setTimeout(() => resolve({ ...MOCK_MEMBER, ...data }), 500),
    );
  },

  // Subscriptions
  getSubscriptions: async (): Promise<Subscription[]> => {
    // TODO: Replace with real API call
    return new Promise((resolve) =>
      setTimeout(() => resolve(MOCK_SUBSCRIPTIONS), 500),
    );
  },

  getSubscription: async (id: string): Promise<Subscription> => {
    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === id);
    return new Promise((resolve, reject) =>
      setTimeout(
        () =>
          sub ? resolve(sub) : reject(new Error("Subscription not found")),
        500,
      ),
    );
  },

  pauseSubscription: async (id: string): Promise<Subscription> => {
    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === id);
    return new Promise((resolve) =>
      setTimeout(() => resolve({ ...sub!, status: "paused" as const }), 500),
    );
  },

  resumeSubscription: async (id: string): Promise<Subscription> => {
    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === id);
    return new Promise((resolve) =>
      setTimeout(() => resolve({ ...sub!, status: "active" as const }), 500),
    );
  },

  cancelSubscription: async (id: string): Promise<Subscription> => {
    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === id);
    return new Promise((resolve) =>
      setTimeout(() => resolve({ ...sub!, cancelAtPeriodEnd: true }), 500),
    );
  },

  upgradeSubscription: async (
    id: string,
    planId: string,
  ): Promise<Subscription> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(MOCK_SUBSCRIPTIONS[0]), 500),
    );
  },

  // Wallet
  getWallet: async (): Promise<Wallet> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(MOCK_WALLET), 500),
    );
  },

  createWallet: async (): Promise<Wallet> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(MOCK_WALLET), 500),
    );
  },

  topUpWallet: async (
    amount: number,
    method: "card" | "transfer",
  ): Promise<Transaction> => {
    const newTxn: Transaction = {
      id: `txn${Date.now()}`,
      type: "credit",
      amount,
      currency: "NGN",
      description: `Wallet top-up via ${method}`,
      reference: `TXN-${Date.now()}`,
      status: "success",
      balanceBefore: MOCK_WALLET.balance,
      balanceAfter: MOCK_WALLET.balance + amount,
      createdAt: new Date().toISOString(),
    };
    return new Promise((resolve) => setTimeout(() => resolve(newTxn), 500));
  },

  getTransactions: async (): Promise<Transaction[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(MOCK_TRANSACTIONS), 500),
    );
  },

  // Payments
  getPayments: async (): Promise<Payment[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(MOCK_PAYMENTS), 500),
    );
  },

  downloadReceipt: async (paymentId: string): Promise<Blob> => {
    // TODO: Replace with real API call
    return new Promise((resolve) => setTimeout(() => resolve(new Blob()), 500));
  },

  // Check-in
  generateCheckInCode: async (subscriptionId: string): Promise<CheckIn> => {
    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === subscriptionId);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const checkIn: CheckIn = {
      id: `checkin${Date.now()}`,
      code,
      qrCode: `data:image/png;base64,mock-qr-${code}`,
      organizationId: sub!.organizationId,
      organizationName: sub!.organizationName,
      subscriptionId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    return new Promise((resolve) => setTimeout(() => resolve(checkIn), 500));
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(MOCK_NOTIFICATIONS), 500),
    );
  },

  markNotificationRead: async (id: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => resolve(), 300));
  },

  markAllNotificationsRead: async (): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => resolve(), 300));
  },

  // Referrals
  getReferral: async (): Promise<Referral> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(MOCK_REFERRAL), 500),
    );
  },

  getReferredMembers: async (): Promise<ReferredMember[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(MOCK_REFERRED_MEMBERS), 500),
    );
  },
};
