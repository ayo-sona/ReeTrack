'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface TeamMember {
  id: string;
  user?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  status: string;
}

interface MemberListDropdownProps {
  title: string;
  members: TeamMember[];
  gradient: string;
  onClose: (e: React.MouseEvent) => void;
  filterInactive?: boolean;
}

export function MemberListDropdown({
  title,
  members,
  gradient,
  onClose,
  filterInactive = false,
}: MemberListDropdownProps) {
  const filteredMembers = filterInactive
    ? members.filter((m) => m.status === 'inactive')
    : members;

  const displayMembers = filteredMembers.slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 8, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-0 right-0 z-50"
    >
      <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-2xl overflow-hidden">
        {/* Subtle gradient glow */}
        <div className={`absolute top-0 left-0 right-0 h-20 bg-gradient-to-br ${gradient} opacity-5 blur-2xl`}></div>

        <div className="relative p-5">
          {/* Panel Header */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              {title}
            </h4>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <X className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Member List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {displayMembers.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/50 dark:hover:border-gray-600/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                  {member.user?.first_name?.charAt(0) || '?'}
                  {member.user?.last_name?.charAt(0) || ''}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {member.user?.first_name} {member.user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {member.user?.email}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase ${
                    member.status === 'active'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                  }`}
                >
                  {member.status}
                </span>
              </motion.div>
            ))}
            {filteredMembers.length > 10 && (
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
                Showing 10 of {filteredMembers.length} members
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}