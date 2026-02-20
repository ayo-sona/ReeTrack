"use client";

import { Payment } from "../../types/organization";
import Link from "next/link";
import { CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";
import clsx from "clsx";

interface PaymentsTableProps {
  payments: Payment[];
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="w-14 h-14 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="w-7 h-7 text-[#0D9488]" />
        </div>
        <h3 className="text-base font-bold text-[#1F2937] mb-1" style={{ fontFamily: "Nunito, sans-serif" }}>
          No payments found
        </h3>
        <p className="text-sm text-[#9CA3AF]" style={{ fontFamily: "Nunito, sans-serif" }}>
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
          className: "bg-emerald-50 text-emerald-700 border border-emerald-100",
        };
      case "pending":
        return {
          icon: <Clock className="w-3 h-3" />,
          className: "bg-amber-50 text-amber-700 border border-amber-100",
        };
      case "failed":
        return {
          icon: <XCircle className="w-3 h-3" />,
          className: "bg-red-50 text-red-600 border border-red-100",
        };
      default:
        return {
          icon: null,
          className: "bg-gray-100 text-[#9CA3AF]",
        };
    }
  };

  const formatDate = (dateString: string) => ({
    date: new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: new Date(dateString).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden" style={{ fontFamily: "Nunito, sans-serif" }}>
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-[#F9FAFB]">
              {["Member", "Amount", "Plan", "Status", "Date", "Reference"].map((col) => (
                <th key={col} className="px-6 py-3.5 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map((payment) => {
              const status = getStatusConfig(payment.status);
              const { date, time } = formatDate(payment.created_at);
              const memberName = `${payment.payer_user?.first_name} ${payment.payer_user?.last_name}`.trim();

              return (
                <tr key={payment.id} className="hover:bg-[#F9FAFB] transition-colors duration-150">
                  {/* Member */}
                  <td className="px-6 py-4">
                    <Link
                      href={`/enterprise/members/${payment.payer_user?.id}`}
                      className="text-sm font-semibold text-[#0D9488] hover:text-[#0B7A70] transition-colors"
                    >
                      {memberName}
                    </Link>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{payment.payer_user?.email || "—"}</p>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#1F2937]">₦{payment.amount.toLocaleString()}</span>
                  </td>

                  {/* Plan */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1F2937]">{payment.plan_name}</span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize", status.className)}>
                      {status.icon}
                      {payment.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#1F2937]">{date}</p>
                    <p className="text-xs text-[#9CA3AF]">{time}</p>
                  </td>

                  {/* Reference */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0D9488]/10 text-[#0D9488]">
                      {payment.provider_reference}
                    </span>
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
          const memberName = `${payment.payer_user?.first_name} ${payment.payer_user?.last_name}`.trim();

          return (
            <div key={payment.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/enterprise/members/${payment.payer_user?.id}`}
                    className="text-sm font-semibold text-[#0D9488] hover:text-[#0B7A70]"
                  >
                    {memberName}
                  </Link>
                  <p className="text-xs text-[#9CA3AF]">{payment.payer_user?.email || "—"}</p>
                </div>
                <span className={clsx("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize flex-shrink-0", status.className)}>
                  {status.icon}
                  {payment.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-[#1F2937]">₦{payment.amount.toLocaleString()}</span>
                <span className="text-[#9CA3AF] text-xs">{payment.plan_name}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                <span>{date} · {time}</span>
                <span className="bg-[#0D9488]/10 text-[#0D9488] font-semibold px-2 py-0.5 rounded-full">
                  {payment.provider_reference}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}