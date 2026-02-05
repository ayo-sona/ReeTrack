'use client';

import { useTeamMembers } from '../../hooks/useOrganisations';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export function RecentMembersTable() {
  const { data: teamMembers, isLoading } = useTeamMembers();

  const recentTeamMembers = useMemo(() => {
    if (!teamMembers) return [];
    
    return teamMembers
      .filter(member => member.role !== 'MEMBER')
      .slice(0, 5)
      .map((member) => ({
        id: member.id,
        name: `${member.user.first_name} ${member.user.last_name}`.trim() || member.user.email || 'Unknown',
        email: member.user.email || '',
        role: member.role,
        status: member.status,
        lastLogin: member.user.last_login_at,
      }));
  }, [teamMembers]);

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/20 dark:border-gray-700/20 shadow-lg">
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="h-6 w-48 bg-gray-200/50 dark:bg-gray-700/50 rounded animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (recentTeamMembers.length === 0) {
    return (
      <div className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/20 dark:border-gray-700/20 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Team Members
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Staff and administrators only
          </p>
        </div>
        <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-400">
          <Users className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm font-medium">No team members found</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/20 dark:border-gray-700/20 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/25">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Team Members
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Staff and administrators only
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200/50 dark:border-gray-700/50">
              <th className="px-6 py-4 text-left">
                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Login
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {recentTeamMembers.map((member, index) => (
              <motion.tr
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="border-b border-gray-200/30 dark:border-gray-700/30 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {/* Name with Avatar */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-blue-500/25">
                        {(member.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 blur-lg opacity-20 -z-10"></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {member.name}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {member.email}
                  </span>
                </td>

                {/* Role Badge */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      member.role === 'ADMIN'
                        ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20'
                        : 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    {member.role}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      member.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        member.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    ></span>
                    {member.status}
                  </span>
                </td>

                {/* Last Login */}
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {member.lastLogin
                      ? new Date(member.lastLogin).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Never'}
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