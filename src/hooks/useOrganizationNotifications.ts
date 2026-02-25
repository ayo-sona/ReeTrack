// // hooks/useOrganizationNotifications.ts

// import { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   fetchAllNotificationData,
//   type SubscriptionData,
//   type PaymentData,
//   type MemberData,
//   type StatsData,
// } from "@/lib/organizationAPI/organizationUpdatesApi";

// // ============================================
// // TYPES
// // ============================================

// export interface OrganizationNotification {
//   id: string;
//   type: "success" | "warning" | "error" | "info";
//   priority: "low" | "medium" | "high" | "urgent";
//   title: string;
//   message: string;
//   link?: string;
//   createdAt: string;
//   category: "subscription" | "payment" | "member" | "system";
// }

// // ============================================
// // LOCAL STORAGE HELPERS
// // ============================================

// const READ_KEY = "orgReadNotifications";
// const DISMISSED_KEY = "orgDismissedNotifications";

// const getStoredIds = (key: string): string[] => {
//   if (typeof window === "undefined") return [];
//   try {
//     return JSON.parse(localStorage.getItem(key) || "[]");
//   } catch {
//     return [];
//   }
// };

// const saveStoredIds = (key: string, ids: string[]): void => {
//   if (typeof window === "undefined") return;
//   localStorage.setItem(key, JSON.stringify(ids));
// };

// // ============================================
// // DATE HELPERS
// // ============================================

// const isInPastDays = (dateStr: string, days: number): boolean => {
//   if (!dateStr) return false;
//   const targetDate = new Date(dateStr);
//   if (isNaN(targetDate.getTime())) return false;
//   const now = new Date();
//   const diffMs = now.getTime() - targetDate.getTime();
//   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//   return diffDays >= 0 && diffDays <= days;
// };

// const formatDate = (dateStr: string): string => {
//   return new Date(dateStr).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//   });
// };

// const getDaysUntil = (dateStr: string): number => {
//   return Math.ceil(
//     (new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
//   );
// };

// // ============================================
// // NOTIFICATION GENERATOR
// // ============================================

// const generateNotifications = (
//   subscription: SubscriptionData | null,
//   payments: PaymentData[],
//   members: MemberData[],
//   stats: StatsData | null
// ): OrganizationNotification[] => {
//   const notifs: OrganizationNotification[] = [];

//   // ----------------------------------------
//   // 1. SUBSCRIPTION NOTIFICATIONS
//   // ----------------------------------------

//   if (subscription) {
//     if (subscription.status === "active" && subscription.expires_at) {
//       const daysLeft = getDaysUntil(subscription.expires_at);

//       // Check most urgent first to avoid duplicates
//       if (daysLeft <= 1 && daysLeft > 0) {
//         notifs.push({
//           id: "sub-expire-1",
//           type: "error",
//           priority: "urgent",
//           category: "subscription",
//           title: "Subscription Expires Tomorrow!",
//           message: `Your subscription expires tomorrow (${formatDate(subscription.expires_at)}). Renew immediately to avoid losing access!`,
//           link: "/organization/access",
//           createdAt: new Date().toISOString(),
//         });
//       } else if (daysLeft <= 3) {
//         notifs.push({
//           id: "sub-expire-3",
//           type: "warning",
//           priority: "high",
//           category: "subscription",
//           title: "Subscription Expiring in 3 Days",
//           message: `Your subscription expires on ${formatDate(subscription.expires_at)}. Please renew soon to avoid service interruption.`,
//           link: "/organization/access",
//           createdAt: new Date().toISOString(),
//         });
//       } else if (daysLeft <= 7) {
//         notifs.push({
//           id: "sub-expire-7",
//           type: "warning",
//           priority: "medium",
//           category: "subscription",
//           title: `Subscription Expiring in ${daysLeft} Days`,
//           message: `Your subscription will expire on ${formatDate(subscription.expires_at)}. Renew now to keep everything running smoothly.`,
//           link: "/organization/access",
//           createdAt: new Date().toISOString(),
//         });
//       }
//     }

