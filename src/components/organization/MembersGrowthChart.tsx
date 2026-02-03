'use client';

import { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useTeamMembers } from '../../hooks/useOrganisations';
import clsx from 'clsx';

type ChartType = 'line' | 'area';
type TimeRange = '3m' | '6m' | '12m';

export function MembersGrowthChart() {
  const [chartType, setChartType] = useState<ChartType>('area');
  const [timeRange, setTimeRange] = useState<TimeRange>('6m');
  
  const { data: teamMembers, isLoading } = useTeamMembers();

  const chartData = useMemo(() => {
    if (!teamMembers || teamMembers.length === 0) return [];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    // Determine number of months based on time range
    const monthsToShow = timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : 12;
    
    const data = [];
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      
      const totalMembers = teamMembers.filter(m => {
        const joinedDate = new Date(m.user.created_at);
        return (joinedDate.getFullYear() < year) || 
               (joinedDate.getFullYear() === year && joinedDate.getMonth() <= monthIndex);
      }).length;

      const activeMembers = teamMembers.filter(m => {
        const joinedDate = new Date(m.user.created_at);
        const joinedByThisMonth = (joinedDate.getFullYear() < year) || 
                                  (joinedDate.getFullYear() === year && joinedDate.getMonth() <= monthIndex);
        return joinedByThisMonth && m.status === 'active';
      }).length;

      data.push({
        month: months[monthIndex],
        total: totalMembers,
        active: activeMembers,
        inactive: totalMembers - activeMembers,
      });
    }
    
    return data;
  }, [teamMembers, timeRange]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!teamMembers || teamMembers.length === 0) {
      return { total: 0, active: 0, inactive: 0, growthRate: 0 };
    }

    const total = teamMembers.length;
    const active = teamMembers.filter(m => m.status === 'active').length;
    const inactive = total - active;

    // Calculate growth rate (comparing first and last month)
    let growthRate = 0;
    if (chartData.length >= 2) {
      const firstMonth = chartData[0].total;
      const lastMonth = chartData[chartData.length - 1].total;
      if (firstMonth > 0) {
        growthRate = ((lastMonth - firstMonth) / firstMonth) * 100;
      }
    }

    return { total, active, inactive, growthRate };
  }, [teamMembers, chartData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 shadow-2xl min-w-[160px]">
          <p className="text-gray-400 text-xs font-light mb-3">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs text-gray-300 capitalize">{entry.name}</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-900/40 dark:to-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
        <div className="relative space-y-4 animate-pulse">
          <div className="h-6 w-48 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg" />
          <div className="h-80 bg-gray-200/30 dark:bg-gray-700/30 rounded-xl" />
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-900/40 dark:to-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
        <div className="relative flex items-center justify-center h-64">
          <p className="text-gray-600 dark:text-gray-400 font-light">
            No member data available
          </p>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };

    if (chartType === 'area') {
      return (
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="inactiveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200/20 dark:text-gray-700/20" />
          <XAxis
            dataKey="month"
            stroke="currentColor"
            className="text-gray-400 dark:text-gray-500"
            tick={{ fill: "currentColor", fontSize: 11, fontWeight: 300 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="currentColor"
            className="text-gray-400 dark:text-gray-500"
            tick={{ fill: "currentColor", fontSize: 11, fontWeight: 300 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#totalGradient)"
            name="Total"
            animationDuration={1500}
          />
          <Area
            type="monotone"
            dataKey="active"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#activeGradient)"
            name="Active"
            animationDuration={1500}
          />
          <Area
            type="monotone"
            dataKey="inactive"
            stroke="#f59e0b"
            strokeWidth={1.5}
            fill="url(#inactiveGradient)"
            name="Inactive"
            animationDuration={1500}
          />
        </AreaChart>
      );
    }

    return (
      <LineChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200/20 dark:text-gray-700/20" />
        <XAxis
          dataKey="month"
          stroke="currentColor"
          className="text-gray-400 dark:text-gray-500"
          tick={{ fill: "currentColor", fontSize: 11, fontWeight: 300 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="currentColor"
          className="text-gray-400 dark:text-gray-500"
          tick={{ fill: "currentColor", fontSize: 11, fontWeight: 300 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#3b82f6"
          strokeWidth={2.5}
          dot={{ fill: "#3b82f6", r: 4 }}
          activeDot={{ r: 6 }}
          name="Total"
          animationDuration={1500}
        />
        <Line
          type="monotone"
          dataKey="active"
          stroke="#10b981"
          strokeWidth={2.5}
          dot={{ fill: "#10b981", r: 4 }}
          activeDot={{ r: 6 }}
          name="Active"
          animationDuration={1500}
        />
        <Line
          type="monotone"
          dataKey="inactive"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ fill: "#f59e0b", r: 3 }}
          activeDot={{ r: 5 }}
          name="Inactive"
          animationDuration={1500}
        />
      </LineChart>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-900/40 dark:to-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">
              Member Growth
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
              Track team expansion and member activity
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Chart Type Selector */}
            <div className="inline-flex items-center rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 p-1">
              {(['line', 'area'] as ChartType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={clsx(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 capitalize",
                    chartType === type
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Time Range Selector */}
            <div className="inline-flex items-center rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 p-1">
              {(['3m', '6m', '12m'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={clsx(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 whitespace-nowrap",
                    timeRange === range
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  {range === '3m' ? '3 Months' : range === '6m' ? '6 Months' : '12 Months'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={320}>
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Total Members */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/30 to-white/10 dark:from-gray-800/30 dark:to-gray-700/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-5 hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 group-hover:from-blue-500/10 group-hover:to-blue-500/5 transition-all duration-300" />
            <div className="relative">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-light mb-2">
                Total Members
              </p>
              <p className="text-3xl font-light text-gray-900 dark:text-white mb-1">
                {stats.total}
              </p>
              {stats.growthRate !== 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <span className={clsx(
                    "font-medium",
                    stats.growthRate > 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {stats.growthRate > 0 ? "↑" : "↓"} {Math.abs(stats.growthRate).toFixed(1)}%
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 font-light">growth</span>
                </div>
              )}
            </div>
          </div>

          {/* Active Members */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/30 to-white/10 dark:from-gray-800/30 dark:to-gray-700/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-5 hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/5 group-hover:from-emerald-500/10 group-hover:to-emerald-500/5 transition-all duration-300" />
            <div className="relative">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-light mb-2">
                Active
              </p>
              <p className="text-3xl font-light text-gray-900 dark:text-white mb-1">
                {stats.active}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-light">
                {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(0) : 0}% of total
              </p>
            </div>
          </div>

          {/* Inactive Members */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/30 to-white/10 dark:from-gray-800/30 dark:to-gray-700/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-5 hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/5 group-hover:from-amber-500/10 group-hover:to-amber-500/5 transition-all duration-300" />
            <div className="relative">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-light mb-2">
                Inactive
              </p>
              <p className="text-3xl font-light text-gray-900 dark:text-white mb-1">
                {stats.inactive}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-light">
                {stats.total > 0 ? ((stats.inactive / stats.total) * 100).toFixed(0) : 0}% of total
              </p>
            </div>
          </div>

          {/* Activity Rate */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/30 to-white/10 dark:from-gray-800/30 dark:to-gray-700/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-5 hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/5 group-hover:from-purple-500/10 group-hover:to-purple-500/5 transition-all duration-300" />
            <div className="relative">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-light mb-2">
                Activity Rate
              </p>
              <p className="text-3xl font-light text-gray-900 dark:text-white mb-1">
                {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(0) : 0}%
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-light">
                Member engagement
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400 font-light">Total Members</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400 font-light">Active Members</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400 font-light">Inactive Members</span>
          </div>
        </div>
      </div>
    </div>
  );
}