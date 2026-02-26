"use client";

import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { PaymentsTable } from "../../../components/organization/PaymentsTable";
import { PaymentFilters } from "../../../components/organization/PaymentFilters";
import { usePayments, usePaymentStats } from "../../../hooks/usePayments";
import { mapApiPaymentsToUiPayments } from "../../../utils/paymentMapper";

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("paystack");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const {
    data: paymentsResponse,
    isLoading,
    error,
    refetch,
  } = usePayments(1, 10, selectedStatus);

  const { data: stats } = usePaymentStats();

  const payments = useMemo(() => {
    const apiPayments = paymentsResponse?.data || [];
    return mapApiPaymentsToUiPayments(apiPayments);
  }, [paymentsResponse?.data]);

  const filteredPayments = payments.filter((payment) => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        payment.payer_user.first_name?.toLowerCase().includes(search) ||
        payment.payer_user.last_name?.toLowerCase().includes(search) ||
        payment.payer_user.email?.toLowerCase().includes(search) ||
        new Date(payment.created_at).toLocaleDateString().includes(search);
      if (!matchesSearch) return false;
    }

    if (dateFrom && new Date(payment.created_at) < new Date(dateFrom))
      return false;
    if (dateTo && new Date(payment.created_at) > new Date(dateTo + "T23:59:59"))
      return false;

    if (selectedSource === "all") return true;
    if (selectedStatus === "all") return true;
    if (selectedSource === "paystack" && payment.provider !== "paystack")
      return false;
    if (selectedSource === "kora" && payment.provider !== "kora") return false;
    if (selectedSource === "other" && payment.provider !== "other")
      return false;

    return true;
  });

  const displayStats = stats
    ? [
        {
          title: "Total Revenue",
          value: `₦${(stats.total_member_revenue / 1000).toFixed(1)}K`,
          accent: "text-[#0D9488]",
        },
        {
          title: "Total Expenses",
          value: `₦${(stats.total_expenses / 1000).toFixed(1)}K`,
          accent: "text-gray-900",
        },
        {
          title: "Successful Payments",
          value: stats.successful_member_payments,
          accent: "text-[#0D9488]",
        },
        {
          title: "Failed Payments",
          value: stats.failed_member_payments,
          accent: "text-red-500",
        },
        {
          title: "Pending Payments",
          value: stats.pending_member_payments,
          accent: "text-yellow-500",
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-gray-500">Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 w-full max-w-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-red-900">
                Failed to load payments
              </h3>
              <p className="text-sm text-red-700">
                The payments data could not be fetched. Check your connection or
                permissions and try again.
              </p>
              <button
                onClick={() => refetch()}
                className="mt-2 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage all payment transactions
        </p>
      </div>

      {/* Stats Grid */}
      {displayStats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {displayStats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <p className="text-xs text-gray-500 font-medium">{stat.title}</p>
              <p
                className={`text-xl font-bold mt-1 ${stat.accent}`}
                suppressHydrationWarning
              >
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">All time</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <PaymentFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        filteredCount={filteredPayments.length}
      />

      {/* Payments Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-gray-500">
              {payments.length === 0
                ? "No payments yet."
                : "No payments match your current filters."}
            </p>
          </div>
        ) : (
          <PaymentsTable payments={filteredPayments} />
        )}
      </div>
    </div>
  );
}