//     if (subscription.status === "expired") {
//       notifs.push({
//         id: "sub-expired",
//         type: "error",
//         priority: "urgent",
//         category: "subscription",
//         title: "Subscription Expired",
//         message:
//           "Your subscription has expired. Renew now to restore access to all features.",
//         link: "/organization/access",
//         createdAt: subscription.expires_at || new Date().toISOString(),
//       });
//     }

//     // Show renewal success for 3 days after subscribing/renewing
//     if (
//       subscription.status === "active" &&
//       subscription.started_at &&
//       isInPastDays(subscription.started_at, 3)
//     ) {
//       notifs.push({
//         id: "sub-renewed",
//         type: "success",
//         priority: "low",
//         category: "subscription",
//         title: "Subscription Renewed! 🎉",
//         message:
//           "Your subscription is active. Thank you for continuing with ReeTrack!",
//         link: "/organization/access",
//         createdAt: subscription.started_at,
//       });
//     }
//   }

//   // ----------------------------------------
//   // 2. PAYMENT NOTIFICATIONS
//   // ----------------------------------------

//   // Successful payments in the last 7 days
//   payments
//     .filter((p) => p.status === "success" && isInPastDays(p.created_at, 7))
//     .forEach((payment) => {
//       notifs.push({
//         id: `payment-success-${payment.id}`,
//         type: "success",
//         priority: "low",
//         category: "payment",
//         title: "Payment Received 💙",
//         message: `A payment of ₦${payment.amount.toLocaleString()} was successfully processed.`,
//         link: "/organization/transactions",
//         createdAt: payment.created_at,
//       });
//     });

//   // Failed payments in the last 7 days
//   payments
//     .filter((p) => p.status === "failed" && isInPastDays(p.created_at, 7))
//     .forEach((payment) => {
//       notifs.push({
//         id: `payment-failed-${payment.id}`,
//         type: "error",
//         priority: "urgent",
//         category: "payment",
//         title: "Payment Failed",
//         message: `A payment of ₦${payment.amount.toLocaleString()} could not be processed. Please retry or update your payment method.`,
//         link: "/organization/transactions",
//         createdAt: payment.created_at,
//       });
//     });

//   // ----------------------------------------
//   // 3. MEMBER NOTIFICATIONS
//   // ----------------------------------------

//   // New members in the last 7 days
//   members
//     .filter((m) => m.created_at && isInPastDays(m.created_at, 7))
//     .forEach((member) => {
//       const memberName =
//         member.user
//           ? `${member.user.first_name} ${member.user.last_name}`
//           : "A new member";

//       notifs.push({
//         id: `member-joined-${member.id}`,
//         type: "info",
//         priority: "medium",
//         category: "member",
//         title: "New Member Joined",
//         message: `${memberName} has joined your organization. Welcome them to the community!`,
//         link: "/organization/members",
//         createdAt: member.created_at,
//       });
//     });

//   // Milestone notifications (only fire when count matches exactly)
//   const totalMembers = members.length;
//   [10, 25, 50, 100, 250, 500, 1000].forEach((milestone) => {
//     if (totalMembers === milestone) {
//       notifs.push({
//         id: `member-milestone-${milestone}`,
//         type: "success",
//         priority: "low",
//         category: "member",
//         title: `${milestone} Members Milestone! 🎉`,
//         message: `Congratulations! Your organization has reached ${milestone} members. Keep growing your community!`,
//         link: "/organization/members",
//         createdAt: new Date().toISOString(),
//       });
//     }
//   });

//   // ----------------------------------------
//   // 4. SYSTEM NOTIFICATIONS
//   // ----------------------------------------

//   if (stats && stats.totalMembers === 0) {
//     notifs.push({
//       id: "welcome-first-member",
//       type: "info",
//       priority: "medium",
//       category: "system",
//       title: "👋 Add Your First Member!",
//       message:
//         "Welcome to ReeTrack! Start by adding your first member to begin managing your community.",
//       link: "/organization/members",
//       createdAt: new Date().toISOString(),
//     });
//   }

