"use client";

import { useTeamMembers } from "../../hooks/useOrganisations";
import { useMemo } from "react";
import { motion } from "framer-motion";

export function RecentMembersTable() {
  const { data: teamMembers, isLoading } = useTeamMembers();

  const recentTeamMembers = useMemo(() => {
    if (!teamMembers) return [];

    return teamMembers
      .filter((member) => member.role !== "MEMBER")
      .slice(0, 5)
      .map((member) => ({
        id: member.id,
        name:
          `${member.user.first_name} ${member.user.last_name}`.trim() ||
          member.user.email ||
          "Unknown",
        email: member.user.email || "",
        role: member.role,
        status: member.status,
        lastLogin: member.user.last_login_at,
      }));
  }, [teamMembers]);

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="rounded-xl bg-white border border-[#E5E7EB] shadow-sm">
        <div className="p-6 border-b border-[#E5E7EB]">
          <div className="h-5 w-40 bg-[#F9FAFB] rounded animate-pulse" />
          <div className="h-3 w-28 bg-[#F9FAFB] rounded animate-pulse mt-2" />
        </div>
        <div className="p-6 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-[#F9FAFB] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // --- Empty State ---
  if (recentTeamMembers.length === 0) {
    return (
      <div className="rounded-xl bg-white border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E5E7EB]">
          <h3 className="text-base font-bold text-[#1F2937]">Team Members</h3>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Staff and administrators only</p>
        </div>
        <div className="flex flex-col items-center justify-center h-40">
          <p className="text-sm font-semibold text-[#9CA3AF]">No team members found</p>
        </div>
      </div>
    );
  }

  // --- Main Table ---
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl bg-white border border-[#E5E7EB] shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#E5E7EB]">
        <h3 className="text-base font-bold text-[#1F2937]">Team Members</h3>
        <p className="text-xs text-[#9CA3AF] mt-0.5">Staff and administrators only</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              {["Name", "Email", "Role", "Status", "Last Login"].map((col) => (
                <th key={col} className="px-6 py-3 text-left">
                  <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
                    {col}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentTeamMembers.map((member, index) => (
              <motion.tr
                key={member.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB] transition-colors duration-200"
              >
                {/* Name + Initial avatar */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488] font-bold text-xs flex-shrink-0">
                      {(member.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-[#1F2937]">
                      {member.name}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4">
                  <span className="text-sm text-[#9CA3AF]">{member.email}</span>
                </td>

                {/* Role badge */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                      member.role === "ADMIN"
                        ? "bg-[#0D9488]/10 text-[#0D9488]"
                        : "bg-[#F06543]/10 text-[#F06543]"
                    }`}
                  >
                    {member.role}
                  </span>
                </td>

                {/* Status — dot + text, no badge box */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        member.status === "active" ? "bg-emerald-500" : "bg-[#9CA3AF]"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium capitalize ${
                        member.status === "active"
                          ? "text-emerald-700"
                          : "text-[#9CA3AF]"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                </td>

                {/* Last Login */}
                <td className="px-6 py-4">
                  <span className="text-sm text-[#9CA3AF]">
                    {member.lastLogin
                      ? new Date(member.lastLogin).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Never"}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}