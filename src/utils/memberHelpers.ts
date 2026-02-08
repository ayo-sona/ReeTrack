import type {
    Member,
    MemberSubscription,
    MemberPayment,
    SubscriptionDisplay,
    PaymentDisplay,
  } from "@/types/memberTypes/member";
  
  // ============================================
  // DATA TRANSFORMATION HELPERS
  // ============================================
  
  /**
   * Transform Member API response to flat format for UI
   */
  export const transformMemberForUI = (member: Member) => {
    return {
      id: member.id,
      email: member.user.email,
      firstName: member.user.first_name,
      lastName: member.user.last_name,
      phone: member.user.phone,
      dateOfBirth: member.user.date_of_birth, // ⭐ From user table
      address: member.user.address, // ⭐ From user table
      status: member.user.status,
      checkInCount: member.check_in_count,
      createdAt: member.created_at,
      updatedAt: member.updated_at,
    };
  };
  
  /**
   * Transform MemberSubscription to SubscriptionDisplay for UI
   * Note: organizationName and logo need to be fetched separately or passed in
   */
  export const transformSubscriptionForUI = (
    subscription: MemberSubscription,
    organizationName?: string,
    organizationLogo?: string
  ): SubscriptionDisplay => {
    return {
      id: subscription.id,
      organizationId: subscription.organization_id,
      organizationName: organizationName || "Unknown Organization",
      organizationLogo: organizationLogo,
      planId: subscription.plan_id,
      planName: subscription.plan.name,
      planPrice: subscription.plan.price,
      planInterval: subscription.plan.interval,
      planCurrency: subscription.plan.currency,
      status: subscription.status,
      features: subscription.plan.features.features || [],
      autoRenew: subscription.auto_renew,
      startedAt: subscription.started_at,
      expiresAt: subscription.expires_at,
      nextBillingDate: subscription.auto_renew ? subscription.expires_at : undefined,
      canceledAt: subscription.canceled_at,
      createdAt: subscription.created_at,
    };
  };
  
  /**
   * Transform MemberPayment to PaymentDisplay for UI
   * Note: organizationName and planName need to be extracted from invoice
   */
  export const transformPaymentForUI = (
    payment: MemberPayment
  ): PaymentDisplay => {
    // Type assertion for optional properties that may not be in the base type
    const paymentWithOptionals = payment as MemberPayment & { 
      description?: string; 
      provider?: string; 
    };
    
    const organizationName = "Unknown"; // Would come from invoice.subscription.organization
    const planName =
      payment.invoice?.member_subscription?.plan.name || 
      paymentWithOptionals.description || 
      "N/A";
  
    return {
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      paymentMethod: paymentWithOptionals.provider || "unknown", // 'paystack', 'flutterwave', etc.
      reference: payment.provider_reference,
      organizationName,
      planName,
      description: paymentWithOptionals.description || "", // ✅ Fix: provide empty string as fallback
      receiptUrl: undefined, // Not provided by API - needs to be generated
      createdAt: payment.created_at,
    };
  };
  
  // ============================================
  // STATUS & STATE HELPERS
  // ============================================
  
  /**
   * Check if subscription is active and valid
   */
  export const isSubscriptionActive = (subscription: MemberSubscription): boolean => {
    if (subscription.status !== "active") return false;
    const now = new Date();
    const expires = new Date(subscription.expires_at);
    return now < expires;
  };
  
  /**
   * Check if subscription is expiring soon (within 7 days)
   */
  export const isSubscriptionExpiringSoon = (
    subscription: MemberSubscription,
    daysThreshold: number = 7
  ): boolean => {
    if (subscription.status !== "active") return false;
    const now = new Date();
    const expires = new Date(subscription.expires_at);
    const daysUntilExpiry = Math.ceil(
      (expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= daysThreshold && daysUntilExpiry > 0;
  };
  
  /**
   * Get days until subscription expires
   */
  export const getDaysUntilExpiry = (subscription: MemberSubscription): number => {
    const now = new Date();
    const expires = new Date(subscription.expires_at);
    return Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };
  
  /**
   * Check if payment is successful
   */
  export const isPaymentSuccessful = (payment: MemberPayment): boolean => {
    return payment.status === "success";
  };
  
  /**
   * Get subscription status color for UI
   */
  export const getSubscriptionStatusColor = (
    status: MemberSubscription["status"]
  ): string => {
    const colors = {
      active: "bg-green-100 text-green-700",
      expired: "bg-red-100 text-red-700",
      canceled: "bg-gray-100 text-gray-700",
      pending: "bg-yellow-100 text-yellow-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };
  
  /**
   * Get payment status color for UI
   */
  export const getPaymentStatusColor = (
    status: MemberPayment["status"]
  ): string => {
    const colors = {
      success: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };
  
  // ============================================
  // FORMATTING HELPERS
  // ============================================
  
  /**
   * Format currency amount
   */
  export const formatCurrency = (
    amount: number,
    currency: string = "NGN"
  ): string => {
    const currencySymbols: Record<string, string> = {
      NGN: "₦",
      USD: "$",
      GBP: "£",
      EUR: "€",
    };
    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${amount.toLocaleString()}`;
  };
  
  /**
   * Format date to readable string
   */
  export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  /**
   * Format date and time to readable string
   */
  export const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  /**
   * Format subscription interval to readable string
   */
  export const formatInterval = (
    interval: string,
    intervalCount: number = 1
  ): string => {
    if (intervalCount === 1) {
      return interval;
    }
    return `${intervalCount} ${interval}s`;
  };
  
  /**
   * Get relative time string (e.g., "2 days ago")
   */
  export const getRelativeTime = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
  
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    return "Just now";
  };
  
  // ============================================
  // VALIDATION HELPERS
  // ============================================
  
  /**
   * Validate email format
   */
  export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate phone number (basic)
   */
  export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  };
  
  /**
   * Validate date of birth (must be in the past and reasonable age)
   */
  export const isValidDateOfBirth = (dateString: string): boolean => {
    const date = new Date(dateString);
    const now = new Date();
    const age = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return date < now && age >= 13 && age <= 120;
  };
  
  // ============================================
  // CALCULATION HELPERS
  // ============================================
  
  /**
   * Calculate total spent from payments
   */
  export const calculateTotalSpent = (payments: MemberPayment[]): number => {
    return payments
      .filter((p) => p.status === "success")
      .reduce((sum, p) => sum + p.amount, 0);
  };
  
  /**
   * Calculate upcoming payment amount
   */
  export const calculateUpcomingPayment = (
    subscriptions: MemberSubscription[]
  ): number => {
    return subscriptions
      .filter((s) => s.status === "active" && s.auto_renew)
      .reduce((sum, s) => sum + s.plan.price, 0);
  };
  
  /**
   * Group subscriptions by status
   */
  export const groupSubscriptionsByStatus = (subscriptions: MemberSubscription[]) => {
    return subscriptions.reduce(
      (acc, sub) => {
        if (!acc[sub.status]) acc[sub.status] = [];
        acc[sub.status].push(sub);
        return acc;
      },
      {} as Record<string, MemberSubscription[]>
    );
  };
  
  /**
   * Group payments by month
   */
  export const groupPaymentsByMonth = (payments: MemberPayment[]) => {
    return payments.reduce(
      (acc, payment) => {
        const month = new Date(payment.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });
        if (!acc[month]) acc[month] = [];
        acc[month].push(payment);
        return acc;
      },
      {} as Record<string, MemberPayment[]>
    );
  };
  
  // ============================================
  // SORTING HELPERS
  // ============================================
  
  /**
   * Sort subscriptions by expiry date (soonest first)
   */
  export const sortSubscriptionsByExpiry = (
    subscriptions: MemberSubscription[]
  ): MemberSubscription[] => {
    return [...subscriptions].sort(
      (a, b) =>
        new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime()
    );
  };
  
  /**
   * Sort payments by date (newest first)
   */
  export const sortPaymentsByDate = (
    payments: MemberPayment[],
    ascending: boolean = false
  ): MemberPayment[] => {
    return [...payments].sort((a, b) => {
      const diff =
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return ascending ? -diff : diff;
    });
  };
  
  // ============================================
  // EXPORT ALL
  // ============================================
  
  export const memberHelpers = {
    // Transformation
    transformMemberForUI,
    transformSubscriptionForUI,
    transformPaymentForUI,
  
    // Status checks
    isSubscriptionActive,
    isSubscriptionExpiringSoon,
    getDaysUntilExpiry,
    isPaymentSuccessful,
    getSubscriptionStatusColor,
    getPaymentStatusColor,
  
    // Formatting
    formatCurrency,
    formatDate,
    formatDateTime,
    formatInterval,
    getRelativeTime,
  
    // Validation
    isValidEmail,
    isValidPhone,
    isValidDateOfBirth,
  
    // Calculations
    calculateTotalSpent,
    calculateUpcomingPayment,
    groupSubscriptionsByStatus,
    groupPaymentsByMonth,
  
    // Sorting
    sortSubscriptionsByExpiry,
    sortPaymentsByDate,
  };
  
  export default memberHelpers;