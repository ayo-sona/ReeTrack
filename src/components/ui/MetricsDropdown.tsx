'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface Metric {
  label: string;
  value: string | number;
  description: string;
}

interface MetricsDropdownProps {
  title: string;
  metrics: Metric[];
  gradient: string;
  onClose: (e: React.MouseEvent) => void;
}

export function MetricsDropdown({
  title,
  metrics,
  gradient,
  onClose,
}: MetricsDropdownProps) {
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

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric, idx) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-4 rounded-xl bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-200/50 dark:border-gray-700/50"
              >
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {metric.label}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {metric.value}
                </p>
                <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight">
                  {metric.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}