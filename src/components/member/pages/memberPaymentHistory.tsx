"use client";

import { useState } from "react";
import { Search, Check, X, Clock, CreditCard } from "lucide-react";
import { useAllPayments } from "@/hooks/memberHook/useMember";
import Link from "next/link";

export default function PaymentHistoryPage() {
  const { data: payments, isLoading } = useAllPayments();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "success" | "pending" | "failed"
  >("all");

  const paymentsArray = payments || [];

  // ✅ FIX: Helper function to format currency properly - handle string or number
  const formatCurrency = (amount: number | string) => {
    // Convert to number if it's a string
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Handle invalid numbers
    if (isNaN(numAmount)) return '₦0.00';
    
    return `₦${numAmount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  // Filter payments
  const filteredPayments = paymentsArray.filter((payment) => {
    const planName =
      payment.invoice?.member_subscription?.plan.name || "Unknown Plan";
    const reference = payment.provider_reference || "";

    const matchesSearch =
      planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.amount.toString().includes(searchQuery);

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort by date (newest first)
  const sortedPayments = [...filteredPayments].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <Check className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "failed":
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Calculate summary stats - ensure numbers are properly converted
  const totalAmount = sortedPayments.reduce((sum, p) => {
    const amount = typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  
  const successfulCount = sortedPayments.filter(
    (p) => p.status === "success"
  ).length;
  
  const successfulAmount = sortedPayments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => {
      const amount = typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600 mt-1">
            View all your payment transactions
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by plan, amount, or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Status</p>
              <div className="flex gap-2 flex-wrap">
                {["all", "success", "pending", "failed"].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setStatusFilter(
                        status as "all" | "success" | "pending" | "failed"
                      )
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        {sortedPayments.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sortedPayments.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Successful</p>
                <p className="text-2xl font-bold text-green-600">
                  {successfulCount} ({formatCurrency(successfulAmount)})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payments List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-white rounded-xl border border-gray-100"></div>
              </div>
            ))}
          </div>
        ) : sortedPayments.length > 0 ? (
          <div className="space-y-4">
            {sortedPayments.map((payment) => {
              const planName =
                payment.invoice?.member_subscription?.plan.name || "Unknown Plan";
              const paymentMethod = payment.payment_method || "card";
              const reference = payment.provider_reference || payment.id;
              
              // ✅ FIX: Only successful and failed payments are clickable
              const isClickable = payment.status === "success" || payment.status === "failed";

              const PaymentCard = (
                <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all ${
                  isClickable ? 'hover:shadow-md hover:border-emerald-300 cursor-pointer' : ''
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Payment Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                          {planName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900">{planName}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            via {payment.payment_provider || "Payment Gateway"}
                          </p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                                payment.status
                              )}`}
                            >
                              {getStatusIcon(payment.status)}
                              {payment.status.charAt(0).toUpperCase() +
                                payment.status.slice(1)}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                              {paymentMethod}
                            </span>
                            {payment.status === "pending" && (
                              <span className="text-xs text-gray-500 italic">
                                Receipt not available
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Date */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(payment.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">
                        Ref: {reference}
                      </p>
                    </div>
                  </div>
                </div>
              );

              // ✅ FIX: Wrap in Link only if clickable (success or failed)
              return isClickable ? (
                <Link 
                  key={payment.id} 
                  href={`/member/payments/${payment.id}`}
                  className="block"
                >
                  {PaymentCard}
                </Link>
              ) : (
                <div key={payment.id}>
                  {PaymentCard}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchQuery || statusFilter !== "all"
                ? "No payments found"
                : "No payment history yet"}
            </h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Your payment history will appear here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}