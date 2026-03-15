"use client";

import { useState, useMemo } from "react";
import { X, Search, Users, Hash } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { Member } from "@/types/organization";

interface MemberSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (memberId: string, memberName: string) => void;
}

export default function MemberSelectModal({
  isOpen,
  onClose,
  onSelect,
}: MemberSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: members, isLoading } = useMembers(1, 100);

  const filteredMembers = useMemo(() => {
    if (!members?.data) return [];
    if (!searchQuery.trim()) return members.data;
    const q = searchQuery.toLowerCase();
    return members.data.filter(
      (m) =>
        m.user?.first_name?.toLowerCase().includes(q) ||
        m.user?.last_name?.toLowerCase().includes(q) ||
        `${m.user?.first_name} ${m.user?.last_name}`.toLowerCase().includes(q) ||
        m.user?.email?.toLowerCase().includes(q),
    );
  }, [members, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ fontFamily: "Nunito, sans-serif" }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-extrabold text-[#1F2937]">Select Member</h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">Choose a member to check in</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#1F2937] hover:bg-gray-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-gray-100">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
              size={14}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email…"
              autoFocus
              className="w-full rounded-lg border border-gray-200 bg-[#F9FAFB] pl-8 pr-8 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2937] transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-y-auto max-h-[380px]">
          {isLoading ? (
            <div className="divide-y divide-gray-50">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-3.5 animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <div className="w-12 h-12 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-3">
                {searchQuery ? (
                  <Search className="w-5 h-5 text-[#0D9488]" />
                ) : (
                  <Users className="w-6 h-6 text-[#0D9488]" />
                )}
              </div>
              <p className="text-sm font-bold text-[#1F2937] mb-0.5">
                {searchQuery ? "No members found" : "No members yet"}
              </p>
              <p className="text-xs text-[#9CA3AF]">
                {searchQuery
                  ? `No members match "${searchQuery}"`
                  : "Add members to get started"}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 bg-[#F9FAFB] border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                    Check-Ins
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredMembers.map((member) => {
                  const fullName = `${member.user.first_name} ${member.user.last_name}`;
                  const initials = fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();
                  const checkInCount = Array.isArray(member.checked_in_at)
                    ? member.checked_in_at.length
                    : member.check_in_count ?? 0;

                  return (
                    <tr
                      key={member.id}
                      onClick={() => {
                        onSelect(member.id, fullName);
                        onClose();
                      }}
                      className="hover:bg-[#F9FAFB] transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488] text-xs font-bold flex-shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#1F2937] truncate group-hover:text-[#0D9488] transition-colors">
                              {fullName}
                            </p>
                            <p className="text-xs text-[#9CA3AF] sm:hidden truncate">
                              {member.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 hidden sm:table-cell">
                        <p className="text-xs text-[#9CA3AF] truncate">{member.user.email}</p>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Hash className="w-3 h-3 text-[#9CA3AF]" />
                          <span className="text-sm font-bold text-[#1F2937]">{checkInCount}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        {!isLoading && filteredMembers.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 bg-[#F9FAFB]">
            <p className="text-xs text-[#9CA3AF]">
              {filteredMembers.length} member{filteredMembers.length !== 1 ? "s" : ""}
              {searchQuery ? ` match "${searchQuery}"` : " total"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}