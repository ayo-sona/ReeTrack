'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight, AlertCircle, ChevronDown } from 'lucide-react';

interface SubStat {
  label: string;
  value: string | number;
}

interface StatCardProps {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'warning';
  icon: LucideIcon;
  gradient: string;
  glowColor: string;
  subStats: SubStat[];
  index: number;
  isExpanded: boolean;
  onClick: () => void;
}

export function StatCard({
  name,
  value,
  change,
  changeType,
  icon: Icon,
  gradient,
  glowColor,
  subStats,
  index,
  isExpanded,
  onClick,
}: StatCardProps) {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/20 dark:border-gray-700/20 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 cursor-pointer"
    >
      {/* Gradient Glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {name}
            </p>
            <motion.p
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
              className="mt-3 text-3xl font-bold text-gray-900 dark:text-white"
              suppressHydrationWarning
            >
              {value}
            </motion.p>
          </div>

          {/* Icon with Gradient */}
          <div className="relative flex flex-col items-end gap-2">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg shadow-${glowColor}-500/25`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            {/* Icon Glow */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} blur-xl opacity-20 -z-10`}></div>
            
            {/* Expand Indicator */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="p-1 rounded-lg bg-gray-100/50 dark:bg-gray-800/50"
            >
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </motion.div>
          </div>
        </div>

        {/* Change Indicator */}
        <div className="flex items-center gap-1.5 mb-3">
          {isPositive && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">{change}</span>
            </div>
          )}
          {isNegative && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
              <ArrowDownRight className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">{change}</span>
            </div>
          )}
          {!isPositive && !isNegative && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <AlertCircle className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">{change}</span>
            </div>
          )}
        </div>

        {/* Sub Stats */}
        {subStats.length > 0 && (
          <div className="pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex gap-4">
              {subStats.map((subStat) => (
                <div key={subStat.label} className="flex-1">
                  <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {subStat.label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                    {subStat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}