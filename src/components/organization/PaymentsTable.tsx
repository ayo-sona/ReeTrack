"use client";

import { Payment } from "../../types/organization";
import Image from "next/image";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";

interface PaymentsTableProps {
  payments: Payment[];
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

function PayerAvatar({
  avatarUrl,
  initials,
}: {
  avatarUrl?: string | null;
  initials: string;
}) {
  return (
    <div className="w-8 h-8 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488] text-xs font-bold flex-shrink-0 overflow-hidden relative">
      {avatarUrl ? (
        <Image src={avatarUrl} alt={initials} fill className="object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

export function PaymentsTable({
  payments,
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: PaymentsTableProps) {
  if (payments.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <div className="w-14 h-14 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="w-7 h-7 text-[#0D9488]" />
        </div>
        <h3 className="text-base font-bold text-[#1F2937] mb-1">
          No payments found
        </h3>
        <p className="text-sm text-[#9CA3AF]">
          Try adjusting your filters to see more results
        </p>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "success":
        return {
          icon: <CheckCircle className="w-3 h-3" />,
          className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        };
      case "pending":
        return {
          icon: <Clock className="w-3 h-3" />,
          className: "bg-amber-50 text-amber-700 border border-amber-200",
        };
      case "failed":
        return {
          icon: <XCircle className="w-3 h-3" />,
          className: "bg-red-50 text-red-600 border border-red-200",
        };
      default:
        return {
          icon: null,
          className: "bg-gray-100 text-[#9CA3AF] border border-gray-200",
        };
    }
  };

  const formatDate = (dateString: string) => ({
    date: new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  const pageItems = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | "…")[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-[#F9FAFB]">
              {["Member", "Amount", "Plan", "Status", "Date", "Reference"].map(
                (col) => (
                  <th
                    key={col}
                    className="px-6 py-4 text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest"
                  >
                    {col}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, idx) => {
              const status = getStatusConfig(payment.status);
              const { date, time } = formatDate(payment.created_at);
              const memberName =
                `${payment.payer_user?.first_name} ${payment.payer_user?.last_name}`.trim();
              const initials = memberName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <tr
                  key={payment.id}
                  className={clsx(
                    "transition-colors duration-100 hover:bg-[#F9FAFB]",
                    idx !== payments.length - 1 && "border-b border-gray-50",
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <PayerAvatar
                        avatarUrl={payment.payer_user?.avatar_url}
                        initials={initials}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#1F2937] truncate">
                          {memberName}
                        </div>
                        <p className="text-xs text-[#9CA3AF] truncate">
                          {payment.payer_user?.email || "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#1F2937]">
                      ₦{payment.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#4B5563]">
                      {payment.plan_name || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={clsx(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
                        status.className,
                      )}
                    >
                      {status.icon}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#1F2937] font-medium">{date}</p>
                    <p className="text-xs text-[#9CA3AF]">{time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <code className="inline-block px-2.5 py-1 rounded-lg bg-[#F3F4F6] text-[#4B5563] text-xs font-mono tracking-tight max-w-[140px] truncate">
                      {payment.provider_reference}
                    </code>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden divide-y divide-gray-50">
        {payments.map((payment) => {
          const status = getStatusConfig(payment.status);
          const { date, time } = formatDate(payment.created_at);
          const memberName =
            `${payment.payer_user?.first_name} ${payment.payer_user?.last_name}`.trim();
          const initials = memberName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          return (
            <div key={payment.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <PayerAvatar
                    avatarUrl={payment.payer_user?.avatar_url}
                    initials={initials}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#1F2937] truncate">
                      {memberName}
                    </div>
                    <p className="text-xs text-[#9CA3AF] truncate">
                      {payment.payer_user?.email || "—"}
                    </p>
                  </div>
                </div>
                <span
                  className={clsx(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize flex-shrink-0",
                    status.className,
                  )}
                >
                  {status.icon}
                  {payment.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-[#1F2937]">
                  ₦{payment.amount.toLocaleString()}
                </span>
                <span className="text-xs text-[#9CA3AF]">
                  {payment.plan_name || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                <span>
                  {date} · {time}
                </span>
                <code className="bg-[#F3F4F6] text-[#4B5563] font-mono px-2 py-0.5 rounded-md text-[11px] max-w-[120px] truncate block">
                  {payment.provider_reference}
                </code>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 sm:px-6 py-3 bg-[#F9FAFB]">
          <p className="text-xs text-[#9CA3AF]">
            Showing{" "}
            <span className="font-semibold text-[#1F2937]">
              {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, totalCount)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#1F2937]">{totalCount}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 bg-white text-[#9CA3AF] hover:text-[#1F2937] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {pageItems.map((item, idx) =>
              item === "…" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-7 h-7 flex items-center justify-center text-xs text-[#9CA3AF]"
                >
                  …
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => onPageChange(item as number)}
                  className={clsx(
                    "w-7 h-7 rounded-lg text-xs font-bold transition-colors",
                    page === item
                      ? "bg-[#0D9488] text-white shadow-sm"
                      : "border border-gray-200 bg-white text-[#6B7280] hover:bg-gray-50",
                  )}
                >
                  {item}
                </button>
              ),
            )}
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 bg-white text-[#9CA3AF] hover:text-[#1F2937] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
