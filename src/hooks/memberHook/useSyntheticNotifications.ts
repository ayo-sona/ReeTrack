import { useMemo } from "react";
import { useAllSubscriptions, useAllPayments, useProfile } from "./useMember";
import type { MemberPayment } from "@/types/memberTypes/member";

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface SyntheticNotification {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  link?: string;
  createdAt: string;
  category: "subscription" | "payment" | "achievement" | "system";
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if date is within X days from now
 */
const isWithinDays = (dateStr: string, days: number): boolean => {
  const targetDate = new Date(dateStr);
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays <= days && diffDays > 0;
};

/**
 * Check if date is in the past X days
 */
const isInPastDays = (dateStr: string, days: number): boolean => {
  const targetDate = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays <= days && diffDays >= 0;
};

/**
 * Format date for display
 */
const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// ============================================
// MAIN HOOK
// ============================================

/**
 * Generate notifications from existing API data
 * This creates a synthetic notification system without backend support
 */
export const useSyntheticNotifications = () => {
  const { data: subscriptions } = useAllSubscriptions();
  const { data: payments } = useAllPayments(); // ✅ Fixed: payments is already the array
  const { data: profile } = useProfile();

  const notifications = useMemo(() => {
    const notifs: SyntheticNotification[] = [];

    // ========================================
    // 1. SUBSCRIPTION NOTIFICATIONS
    // ========================================

    // Expiring soon (within 7 days)
    subscriptions?.forEach((sub) => {
      if (sub.status === "active" && isWithinDays(sub.expires_at, 7)) {
        const daysLeft = Math.ceil(
          (new Date(sub.expires_at).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        );

        notifs.push({
          id: `sub-expire-${sub.id}`,
          type: "warning",
          category: "subscription",
          title: "Subscription Expiring Soon",
          message: `Your ${sub.plan.name} expires in ${daysLeft} day${daysLeft > 1 ? "s" : ""} (${formatDate(sub.expires_at)})${sub.auto_renew ? " - Auto-renew enabled" : " - Renew now"}`,
          link: `/member/subscriptions/${sub.id}`,
          createdAt: sub.expires_at,
        });
      }
    });

    // Recently activated subscriptions (last 3 days)
    subscriptions?.forEach((sub) => {
      if (sub.status === "active" && isInPastDays(sub.started_at, 3)) {
        notifs.push({
          id: `sub-new-${sub.id}`,
          type: "success",
          category: "subscription",
          title: "Subscription Activated",
          message: `Your ${sub.plan.name} subscription is now active! Valid until ${formatDate(sub.expires_at)}`,
          link: `/member/subscriptions/${sub.id}`,
          createdAt: sub.started_at,
        });
      }
    });

    // Recently canceled subscriptions (last 7 days)
    subscriptions?.forEach((sub) => {
      if (
        sub.status === "canceled" &&
        sub.canceled_at &&
        isInPastDays(sub.canceled_at, 7)
      ) {
        notifs.push({
          id: `sub-canceled-${sub.id}`,
          type: "info",
          category: "subscription",
          title: "Subscription Canceled",
          message: `Your ${sub.plan.name} subscription was canceled on ${formatDate(sub.canceled_at)}`,
          link: `/member/subscriptions/${sub.id}`,
          createdAt: sub.canceled_at,
        });
      }
    });

    // ========================================
    // 2. PAYMENT NOTIFICATIONS
    // ========================================

    // Recent successful payments (last 7 days)
    payments
      ?.filter(
        (p: MemberPayment) =>
          p.status === "success" && isInPastDays(p.created_at, 7),
      )
      .forEach((payment: MemberPayment) => {
        const planName =
          payment.invoice?.member_subscription?.plan.name || "Subscription";

        notifs.push({
          id: `payment-success-${payment.id}`,
          type: "success",
          category: "payment",
          title: "Payment Successful",
          message: `₦${payment.amount.toLocaleString()} paid for ${planName}`,
          link: "/member/payments",
          createdAt: payment.created_at,
        });
      });

    // Recent failed payments (last 7 days)
    payments
      ?.filter(
        (p: MemberPayment) =>
          p.status === "failed" && isInPastDays(p.created_at, 7),
      )
      .forEach((payment: MemberPayment) => {
        const planName =
          payment.invoice?.member_subscription?.plan.name || "Subscription";

        notifs.push({
          id: `payment-failed-${payment.id}`,
          type: "error",
          category: "payment",
          title: "Payment Failed",
          message: `Payment of ₦${payment.amount.toLocaleString()} for ${planName} failed. Please try again.`,
          link: "/member/payments",
          createdAt: payment.created_at,
        });
      });

    // ========================================
    // 3. ACHIEVEMENT NOTIFICATIONS
    // ========================================

    // const checkInCount = profile?.check_in_count || 0;
    const checkInCount = profile?.id || 0;

    // Check-in milestones
    const milestones = [10, 25, 50, 100, 250, 500, 1000];
    milestones.forEach((milestone) => {
      if (checkInCount === milestone) {
        notifs.push({
          id: `milestone-${milestone}`,
          type: "success",
          category: "achievement",
          title: `🎉 ${milestone} Check-ins Milestone!`,
          message: `Congratulations! You've reached ${milestone} check-ins. Keep up the great work!`,
          createdAt: new Date().toISOString(),
        });
      }
    });

    // ========================================
    // 4. SYSTEM NOTIFICATIONS
    // ========================================

    // Welcome message for new members (joined within 2 days)
    if (profile?.created_at && isInPastDays(profile.created_at, 2)) {
      notifs.push({
        id: "welcome",
        type: "info",
        category: "system",
        title: "👋 Welcome to ReeTrack!",
        message: `Hi ${profile.first_name}! We're excited to have you. Explore your subscriptions and start checking in!`,
        link: "/member/dashboard",
        createdAt: profile.created_at,
      });
    }

    // Account anniversary (yearly)
    if (profile?.created_at) {
      const createdDate = new Date(profile.created_at);
      const today = new Date();
      const isSameDay =
        createdDate.getDate() === today.getDate() &&
        createdDate.getMonth() === today.getMonth();
      const yearsAgo = today.getFullYear() - createdDate.getFullYear();

      if (isSameDay && yearsAgo > 0) {
        notifs.push({
          id: `anniversary-${yearsAgo}`,
          type: "success",
          category: "achievement",
          title: `🎂 ${yearsAgo} Year${yearsAgo > 1 ? "s" : ""} with ReeTrack!`,
          message: `Happy anniversary! You've been a member for ${yearsAgo} year${yearsAgo > 1 ? "s" : ""}. Thank you for being with us!`,
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Sort by date (newest first)
    return notifs.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [subscriptions, payments, profile]);

  return notifications;
};

// ============================================
// HELPER HOOKS
// ============================================

/**
 * Get unread notification count
 * Uses localStorage to track read status
 */
export const useUnreadCount = () => {
  const notifications = useSyntheticNotifications();

  if (typeof window === "undefined") return 0;

  const readNotifications = JSON.parse(
    localStorage.getItem("readNotifications") || "[]",
  ) as string[];

  return notifications.filter((n) => !readNotifications.includes(n.id)).length;
};

/**
 * Mark notification as read
 */
export const useMarkAsRead = () => {
  return (notificationId: string) => {
    if (typeof window === "undefined") return;

    const readNotifications = JSON.parse(
      localStorage.getItem("readNotifications") || "[]",
    ) as string[];

    if (!readNotifications.includes(notificationId)) {
      readNotifications.push(notificationId);
      localStorage.setItem(
        "readNotifications",
        JSON.stringify(readNotifications),
      );
    }
  };
};

/**
 * Mark all notifications as read
 */
export const useMarkAllAsRead = () => {
  const notifications = useSyntheticNotifications();

  return () => {
    if (typeof window === "undefined") return;

    const allIds = notifications.map((n) => n.id);
    localStorage.setItem("readNotifications", JSON.stringify(allIds));
  };
};

/**
 * Check if notification is read
 */
export const useIsRead = (notificationId: string): boolean => {
  if (typeof window === "undefined") return false;

  const readNotifications = JSON.parse(
    localStorage.getItem("readNotifications") || "[]",
  ) as string[];

  return readNotifications.includes(notificationId);
};
