"use client";

import { useMemo, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { PaymentsTable } from "../../../components/organization/PaymentsTable";
import { PaymentFilters } from "../../../components/organization/PaymentFilters";
import { usePayments, usePaymentStats } from "../../../hooks/usePayments";
import { mapApiPaymentsToUiPayments } from "../../../utils/paymentMapper";

const PAGE_SIZE = 10;

function TableSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden animate-pulse">
      <div className="border-b border-gray-100 px-6 py-3 grid grid-cols-6 gap-4 bg-[#F9FAFB]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-2.5 bg-gray-200 rounded-full w-3/4" />
        ))}
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border-b border-gray-50 px-6 py-3.5 grid grid-cols-6 gap-4 items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-2.5 bg-gray-200 rounded-full w-4/5" />
              <div className="h-2 bg-gray-100 rounded-full w-3/5" />
            </div>
          </div>
          {[...Array(5)].map((_, j) => (
            <div key={j} className="h-2.5 bg-gray-200 rounded-full w-3/4" />
          ))}
        </div>
      ))}
      <div className="px-6 py-3 flex items-center justify-between border-t border-gray-100 bg-[#F9FAFB]">
        <div className="h-3 bg-gray-200 rounded-full w-28" />
        <div className="flex gap-1.5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-8 w-8 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("paystack");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [page, setPage] = useState(1);

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setPage(1);
  };

  const {
    data: paymentsResponse,
    isLoading,
    error,
    refetch,
  } = usePayments(page, PAGE_SIZE, selectedStatus);

  const { data: stats } = usePaymentStats();

  const payments = useMemo(() => {
    const apiPayments = paymentsResponse?.data || [];
    return mapApiPaymentsToUiPayments(apiPayments);
  }, [paymentsResponse?.data]);

  const meta = paymentsResponse?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const totalCount = meta?.total ?? 0;

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
    if (dateFrom && new Date(payment.created_at) < new Date(dateFrom)) return false;
    if (dateTo && new Date(payment.created_at) > new Date(dateTo + "T23:59:59")) return false;
    if (selectedSource !== "all" && payment.provider !== selectedSource) return false;
    return true;
  });

  const displayStats = stats
    ? [
        { title: "Total Revenue", value: `₦${(stats.total_member_revenue / 1000).toFixed(1)}K`, accent: "text-[#0D9488]" },
        { title: "Total Expenses", value: `₦${(stats.total_expenses / 1000).toFixed(1)}K`, accent: "text-gray-900" },
        { title: "Successful Payments", value: stats.successful_member_payments, accent: "text-[#0D9488]" },
        { title: "Failed Payments", value: stats.failed_member_payments, accent: "text-red-500" },
        { title: "Pending Payments", value: stats.pending_member_payments, accent: "text-yellow-500" },
      ]
    : [];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header — always visible */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage all payment transactions
        </p>
      </div>

      {/* Stats Grid — always visible */}
      {displayStats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {displayStats.map((stat) => (
            <div key={stat.title} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-500 font-medium">{stat.title}</p>
              <p className={`text-xl font-bold mt-1 ${stat.accent}`} suppressHydrationWarning>
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">All time</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters — always visible */}
      <PaymentFilters
        searchTerm={searchTerm}
        setSearchTerm={(v) => { setSearchTerm(v); setPage(1); }}
        dateFrom={dateFrom}
        setDateFrom={(v) => { setDateFrom(v); setPage(1); }}
        dateTo={dateTo}
        setDateTo={(v) => { setDateTo(v); setPage(1); }}
        selectedSource={selectedSource}
        setSelectedSource={(v) => { setSelectedSource(v); setPage(1); }}
        selectedStatus={selectedStatus}
        setSelectedStatus={handleStatusChange}
        filteredCount={filteredPayments.length}
      />

      {/* Table area — only this reacts to loading/error state */}
      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-red-900">Failed to load payments</h3>
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
      ) : (
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

          {/* Pagination footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-4 sm:px-6 py-3 bg-[#F9FAFB]">
              <p className="text-xs text-gray-500">
                {totalCount === 0 ? (
                  "No records"
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-700">{totalCount}</span>
                  </>
                )}
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "…" ? (
                      <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item as number)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                          page === item
                            ? "bg-[#0D9488] text-white shadow-sm"
                            : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {item}
                      </button>
                    ),
                  )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}