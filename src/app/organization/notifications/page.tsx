// "use client";

// import { useState, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import clsx from "clsx";
// import { useOrganizationNotifications } from "@/hooks/useOrganizationNotifiations";

// export default function NotificationsPage() {
//   const [filter, setFilter] = useState<"all" | "unread" | "urgent">("all");
//   const router = useRouter();

//   const {
//     notifications,
//     loading,
//     unreadCount,
//     isRead,
//     markAsRead,
//     markAllAsRead,
//     dismissNotification,
//   } = useOrganizationNotifications();

//   // ----------------------------------------
//   // Formatting helpers
//   // ----------------------------------------

//   const formatTimeAgo = (dateString: string) => {
//     const now = Date.now();
//     const diffInMinutes = Math.floor(
//       (now - new Date(dateString).getTime()) / 60000
//     );
//     if (diffInMinutes < 1) return "Just now";
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//     if (diffInMinutes < 1440)
//       return `${Math.floor(diffInMinutes / 60)}h ago`;
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getPriorityStyles = (priority: string) => {
//     switch (priority) {
//       case "urgent":
//         return "border-l-4 border-red-500 bg-red-50/30";
//       case "high":
//         return "border-l-4 border-amber-500 bg-amber-50/30";
//       case "medium":
//         return "border-l-4 border-[#0D9488] bg-[#0D9488]/5";
//       default:
//         return "border-l-4 border-gray-300 bg-white";
//     }
//   };

//   const getPriorityBadge = (priority: string) => {
//     switch (priority) {
//       case "urgent":
//         return {
//           label: "Urgent",
//           className: "bg-red-100 text-red-700 border border-red-200",
//         };
//       case "high":
//         return {
//           label: "High Priority",
//           className: "bg-amber-100 text-amber-700 border border-amber-200",
//         };
//       case "medium":
//         return {
//           label: "Medium",
//           className:
//             "bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20",
//         };
//       default:
//         return {
//           label: "Info",
//           className: "bg-gray-100 text-[#1F2937] border border-gray-200",
//         };
//     }
//   };

//   // ----------------------------------------
//   // Derived state
//   // ----------------------------------------

//   const filteredNotifications = useMemo(() => {
//     return notifications.filter((n) => {
//       if (filter === "unread") return !isRead(n.id);
//       if (filter === "urgent")
//         return n.priority === "urgent" || n.priority === "high";
//       return true;
//     });
//   }, [notifications, filter, isRead]);

//   const urgentCount = useMemo(() => {
//     return notifications.filter(
//       (n) => n.priority === "urgent" || n.priority === "high"
//     ).length;
//   }, [notifications]);

//   // ----------------------------------------
//   // Loading state
//   // ----------------------------------------

//   if (loading) {
//     return (
//       <div
//         className="flex items-center justify-center min-h-[60vh]"
//         style={{ fontFamily: "Nunito, sans-serif" }}
//       >
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 border-4 border-[#F9FAFB] border-t-[#0D9488] rounded-full animate-spin" />
//           <p className="text-sm font-semibold text-[#1F2937]/60">
//             Loading notifications...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ----------------------------------------
//   // Render
//   // ----------------------------------------

//   return (
//     <div
//       className="w-full max-w-4xl mx-auto space-y-6"
//       style={{ fontFamily: "Nunito, sans-serif" }}
//     >
//       {/* Header */}
//       <div className="space-y-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
//             Notifications
//           </h1>
//           <p className="text-sm sm:text-base text-[#1F2937]/60 mt-1">
//             Stay updated with your organization&apos;s activity
//           </p>
//         </div>

//         {/* Actions Bar */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//           {/* Filter Tabs */}
//           <div className="inline-flex w-full sm:w-auto items-center bg-[#F9FAFB] border border-[#1F2937]/10 rounded-xl p-1">
//             {(["all", "unread", "urgent"] as const).map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setFilter(tab)}
//                 className={clsx(
//                   "flex-1 sm:flex-none px-4 sm:px-5 py-2 text-sm font-bold transition-all rounded-lg flex items-center justify-center gap-2",
//                   filter === tab
//                     ? "bg-white text-[#1F2937] shadow-sm"
//                     : "text-[#1F2937]/60 hover:text-[#1F2937]"
//                 )}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}

//                 {tab === "unread" && unreadCount > 0 && (
//                   <span className="bg-[#0D9488] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
//                     {unreadCount}
//                   </span>
//                 )}
//                 {tab === "urgent" && urgentCount > 0 && (
//                   <span className="bg-[#F06543] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
//                     {urgentCount}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>

//           {unreadCount > 0 && (
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() => markAllAsRead(notifications)}
//               className="w-full sm:w-auto"
//             >
//               Mark all as read
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Notifications List */}
//       <div className="space-y-3">
//         {filteredNotifications.length > 0 ? (
//           filteredNotifications.map((notification) => {
//             const priorityBadge = getPriorityBadge(notification.priority);
//             const notifIsRead = isRead(notification.id);

