import { useQuery } from "@tanstack/react-query";
import { useAllPayments } from "./useMember";
import type { MemberPayment } from "@/types/memberTypes/member";

// ============================================
// ACTIVITY TYPES
// ============================================

export type ActivityType = "payment" | "check_in" | "badge" | "subscription";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
  metadata?: Record<string, unknown>;
}

// ============================================
// TRANSFORM HELPERS
// ============================================

/**
 * Transform payment to activity item
 */
const transformPaymentToActivity = (payment: MemberPayment): Activity => {
  const planName =
    payment.invoice?.member_subscription?.plan.name || "Subscription";

  return {
    id: `payment-${payment.id}`,
    type: "payment",
    title: "Payment Successful",
    description: `Paid ₦${payment.amount.toLocaleString()} for ${planName}`,
    timestamp: payment.created_at,
    metadata: {
      amount: payment.amount,
      currency: payment.currency,
      planName,
    },
  };
};

/**
 * Transform check-in to activity item
 * 🔜 Placeholder - Backend not implemented yet
 */
// const transformCheckInToActivity = (checkIn: any): Activity => {
//   return {
//     id: `checkin-${checkIn.id}`,
//     type: "check_in",
//     title: "Check-in",
//     description: `Checked in at ${checkIn.organizationName}`,
//     timestamp: checkIn.created_at,
//     metadata: checkIn,
//   };
// };

/**
 * Transform badge to activity item
 * 🔜 Placeholder - Backend not implemented yet
 */
// const transformBadgeToActivity = (badge: any): Activity => {
//   return {
//     id: `badge-${badge.id}`,
//     type: "badge",
//     title: "Badge Earned",
//     description: `Earned "${badge.name}" badge`,
//     timestamp: badge.earned_at,
//     metadata: badge,
//   };
// };

// ============================================
// MAIN HOOK
// ============================================

/**
 * Fetch and combine recent activity from multiple sources
 * Returns unified activity feed sorted by date (newest first)
 */
export const useRecentActivity = (limit: number = 10) => {
  // Fetch payments (available in API)
  const { data: paymentsData, isLoading: paymentsLoading } = useAllPayments();

  // 🔜 TODO: Fetch check-ins when backend implements it
  // const { data: checkIns, isLoading: checkInsLoading } = useCheckIns();

  // 🔜 TODO: Fetch badges when backend implements it
  // const { data: badges, isLoading: badgesLoading } = useBadges();

  return useQuery<Activity[], Error>({
    queryKey: ["member", "recent-activity", limit],
    queryFn: () => {
      const activities: Activity[] = [];

      // Add payment activities (only successful ones)
      // ✅ Fixed: paymentsData is already the nested data array from useAllPayments
      if (paymentsData && Array.isArray(paymentsData)) {
        const successfulPayments = paymentsData.filter(
          (p: MemberPayment) => p.status === "success"
        );
        const paymentActivities = successfulPayments.map(
          transformPaymentToActivity
        );
        activities.push(...paymentActivities);
      }

      // 🔜 TODO: Add check-in activities
      // if (checkIns) {
      //   const checkInActivities = checkIns.map(transformCheckInToActivity);
      //   activities.push(...checkInActivities);
      // }

      // 🔜 TODO: Add badge activities
      // if (badges) {
      //   const badgeActivities = badges.map(transformBadgeToActivity);
      //   activities.push(...badgeActivities);
      // }

      // Sort by timestamp (newest first) and limit results
      return activities
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, limit);
    },
    enabled: !paymentsLoading, // Wait for payments to load
    // ⚠️ When adding check-ins/badges, update enabled condition:
    // enabled: !paymentsLoading && !checkInsLoading && !badgesLoading,
  });
};

// ============================================
// HELPER HOOKS
// ============================================

/**
 * Get count of activities in last N days
 */
export const useActivityCount = (days: number = 7) => {
  const { data: activities } = useRecentActivity(100); // Get more to count

  if (!activities) return 0;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return activities.filter(
    (activity) => new Date(activity.timestamp) >= cutoffDate
  ).length;
};

/**
 * Check if there's recent activity (useful for empty states)
 */
export const useHasRecentActivity = () => {
  const { data: activities, isLoading } = useRecentActivity(1);
  return {
    hasActivity: (activities?.length ?? 0) > 0,
    isLoading,
  };
};

// ============================================
// NOTES
// ============================================

/*
 * 🔜 FEATURES TO ADD WHEN BACKEND IS READY:
 * 
 * 1. CHECK-INS:
 *    - Uncomment transformCheckInToActivity
 *    - Add useCheckIns() hook call
 *    - Update enabled condition
 * 
 * 2. BADGES:
 *    - Uncomment transformBadgeToActivity
 *    - Add useBadges() hook call
 *    - Update enabled condition
 * 
 * 3. NEW SUBSCRIPTIONS:
 *    - Add transformSubscriptionToActivity
 *    - Filter subscriptions by created_at (last 30 days?)
 *    - Add to activities array
 */