//   // Sort: urgent first, then by date descending
//   const priorityOrder: Record<string, number> = {
//     urgent: 0,
//     high: 1,
//     medium: 2,
//     low: 3,
//   };

//   return notifs.sort((a, b) => {
//     const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
//     if (priorityDiff !== 0) return priorityDiff;
//     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//   });
// };

// // ============================================
// // MAIN HOOK
// // ============================================

// export const useOrganizationNotifications = () => {
//   const [orgData, setOrgData] = useState<{
//     subscription: SubscriptionData | null;
//     payments: PaymentData[];
//     members: MemberData[];
//     stats: StatsData | null;
//   } | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Reactive read/dismissed state — no page reloads needed
//   const [readIds, setReadIds] = useState<string[]>(() => getStoredIds(READ_KEY));
//   const [dismissedIds, setDismissedIds] = useState<string[]>(() =>
//     getStoredIds(DISMISSED_KEY)
//   );

//   // ----------------------------------------
//   // Data fetching
//   // ----------------------------------------

//   const fetchData = useCallback(async () => {
//     try {
//       const data = await fetchAllNotificationData();
//       setOrgData(data);
//     } catch (error) {
//       console.error("Failed to fetch notification data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, 30000);
//     return () => clearInterval(interval);
//   }, [fetchData]);

//   // ----------------------------------------
//   // Derived state
//   // ----------------------------------------

//   const allNotifications = useMemo(() => {
//     if (!orgData) return [];
//     return generateNotifications(
//       orgData.subscription,
//       orgData.payments,
//       orgData.members,
//       orgData.stats
//     );
//   }, [orgData]);

//   // Filter out dismissed notifications before exposing to UI
//   const notifications = useMemo(() => {
//     return allNotifications.filter((n) => !dismissedIds.includes(n.id));
//   }, [allNotifications, dismissedIds]);

//   const unreadCount = useMemo(() => {
//     return notifications.filter((n) => !readIds.includes(n.id)).length;
//   }, [notifications, readIds]);

//   // ----------------------------------------
//   // Actions
//   // ----------------------------------------

//   const isRead = useCallback(
//     (id: string) => readIds.includes(id),
//     [readIds]
//   );

//   const markAsRead = useCallback((id: string) => {
//     setReadIds((prev) => {
//       if (prev.includes(id)) return prev;
//       const updated = [...prev, id];
//       saveStoredIds(READ_KEY, updated);
//       return updated;
//     });
//   }, []);

//   const markAllAsRead = useCallback((notifs: OrganizationNotification[]) => {
//     setReadIds((prev) => {
//       const newIds = notifs.map((n) => n.id).filter((id) => !prev.includes(id));
//       if (newIds.length === 0) return prev;
//       const updated = [...prev, ...newIds];
//       saveStoredIds(READ_KEY, updated);
//       return updated;
//     });
//   }, []);

//   /**
//    * Dismisses a notification permanently (until the page data changes).
//    * Also marks it as read. Dismissed notifications don't reappear
//    * on refresh — they're stored in localStorage separately from read state.
//    *
//    * NOTE: Subscription/system notifications that are dynamically generated
//    * (e.g. "sub-expired") will reappear if their condition is still true
//    * after a hard page reload, since they don't have a backend record.
//    * This is expected behavior — the user should resolve the underlying issue.
//    */
//   const dismissNotification = useCallback((id: string) => {
//     setDismissedIds((prev) => {
//       if (prev.includes(id)) return prev;
//       const updated = [...prev, id];
//       saveStoredIds(DISMISSED_KEY, updated);
//       return updated;
//     });
//     // Also mark as read so counts stay accurate
//     markAsRead(id);
//   }, [markAsRead]);

//   return {
//     notifications,
//     loading,
//     unreadCount,
//     isRead,
//     markAsRead,
//     markAllAsRead,
//     dismissNotification,
//   };
// };
