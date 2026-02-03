'use client';

import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { usePlans } from '../../hooks/usePlans';
import { useMembers } from '../../hooks/useMembers';
import { Member } from '../../types/organization';
import clsx from 'clsx';

type ViewMode = 'chart' | 'list';

// Move CustomTooltip outside the component to prevent recreation on render
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 shadow-2xl min-w-[180px]">
        <p className="text-white font-medium mb-2">{data.planName}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-gray-400">Members</span>
            <span className="text-sm font-semibold text-white">{data.count}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-gray-400">Share</span>
            <span className="text-sm font-semibold text-emerald-400">
              {data.percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function PlanDistributionChart() {
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  
  const { data: plansResponse, isLoading: isLoadingPlans } = usePlans();
  const { data: membersData, isLoading: isLoadingMembers } = useMembers('');

  const plans = useMemo(() => plansResponse?.data || [], [plansResponse?.data]);
  
  const members = useMemo(() => {
    if (!membersData) return [];
    if (Array.isArray(membersData)) return membersData as Member[];
    return (membersData as { data?: Member[] }).data || [];
  }, [membersData]);

  const isLoading = isLoadingPlans || isLoadingMembers;

  // Enhanced color palette with gradients
  const getColorForPlan = (planName: string, index: number) => {
    const colorPalette = [
      { solid: '#3b82f6', gradient: 'from-blue-500 to-blue-600' },      // Blue
      { solid: '#10b981', gradient: 'from-emerald-500 to-emerald-600' }, // Emerald
      { solid: '#8b5cf6', gradient: 'from-violet-500 to-violet-600' },   // Violet
      { solid: '#f59e0b', gradient: 'from-amber-500 to-amber-600' },     // Amber
      { solid: '#ec4899', gradient: 'from-pink-500 to-pink-600' },       // Pink
      { solid: '#14b8a6', gradient: 'from-teal-500 to-teal-600' },       // Teal
      { solid: '#ef4444', gradient: 'from-red-500 to-red-600' },         // Red
      { solid: '#f97316', gradient: 'from-orange-500 to-orange-600' },   // Orange
    ];
    
    const predefinedColors: { [key: string]: typeof colorPalette[0] } = {
      'basic': colorPalette[0],
      'premium': colorPalette[2],
      'vip': colorPalette[3],
      'student': colorPalette[1],
      'corporate': colorPalette[6],
      'family': colorPalette[4],
      'trial': colorPalette[5],
    };
    
    for (const key in predefinedColors) {
      if (planName.toLowerCase().includes(key)) {
        return predefinedColors[key];
      }
    }
    
    return colorPalette[index % colorPalette.length];
  };

  const planDistribution = useMemo(() => {
    return plans.map((plan, index) => {
      const membersOnPlan = members.filter(member => {
        return member.subscriptions?.some(
          sub => sub.status === 'active' && sub.plan_id === plan.id
        );
      });
      
      const count = membersOnPlan.length;
      
      const totalMembersWithActiveSubscriptions = members.filter(m => 
        m.subscriptions?.some(sub => sub.status === 'active')
      ).length;
      
      const percentage = totalMembersWithActiveSubscriptions > 0 
        ? (count / totalMembersWithActiveSubscriptions) * 100 
        : 0;

      const colors = getColorForPlan(plan.name, index);

      return {
        planId: plan.id,
        planName: plan.name,
        count: count,
        percentage: percentage,
        color: colors.solid,
        gradient: colors.gradient,
      };
    });
  }, [plans, members]);

  const plansWithMembers = planDistribution.filter(p => p.count > 0);
  const plansWithoutMembers = planDistribution.filter(p => p.count === 0);
  
  const totalActiveMembers = plansWithMembers.reduce((sum, p) => sum + p.count, 0);
  const mostPopularPlan = plansWithMembers.length > 0 
    ? plansWithMembers.reduce((max, p) => p.count > max.count ? p : max, plansWithMembers[0])
    : null;

  const renderLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Hide labels for very small slices

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold drop-shadow-lg"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-900/40 dark:to-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-pink-500/5" />
        <div className="relative space-y-4 animate-pulse">
          <div className="h-6 w-48 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg" />
          <div className="h-80 bg-gray-200/30 dark:bg-gray-700/30 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-900/40 dark:to-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-pink-500/5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">
              Plan Distribution
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
              Active membership across subscription plans
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex items-center rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 p-1">
            {(['chart', 'list'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={clsx(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 capitalize",
                  viewMode === mode
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {mode === 'chart' ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    Chart
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    List
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {plansWithMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-lg font-light text-gray-900 dark:text-white mb-2">
              No Active Subscriptions
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {plans.length} plan{plans.length !== 1 ? 's' : ''} available
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'chart' ? (
              <>
                {/* Chart View */}
                <div className="mb-6">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={plansWithMembers}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderLabel}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="count"
                        animationBegin={0}
                        animationDuration={1000}
                      >
                        {plansWithMembers.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {plansWithMembers.map((item) => (
                    <div
                      key={item.planId}
                      className="group relative overflow-hidden rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-4 hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className={clsx(
                        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                        item.gradient
                      )} style={{ opacity: 0.05 }} />
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-4 w-4 rounded-full shadow-lg"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.planName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-light text-gray-900 dark:text-white">
                            {item.count}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({item.percentage.toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* List View */}
                <div className="space-y-3 mb-6">
                  {plansWithMembers.map((item, index) => (
                    <div
                      key={item.planId}
                      className="group relative overflow-hidden rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-5 hover:scale-[1.01] transition-all duration-300"
                    >
                      <div className={clsx(
                        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                        item.gradient
                      )} style={{ opacity: 0.05 }} />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="h-5 w-5 rounded-lg shadow-lg flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: item.color }}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="text-base font-medium text-gray-900 dark:text-white">
                                {item.planName}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {item.count} active member{item.count !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-light text-gray-900 dark:text-white">
                              {item.percentage.toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              of total
                            </p>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="h-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ 
                              width: `${item.percentage}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/30 to-white/10 dark:from-gray-800/30 dark:to-gray-700/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-5 hover:scale-[1.02] transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-violet-500/5 group-hover:from-violet-500/10 group-hover:to-violet-500/5 transition-all duration-300" />
                <div className="relative">
                  <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-light mb-2">
                    Active Members
                  </p>
                  <p className="text-3xl font-light text-gray-900 dark:text-white">
                    {totalActiveMembers}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-light mt-1">
                    Across {plansWithMembers.length} plan{plansWithMembers.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {mostPopularPlan && (
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/30 to-white/10 dark:from-gray-800/30 dark:to-gray-700/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-5 hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-500/5 group-hover:from-pink-500/10 group-hover:to-pink-500/5 transition-all duration-300" />
                  <div className="relative">
                    <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-light mb-2">
                      Most Popular
                    </p>
                    <p className="text-xl font-light text-gray-900 dark:text-white mb-1">
                      {mostPopularPlan.planName}
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: mostPopularPlan.color }}
                      />
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-light">
                        {mostPopularPlan.count} members ({mostPopularPlan.percentage.toFixed(0)}%)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Inactive plans section */}
            {plansWithoutMembers.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/20 dark:border-gray-700/20">
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-light mb-3">
                  Inactive Plans ({plansWithoutMembers.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {plansWithoutMembers.map((item) => (
                    <div
                      key={item.planId}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/10 dark:border-gray-700/10"
                    >
                      <div
                        className="h-2 w-2 rounded-full opacity-40"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {item.planName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}