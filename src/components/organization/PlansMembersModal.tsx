"use client";

import { X, Search, Mail, Phone, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useState, useMemo } from "react";
import { SubscriptionPlan } from "../../types/organization";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/SearchBar";
import clsx from "clsx";

interface PlanMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
}

export function PlanMembersModal({ isOpen, onClose, plan }: PlanMembersModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "cancelled" | "expired">("all");

  // Deduplicate — one row per member, preferring active subscription
  const uniqueSubscriptions = useMemo(() => {
    if (!plan?.subscriptions) return [];
    const seen = new Map<string, typeof plan.subscriptions[0]>();
    const sorted = [...plan.subscriptions].sort((a, b) => {
      if (a.status === "active" && b.status !== "active") return -1;
      if (b.status === "active" && a.status !== "active") return 1;
      return new Date(b.expires_at).getTime() - new Date(a.expires_at).getTime();
    });
    for (const sub of sorted) {
      const key = sub.member.user.email;
      if (!seen.has(key)) seen.set(key, sub);
    }
    return Array.from(seen.values());
  }, [plan]);

  const filteredSubscriptions = useMemo(() => {
    return uniqueSubscriptions.filter((sub) => {
      const matchesSearch =
        sub.member.user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.member.user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, uniqueSubscriptions]);

  const stats = {
    total: uniqueSubscriptions.length,
    active: uniqueSubscriptions.filter((s) => s.status === "active").length,
    cancelled: uniqueSubscriptions.filter((s) => s.status === "cancelled").length,
    expired: uniqueSubscriptions.filter((s) => s.status === "expired").length,
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { icon: <CheckCircle className="w-3 h-3" />, className: "bg-emerald-50 text-emerald-700 border border-emerald-100" };
      case "pending":
        return { icon: <Clock className="w-3 h-3" />, className: "bg-amber-50 text-amber-700 border border-amber-100" };
      default:
        return { icon: <AlertCircle className="w-3 h-3" />, className: "bg-red-50 text-red-600 border border-red-100" };
    }
  };

  const filterButtons: Array<"all" | "active" | "cancelled" | "pending" | "expired"> =
    ["all", "active", "pending", "cancelled", "expired"];

  if (!isOpen || !plan) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div
        className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-xl flex flex-col border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-1">
                <h2 className="text-lg font-bold text-[#1F2937]">{plan.name}</h2>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  plan.isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-gray-100 text-[#9CA3AF]"
                }`}>
                  {plan.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              {plan.description && (
                <p className="text-sm text-[#9CA3AF]">{plan.description}</p>
              )}
              <p className="text-sm font-bold text-[#1F2937] mt-1">
                ₦{plan.price.toLocaleString()}
                <span className="font-normal text-[#9CA3AF]">/{plan.duration}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 hover:bg-[#F9FAFB] transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-[#9CA3AF]" />
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { label: "Total", value: stats.total, className: "border-gray-100" },
              { label: "Active", value: stats.active, className: "border-emerald-100", valueClass: "text-emerald-700" },
              { label: "Cancelled", value: stats.cancelled, className: "border-amber-100", valueClass: "text-amber-700" },
              { label: "Expired", value: stats.expired, className: "border-red-100", valueClass: "text-red-600" },
            ].map(({ label, value, className, valueClass }) => (
              <div key={label} className={`bg-[#F9FAFB] rounded-lg p-3 border ${className}`}>
                <p className="text-xs font-semibold text-[#9CA3AF] mb-1">{label}</p>
                <p className={`text-xl font-extrabold ${valueClass || "text-[#1F2937]"}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search & filters */}
        <div className="px-6 py-4 border-b border-gray-100 bg-[#F9FAFB] flex-shrink-0 space-y-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name or email..."
          />
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize",
                  statusFilter === status
                    ? "bg-[#0D9488] text-white shadow-sm"
                    : "bg-white text-[#9CA3AF] border border-gray-200 hover:text-[#1F2937] hover:border-gray-300"
                )}
              >
                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                {statusFilter === status && (
                  <span className="ml-1 opacity-80">({filteredSubscriptions.length})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Members list */}
        <div className="flex-1 overflow-y-auto">
          {filteredSubscriptions.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {filteredSubscriptions.map((subscription) => {
                const statusCfg = getStatusConfig(subscription.status);
                const initials = `${subscription.member.user.first_name} ${subscription.member.user.last_name}`
                  .split(" ").map((n) => n[0]).join("").toUpperCase();

                return (
                  <div key={subscription.id} className="p-4 hover:bg-[#F9FAFB] transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488] font-bold text-sm flex-shrink-0">
                          {initials}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#1F2937] mb-1">
                            {subscription.member.user.first_name} {subscription.member.user.last_name}
                          </p>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{subscription.member.user.email}</span>
                            </div>
                            {subscription.member.user.phone && (
                              <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                                <Phone className="w-3 h-3 flex-shrink-0" />
                                <span>{subscription.member.user.phone}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              <span>Joined {formatDate(subscription.member.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status & expiry */}
                      <div className="text-right flex-shrink-0">
                        <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-1.5 capitalize", statusCfg.className)}>
                          {statusCfg.icon}
                          {subscription.status}
                        </span>
                        <p className="text-xs text-[#9CA3AF]">
                          {subscription.status === "expired" ? "Expired" : "Expires"}{" "}
                          {formatDate(subscription.expires_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-14 h-14 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-[#0D9488]" />
              </div>
              <p className="text-sm font-bold text-[#1F2937] mb-1">No members found</p>
              <p className="text-xs text-[#9CA3AF]">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <p className="text-sm text-[#9CA3AF]">
            Showing{" "}
            <span className="font-bold text-[#1F2937]">{filteredSubscriptions.length}</span>{" "}
            of <span className="font-bold text-[#1F2937]">{stats.total}</span> members
          </p>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}