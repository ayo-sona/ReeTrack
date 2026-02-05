import {
  X,
  Search,
  Mail,
  Phone,
  Calendar,
  Download,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useState, useMemo } from "react";
import { SubscriptionPlan } from "../../types/organization";

interface PlanMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
}

export function PlanMembersModal({
  isOpen,
  onClose,
  plan,
}: PlanMembersModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "pending" | "cancelled" | "expired"
  >("all");

  // Filter members
  const filteredSubcriptions = useMemo(() => {
    return (
      plan?.subscriptions?.filter((subscription) => {
        const matchesSearch =
          subscription.member.user.first_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          subscription.member.user.email
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || subscription.status === statusFilter;
        return matchesSearch && matchesStatus;
      }) || []
    );
  }, [searchQuery, statusFilter, plan]);

  // Stats
  const stats = {
    total: plan?.subscriptions?.length || 0,
    active:
      plan?.subscriptions?.filter((m) => m.status === "active").length || 0,
    pending:
      plan?.subscriptions?.filter((m) => m.status === "pending").length || 0,
    cancelled:
      plan?.subscriptions?.filter((m) => m.status === "cancelled").length || 0,
    expired:
      plan?.subscriptions?.filter((m) => m.status === "expired").length || 0,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // const handleExport = () => {
  //   // TODO: Implement CSV export
  //   console.log('Exporting members to CSV...');
  //   alert('Export feature coming soon!');
  // };

  if (!isOpen || !plan) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {plan.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {plan.description}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    ₦{plan.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    /{plan.duration}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    plan.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {plan.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-white/50 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.total}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-green-200 dark:border-green-800">
              <p className="text-xs text-green-700 dark:text-green-400">
                Active
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                {stats.active}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
              <p className="text-xs text-orange-700 dark:text-orange-400">
                Cancelled
              </p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                {stats.cancelled}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-red-200 dark:border-red-800">
              <p className="text-xs text-red-700 dark:text-red-400">Expired</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                {stats.expired}
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
            </div>
            {/* <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button> */}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500" />
            {(
              ["all", "active", "cancelled", "pending", "expired"] as const
            ).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === status
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {status === "all"
                  ? "All"
                  : status === "cancelled"
                    ? "Cancelled"
                    : status === "pending"
                      ? "Pending"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                {statusFilter === status && (
                  <span className="ml-1.5 text-xs">
                    ({filteredSubcriptions?.length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto">
          {filteredSubcriptions?.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSubcriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                          {`${subscription.member.user.first_name} ${subscription.member.user.last_name}`
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {subscription.member.user.first_name}{" "}
                            {subscription.member.user.last_name}
                          </h4>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Mail className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">
                                {subscription.member.user.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Phone className="w-4 h-4 flex-shrink-0" />
                              <span>{subscription.member.user.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="w-4 h-4 flex-shrink-0" />
                              <span>
                                Joined{" "}
                                {formatDate(subscription.member.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="text-right flex-shrink-0">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-2 ${
                          subscription.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : subscription.status === "pending"
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {subscription.status === "active" && (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        {subscription.status === "pending" && (
                          <Clock className="w-3 h-3" />
                        )}
                        {subscription.status === "expired" && (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {subscription.status === "active"
                          ? "Active"
                          : subscription.status === "pending"
                            ? "Pending"
                            : "Expired"}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {subscription.status === "expired"
                          ? "Expired"
                          : "Expires"}{" "}
                        {formatDate(subscription.expires_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                No members found
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {filteredSubcriptions!.length} of{" "}
              {plan.subscriptions?.length || 0} members
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
