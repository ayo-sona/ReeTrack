import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'warning' | 'danger';
  className?: string;
}

export function ProgressBar({
  value,
  max,
  label,
  showPercentage = true,
  variant = 'default',
  className,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  
  const getVariant = () => {
    if (variant !== 'default') return variant;
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'default';
  };

  const actualVariant = getVariant();

  const variants = {
    default: 'bg-blue-600',
    warning: 'bg-yellow-500',
    danger: 'bg-red-600',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {value}/{max} ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-300', variants[actualVariant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}