"use client";

import { Member } from "../../types/organization";
import Link from "next/link";
import { Mail, Phone, Calendar, Heart, User, SearchX } from "lucide-react";
import clsx from "clsx";

interface MembersTableProps {
  members: Member[];
  isSearching?: boolean;
  isLoading?: boolean;
}

export function MembersTable({
  members,
  isSearching = false,
  isLoading = false,
}: MembersTableProps) {
  // Empty state
  if (members.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="w-16 h-16 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-4">
          {isSearching ? (
            <SearchX className="w-8 h-8 text-[#0D9488]" />
          ) : (
            <User className="w-8 h-8 text-[#9CA3AF]" />
          )}
        </div>
        <h3 className="text-base font-bold text-[#1F2937] mb-1" style={{ fontFamily: "Nunito, sans-serif" }}>
          {isSearching ? "No matches found" : "No members yet"}
        </h3>
        <p className="text-sm text-[#9CA3AF] text-center max-w-xs" style={{ fontFamily: "Nunito, sans-serif" }}>
          {isSearching
            ? "Try adjusting your search or clearing your filters."
            : "Start by adding your first member."}
        </p>
      </div>
    );
  }

  // Initial loading state
  if (members.length === 0 && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-[#0D9488] rounded-full animate-spin mb-4" />
        <p className="text-sm text-[#9CA3AF]" style={{ fontFamily: "Nunito, sans-serif" }}>
          Loading members...
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Refresh indicator */}
      {isLoading && members.length > 0 && (
        <div className="bg-[#0D9488]/5 border-b border-[#0D9488]/10 px-4 py-2 flex items-center justify-center gap-2">
          <div className="w-3 h-3 border-2 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-[#0D9488]">Updating results...</span>
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-[#F9FAFB]">
              {["Member", "Contact", "Status", "Check-ins", "Joined", ""].map((col) => (
                <th
                  key={col}
                  className="px-6 py-3.5 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {members.map((member) => {
              const user = member.user;
              const firstName = user?.first_name || "";
              const lastName = user?.last_name || "";
              const fullName = `${firstName} ${lastName}`.trim() || "Unknown User";
              const initials = (firstName.charAt(0) || lastName.charAt(0) || "M").toUpperCase();
              const email = user?.email || "—";
              const phone = user?.phone || "—";
              const createdAt = member.created_at ? new Date(member.created_at) : null;
              const status = user?.status || "inactive";
              const checkInCount = member.check_in_count || 0;
              const emailVerified = user?.email_verified || false;

              return (
                <tr
                  key={member.id}
                  className="hover:bg-[#F9FAFB] transition-colors duration-150"
                >
                  {/* Member */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#0D9488]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-[#0D9488]">{initials}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1F2937]">{fullName}</p>
                        {createdAt && (
                          <p className="text-xs text-[#9CA3AF]">
                            Joined {createdAt.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm text-[#1F2937]">
                        <Mail className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-[#9CA3AF]">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{phone}</span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span
                        className={clsx(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                          status === "active" && "bg-emerald-50 text-emerald-700 border border-emerald-100",
                          status === "inactive" && "bg-amber-50 text-amber-700 border border-amber-100"
                        )}
                      >
                        <span
                          className={clsx(
                            "w-1.5 h-1.5 rounded-full",
                            status === "active" && "bg-emerald-500",
                            status === "inactive" && "bg-amber-400"
                          )}
                        />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      {emailVerified && (
                        <p className="text-xs text-[#0D9488] font-semibold">✓ Verified</p>
                      )}
                    </div>
                  </td>

                  {/* Check-ins */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-[#F06543]" />
                      <span className="text-sm font-bold text-[#1F2937]">{checkInCount}</span>
                    </div>
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-4">
                    {createdAt && (
                      <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                        <Calendar className="w-3 h-3" />
                        {createdAt.toLocaleDateString()}
                      </div>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/organization/members/${member.id}`}
                      className="text-xs font-bold text-[#0D9488] hover:text-[#0B7A70] transition-colors"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-50">
        {members.map((member) => {
          const user = member.user;
          const firstName = user?.first_name || "";
          const lastName = user?.last_name || "";
          const fullName = `${firstName} ${lastName}`.trim() || "Unknown User";
          const initials = (firstName.charAt(0) || lastName.charAt(0) || "M").toUpperCase();
          const email = user?.email || "—";
          const status = user?.status || "inactive";
          const checkInCount = member.check_in_count || 0;
          const createdAt = member.created_at ? new Date(member.created_at) : null;

          return (
            <div key={member.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0D9488]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#0D9488]">{initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1F2937]">{fullName}</p>
                    <p className="text-xs text-[#9CA3AF] truncate max-w-[180px]">{email}</p>
                  </div>
                </div>
                <span
                  className={clsx(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0",
                    status === "active" && "bg-emerald-50 text-emerald-700 border border-emerald-100",
                    status === "inactive" && "bg-amber-50 text-amber-700 border border-amber-100"
                  )}
                >
                  <span className={clsx("w-1.5 h-1.5 rounded-full", status === "active" ? "bg-emerald-500" : "bg-amber-400")} />
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3 h-3 text-[#F06543]" />
                  <span className="font-semibold text-[#1F2937]">{checkInCount}</span>
                  <span>check-ins</span>
                </div>
                {createdAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {createdAt.toLocaleDateString()}
                  </div>
                )}
              </div>

              <Link
                href={`/organization/members/${member.id}`}
                className="block text-xs font-bold text-[#0D9488] hover:text-[#0B7A70] transition-colors"
              >
                View details →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}