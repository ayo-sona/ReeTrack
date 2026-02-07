"use client";

import { useState, useMemo } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  useSyntheticNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  type SyntheticNotification,
} from "@/hooks/memberHook/useSyntheticNotifications";
import Link from "next/link";

export default function NotificationsPage() {
  const notifications = useSyntheticNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [refreshKey, setRefreshKey] = useState(0); // Trigger re-computation when marking as read

  // ✅ Compute read status using useMemo instead of useEffect + setState
  const readStatus = useMemo(() => {
    if (typeof window === "undefined") return {};

    const readNotifications = JSON.parse(
      localStorage.getItem("readNotifications") || "[]"
    ) as string[];

    const status: Record<string, boolean> = {};
    notifications.forEach((n) => {
      status[n.id] = readNotifications.includes(n.id);
    });
    return status;
  }, [notifications, refreshKey]); // refreshKey forces recomputation

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !readStatus[notif.id];
    return true;
  });

  const unreadCount = notifications.filter((n) => !readStatus[n.id]).length;

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    markAsRead(id);
    setRefreshKey(prev => prev + 1); // Trigger recomputation
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    setRefreshKey(prev => prev + 1); // Trigger recomputation
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case "error":
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      subscription: { color: "bg-purple-100 text-purple-700", label: "Subscription" },
      payment: { color: "bg-green-100 text-green-700", label: "Payment" },
      achievement: { color: "bg-yellow-100 text-yellow-700", label: "Achievement" },
      system: { color: "bg-blue-100 text-blue-700", label: "System" },
    };

    const badge = badges[category as keyof typeof badges];
    if (!badge) return null;

    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const NotificationCard = ({
    notification,
  }: {
    notification: SyntheticNotification;
  }) => {
    const isRead = readStatus[notification.id];

    const content = (
      <div
        className={`p-4 rounded-xl border transition-all ${
          isRead
            ? "bg-white border-gray-200 hover:border-gray-300"
            : `${getNotificationBg(notification.type)} hover:shadow-md`
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 ${isRead ? "opacity-50" : ""}`}>
            {getNotificationIcon(notification.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <h3
                  className={`font-semibold ${
                    isRead ? "text-gray-700" : "text-gray-900"
                  }`}
                >
                  {notification.title}
                </h3>
                <div className="mt-1">
                  {getCategoryBadge(notification.category)}
                </div>
              </div>
              {!isRead && (
                <span className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0 mt-1.5"></span>
              )}
            </div>

            <p
              className={`text-sm ${
                isRead ? "text-gray-500" : "text-gray-700"
              }`}
            >
              {notification.message}
            </p>

            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </p>

              {!isRead && (
                <button
                  onClick={(e) => handleMarkAsRead(notification.id, e)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Mark as read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );

    if (notification.link) {
      return <Link href={notification.link}>{content}</Link>;
    }

    return content;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === "all"
                ? "bg-emerald-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === "unread"
                ? "bg-emerald-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </h3>
            <p className="text-gray-600">
              {filter === "unread"
                ? "You're all caught up! New notifications will appear here."
                : "When important updates happen, they will appear here."}
            </p>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Smart Notifications
              </h3>
              <p className="text-sm text-blue-800">
                We automatically notify you about important updates like expiring
                subscriptions, payment confirmations, and achievements based on
                your account activity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}