//             return (
//               <div
//                 key={notification.id}
//                 className={clsx(
//                   "bg-white rounded-xl border border-[#1F2937]/10 shadow-sm transition-all",
//                   getPriorityStyles(notification.priority),
//                   !notifIsRead && "ring-2 ring-[#0D9488]/20"
//                 )}
//               >
//                 <div className="px-4 sm:px-6 py-4 sm:py-5">
//                   <div className="flex items-start gap-3 sm:gap-4">
//                     {/* Unread dot */}
//                     <div
//                       className={clsx(
//                         "w-2 h-2 rounded-full mt-2 flex-shrink-0",
//                         !notifIsRead ? "bg-[#0D9488]" : "bg-transparent"
//                       )}
//                     />

//                     {/* Content */}
//                     <div className="flex-1 min-w-0 space-y-3">
//                       {/* Title + badge + time */}
//                       <div className="flex items-start justify-between gap-3">
//                         <div className="flex-1 min-w-0">
//                           <h3 className="text-sm sm:text-base font-extrabold text-[#1F2937] mb-1">
//                             {notification.title}
//                           </h3>
//                           <div className="flex items-center gap-2 flex-wrap">
//                             <span
//                               className={clsx(
//                                 "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold",
//                                 priorityBadge.className
//                               )}
//                             >
//                               {priorityBadge.label}
//                             </span>
//                             <span className="text-xs text-[#1F2937]/60">
//                               {formatTimeAgo(notification.createdAt)}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Message */}
//                       <p className="text-sm text-[#1F2937] leading-relaxed">
//                         {notification.message}
//                       </p>

//                       {/* Actions */}
//                       <div className="flex items-center gap-3 flex-wrap pt-2">
//                         {!notifIsRead && (
//                           <button
//                             onClick={() => markAsRead(notification.id)}
//                             className="text-xs font-bold text-[#0D9488] hover:text-[#0D9488]/80 transition-colors"
//                           >
//                             Mark as read
//                           </button>
//                         )}
//                         {notification.link && (
//                           <button
//                             onClick={() => {
//                               markAsRead(notification.id);
//                               router.push(notification.link!);
//                             }}
//                             className="text-xs font-bold text-[#0D9488] hover:text-[#0D9488]/80 transition-colors"
//                           >
//                             View details →
//                           </button>
//                         )}
//                         <button
//                           onClick={() => dismissNotification(notification.id)}
//                           className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors ml-auto"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <div className="bg-white rounded-xl border border-[#1F2937]/10 shadow-sm overflow-hidden">
//             <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
//               <p className="text-base sm:text-lg font-extrabold text-[#1F2937] mb-2">
//                 {filter === "unread"
//                   ? "No unread notifications"
//                   : filter === "urgent"
//                   ? "No urgent notifications"
//                   : "No notifications"}
//               </p>
//               <p className="text-sm text-[#1F2937]/60">
//                 {filter === "unread"
//                   ? "You're all caught up!"
//                   : filter === "urgent"
//                   ? "Everything is running smoothly!"
//                   : "Notifications will appear here when you have updates"}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
