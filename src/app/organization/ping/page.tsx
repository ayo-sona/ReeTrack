"use client";

import { useState, useMemo } from "react";
import {
  Send,
  Search,
  CheckSquare,
  Square,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { membersApi } from "@/lib/organizationAPI/membersApi";
import { useQuery } from "@tanstack/react-query";
import { Member } from "@/types/organization";
import {
  useNotificationHistory,
  useSendNotification,
} from "@/hooks/useNotifications";

interface TransformedMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  planName: string;
  expiryDate: string;
  daysUntilExpiry: number;
  status: "active" | "expiring_soon" | "expired";
  subscriptionStatus?: string;
}

export default function PingsPage() {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "expiring_soon" | "expired"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch members using existing API
  const {
    data: rawMembers = [],
    isLoading: isLoadingMembers,
    error: membersError,
  } = useQuery({
    queryKey: ["members"],
    queryFn: () => membersApi.getAll(),
  });

  // Fetch notification history
  const {
    data: sentPings = [],
    isLoading: isLoadingPings,
    error: pingsError,
  } = useNotificationHistory();

  // Send notification mutation
  const sendNotificationMutation = useSendNotification();

  // Transform members data
  const members = useMemo(() => {
    return rawMembers.map((member: Member): TransformedMember => {
      const user = member.user;
      const fullName = `${user.first_name} ${user.last_name}`.trim();

      // Get active subscription data
      const activeSubscription = member.subscriptions?.find(
        (sub) => sub.status === "active"
      );

      let expiryDate = new Date();
      let daysUntilExpiry = 0;
      let status: "active" | "expiring_soon" | "expired" = "active";
      let planName = "No Plan";
      let subscriptionStatus = "none";

      if (activeSubscription) {
        expiryDate = new Date(activeSubscription.expires_at);
        const today = new Date();
        daysUntilExpiry = Math.ceil(
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        planName = activeSubscription.plan.name;
        subscriptionStatus = activeSubscription.status;

        if (daysUntilExpiry < 0) {
          status = "expired";
        } else if (daysUntilExpiry <= 14) {
          status = "expiring_soon";
        } else {
          status = "active";
        }
      } else {
        // Check for expired subscriptions
        const expiredSub = member.subscriptions?.find(
          (sub) => sub.status === "expired"
        );
        if (expiredSub) {
          expiryDate = new Date(expiredSub.expires_at);
          const today = new Date();
          daysUntilExpiry = Math.ceil(
            (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
          status = "expired";
          planName = expiredSub.plan.name;
          subscriptionStatus = "expired";
        }
      }

      return {
        id: member.id,
        name: fullName,
        email: user.email,
        phone: user.phone,
        planName,
        expiryDate: expiryDate.toISOString(),
        daysUntilExpiry,
        status,
        subscriptionStatus,
      };
    });
  }, [rawMembers]);

  // Filter members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || member.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [members, searchQuery, statusFilter]);

  // Stats
  const expiringCount = members.filter(
    (m) => m.status === "expiring_soon"
  ).length;
  const expiredCount = members.filter((m) => m.status === "expired").length;

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (
      selectedMembers.length === filteredMembers.length &&
      filteredMembers.length > 0
    ) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map((m) => m.id));
    }
  };

  const handleSendPing = async (data: {
    message: string;
    channel: "email" | "sms" | "both";
  }) => {
    try {
      await sendNotificationMutation.mutateAsync({
        member_ids: selectedMembers,
        message: data.message,
        channel: data.channel,
      });

      alert(
        `✅ Notification sent successfully to ${selectedMembers.length} member${selectedMembers.length !== 1 ? "s" : ""}`
      );
      setShowSendModal(false);
      setSelectedMembers([]);
    } catch (err) {
      console.error("Error sending notification:", err);
      alert("❌ Failed to send notification. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-NG", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoadingMembers) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading members...</p>
          </div>
        </div>
      </div>
    );
  }

  if (membersError) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 font-semibold mb-2">Error Loading Data</p>
            <p className="text-gray-600">
              {membersError instanceof Error
                ? membersError.message
                : "Failed to load members"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Member Notifications
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Send reminders and updates to your members
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              {members.length}
            </span>{" "}
            total members
          </div>
        </div>
      </div>

      {/* Recent Sent Notifications */}
      <div className="rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Notifications
          </h2>
          {isLoadingPings && (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          )}
        </div>
        {sentPings.length > 0 ? (
          <div className="space-y-3">
            {sentPings.map((ping) => (
              <div
                key={ping.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                      {ping.message}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Send className="w-3 h-3" />
                        {ping.sent_to} member{ping.sent_to !== 1 ? "s" : ""}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{ping.channel}</span>
                      <span>•</span>
                      <span>{formatTimestamp(ping.sent_at)}</span>
                      {ping.status && (
                        <>
                          <span>•</span>
                          <span
                            className={`font-medium ${
                              ping.status === "sent"
                                ? "text-green-600 dark:text-green-400"
                                : ping.status === "failed"
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-yellow-600 dark:text-yellow-400"
                            }`}
                          >
                            {ping.status}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Send className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            <p className="text-sm">No notifications sent yet</p>
            <p className="text-xs mt-1">
              Select members below and send your first notification
            </p>
          </div>
        )}
      </div>

      {/* Members Selection */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Select Members
            </h2>
            <button
              onClick={() => setShowSendModal(true)}
              disabled={selectedMembers.length === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm ${
                selectedMembers.length > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
              Send to {selectedMembers.length}{" "}
              {selectedMembers.length === 1 ? "Member" : "Members"}
            </button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                {selectedMembers.length === filteredMembers.length &&
                filteredMembers.length > 0 ? (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4" />
                    Select All ({filteredMembers.length})
                  </>
                )}
              </button>

              {(expiringCount > 0 || expiredCount > 0) && (
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  {expiringCount > 0 && (
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full">
                      {expiringCount} expiring soon
                    </span>
                  )}
                  {expiredCount > 0 && (
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                      {expiredCount} expired
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <label
                key={member.id}
                className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  selectedMembers.includes(member.id)
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member.id)}
                  onChange={() => handleSelectMember(member.id)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {member.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {member.planName}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          member.status === "active"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : member.status === "expiring_soon"
                              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {member.status === "expiring_soon"
                          ? `${member.daysUntilExpiry}d left`
                          : member.status === "expired"
                            ? `${Math.abs(member.daysUntilExpiry)}d overdue`
                            : "Active"}
                      </span>
                      {member.subscriptionStatus !== "none" && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {member.status === "expired" ? "Expired" : "Expires"}{" "}
                          {formatDate(member.expiryDate)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </label>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p className="font-medium">No members found</p>
              <p className="text-sm mt-1">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showSendModal && (
        <SendModal
          selectedCount={selectedMembers.length}
          onClose={() => setShowSendModal(false)}
          onSend={handleSendPing}
          isSending={sendNotificationMutation.isPending}
        />
      )}
    </div>
  );
}

// Send Message Modal
function SendModal({
  selectedCount,
  onClose,
  onSend,
  isSending,
}: {
  selectedCount: number;
  onClose: () => void;
  onSend: (data: { message: string; channel: "email" | "sms" | "both" }) => Promise<void>;
  isSending: boolean;
}) {
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<"email" | "sms" | "both">("both");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isSending) {
      await onSend({ message, channel });
    }
  };

  const messageTemplates = [
    "Your membership is expiring soon. Please renew to continue enjoying our services.",
    "Your membership has expired. Renew today to regain access to all facilities.",
    "Special renewal offer: Get 15% off when you renew this week!",
    "Don't forget to check in today! We'd love to see you at the gym.",
    "Welcome to our community! We're excited to have you on board.",
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Send to {selectedCount} {selectedCount === 1 ? "Member" : "Members"}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Choose a template or write your own message
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Quick Templates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Templates
            </label>
            <div className="space-y-2">
              {messageTemplates.map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessage(template)}
                  disabled={isSending}
                  className="w-full text-left px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Type your message here..."
              disabled={isSending}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {message.length} characters
                {channel !== "email" &&
                  ` • ${Math.ceil(message.length / 160)} SMS`}
              </p>
              {message.length > 160 && channel !== "email" && (
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  ⚠️ Long SMS may incur extra charges
                </p>
              )}
            </div>
          </div>

          {/* Channel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Send Via
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["email", "sms", "both"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setChannel(option)}
                  disabled={isSending}
                  className={`px-4 py-3 rounded-lg border-2 font-medium text-sm capitalize transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    channel === option
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!message.trim() || isSending}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Now
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}