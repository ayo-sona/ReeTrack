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
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const notifications = useSyntheticNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [refreshKey, setRefreshKey] = useState(0);

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
  }, [notifications, refreshKey]);

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !readStatus[notif.id];
    return true;
  });

  const unreadCount = notifications.filter((n) => !readStatus[n.id]).length;

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    markAsRead(id);
    setRefreshKey(prev => prev + 1);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    setRefreshKey(prev => prev + 1);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-[#0D9488]" />; // Teal for success
      case "warning":
        return <AlertCircle className="w-5 h-5 text-[#F59E0B]" />; // Amber for warning
      case "error":
        return <XCircle className="w-5 h-5 text-[#EF4444]" />; // Red for error
      default:
        return <Info className="w-5 h-5 text-[#0D9488]" />; // Teal for info
    }
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      subscription: { color: "bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20", label: "Subscription" },
      payment: { color: "bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20", label: "Payment" },
      achievement: { color: "bg-[#F06543]/10 text-[#F06543] border border-[#F06543]/20", label: "Achievement" },
      system: { color: "bg-[#9CA3AF]/10 text-[#1F2937] border border-[#9CA3AF]/20", label: "System" },
    };

    const badge = badges[category as keyof typeof badges];
    if (!badge) return null;

    return (
      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${badge.color}`}>
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
        className={`p-6 rounded-xl border transition-all duration-300 ${
          isRead
            ? "bg-white border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-sm"
            : "bg-white border-[#0D9488]/30 hover:border-[#0D9488]/50 hover:shadow-md"
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 ${isRead ? "opacity-40" : ""}`}>
            {getNotificationIcon(notification.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <h3
                  className={`font-bold text-base ${
                    isRead ? "text-[#9CA3AF]" : "text-[#1F2937]"
                  }`}
                >
                  {notification.title}
                </h3>
                <div className="mt-2">
                  {getCategoryBadge(notification.category)}
                </div>
              </div>
              {!isRead && (
                <span className="w-2.5 h-2.5 bg-[#0D9488] rounded-full flex-shrink-0 mt-1"></span>
              )}
            </div>

            <p
              className={`text-sm leading-relaxed ${
                isRead ? "text-[#9CA3AF]" : "text-[#1F2937]"
              }`}
            >
              {notification.message}
            </p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E5E7EB]">
              <p className="text-xs text-[#9CA3AF] font-medium">
                {new Date(notification.createdAt).toLocaleString()}
              </p>

              {!isRead && (
                <Button
                  onClick={(e) => handleMarkAsRead(notification.id, e)}
                  variant="ghost"
                  size="sm"
                  className="h-auto py-1.5 text-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark as read
                </Button>
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
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-[#1F2937]">
              Notifications
            </h1>
            <p className="text-[#9CA3AF] mt-2 font-medium">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="secondary"
              size="default"
              className="gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-2 shadow-sm border border-[#E5E7EB] flex gap-2">
          <Button
            onClick={() => setFilter("all")}
            variant={filter === "all" ? "secondary" : "ghost"}
            size="default"
            className="flex-1"
          >
            All ({notifications.length})
          </Button>
          <Button
            onClick={() => setFilter("unread")}
            variant={filter === "unread" ? "secondary" : "ghost"}
            size="default"
            className="flex-1"
          >
            Unread ({unreadCount})
          </Button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-[#E5E7EB]">
            <div className="w-16 h-16 bg-[#F9FAFB] rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-8 h-8 text-[#9CA3AF]" />
            </div>
            <h3 className="text-2xl font-bold text-[#1F2937] mb-3">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </h3>
            <p className="text-[#9CA3AF] font-medium max-w-md mx-auto">
              {filter === "unread"
                ? "You're all caught up! New notifications will appear here."
                : "When important updates happen, they will appear here."}
            </p>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#0D9488]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-[#0D9488]" />
            </div>
            <div>
              <h3 className="font-bold text-[#0D9488] mb-2">
                Smart Notifications
              </h3>
              <p className="text-sm text-[#1F2937] leading-relaxed">
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