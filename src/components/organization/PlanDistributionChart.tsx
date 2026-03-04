"use client";

import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { usePlans } from "../../hooks/usePlans";
import { useMembers } from "../../hooks/useMembers";
import { Member } from "../../types/organization";
import clsx from "clsx";

type ViewMode = "chart" | "list";

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
  payload: { planName: string; count: number; percentage: number };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-lg min-w-[160px]"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <p className="text-sm font-bold text-[#1F2937] mb-2">{data.planName}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-6">
            <span className="text-xs text-[#9CA3AF]">Members</span>
            <span className="text-sm font-bold text-[#1F2937]">
              {data.count}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-xs text-[#9CA3AF]">Share</span>
            <span className="text-sm font-bold text-[#0D9488]">
              {data.percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Design system aligned color palette
const COLOR_PALETTE = [
  "#0D9488", // teal (primary)
  "#F06543", // coral (accent)
  "#6366f1", // indigo
  "#f59e0b", // amber
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal-400
];

export function PlanDistributionChart() {
  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("chart");

  const { data: plansResponse, isLoading: isLoadingPlans } = usePlans();

  // All members, hence the "all" flag
  const { data: membersData, isLoading: isLoadingMembers } = useMembers(
    page,
    PAGE_SIZE,
    "all",
  );

  const plans = useMemo(() => plansResponse?.data || [], [plansResponse?.data]);
  const members = useMemo(() => {
    if (!membersData) return [];
    if (Array.isArray(membersData)) return membersData as Member[];
    return (membersData as { data?: Member[] }).data || [];
  }, [membersData]);

  const isLoading = isLoadingPlans || isLoadingMembers;

  const planDistribution = useMemo(() => {
    return plans.map((plan, index) => {
      const membersOnPlan = members.filter((member) =>
        member.subscriptions?.some(
          (sub) => sub.status === "active" && sub.plan_id === plan.id,
        ),
      );
      const count = membersOnPlan.length;
      const totalActive = members.filter((m) =>
        m.subscriptions?.some((sub) => sub.status === "active"),
      ).length;
      const percentage = totalActive > 0 ? (count / totalActive) * 100 : 0;
      return {
        planId: plan.id,
        planName: plan.name,
        count,
        percentage,
        color: COLOR_PALETTE[index % COLOR_PALETTE.length],
      };
    });
  }, [plans, members]);

  const plansWithMembers = planDistribution.filter((p) => p.count > 0);
  const plansWithoutMembers = planDistribution.filter((p) => p.count === 0);
  const totalActiveMembers = plansWithMembers.reduce(
    (sum, p) => sum + p.count,
    0,
  );
  const mostPopularPlan =
    plansWithMembers.length > 0
      ? plansWithMembers.reduce(
          (max, p) => (p.count > max.count ? p : max),
          plansWithMembers[0],
        )
      : null;

  const renderLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    if (!percent || percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "Nunito, sans-serif",
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const segmentBtnClass = (active: boolean) =>
    clsx(
      "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 capitalize",
      active
        ? "bg-white text-[#1F2937] shadow-sm"
        : "text-[#9CA3AF] hover:text-[#1F2937]",
    );

  if (isLoading) {
    return (
      <div
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 animate-pulse"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <div className="h-5 w-44 bg-gray-100 rounded-lg mb-6" />
        <div className="h-72 bg-gray-50 rounded-xl" />
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 shadow-sm"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#1F2937]">
              Plan Distribution
            </h2>
            <p className="text-sm text-[#9CA3AF] mt-0.5">
              Active membership across subscription plans
            </p>
          </div>

          <div className="inline-flex items-center bg-[#F9FAFB] border border-gray-100 rounded-lg p-1">
            {(["chart", "list"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={segmentBtnClass(viewMode === mode)}
              >
                {mode === "chart" ? "Chart" : "List"}
              </button>
            ))}
          </div>
        </div>

        {plansWithMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14">
            <div className="w-14 h-14 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-[#0D9488]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="text-base font-bold text-[#1F2937] mb-1">
              No Active Subscriptions
            </p>
            <p className="text-sm text-[#9CA3AF]">
              {plans.length} plan{plans.length !== 1 ? "s" : ""} available
            </p>
          </div>
        ) : (
          <>
            {viewMode === "chart" ? (
              <>
                <div className="mb-5">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={plansWithMembers}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderLabel}
                        outerRadius={100}
                        innerRadius={55}
                        dataKey="count"
                        animationBegin={0}
                        animationDuration={900}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                  {plansWithMembers.map((item) => (
                    <div
                      key={item.planId}
                      className="flex items-center justify-between bg-[#F9FAFB] border border-gray-100 rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-semibold text-[#1F2937]">
                          {item.planName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-[#1F2937]">
                          {item.count}
                        </span>
                        <span className="text-xs text-[#9CA3AF]">
                          ({item.percentage.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-3 mb-5">
                {plansWithMembers.map((item, index) => (
                  <div
                    key={item.planId}
                    className="bg-[#F9FAFB] border border-gray-100 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1F2937]">
                            {item.planName}
                          </p>
                          <p className="text-xs text-[#9CA3AF]">
                            {item.count} active member
                            {item.count !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <p className="text-xl font-extrabold text-[#1F2937]">
                        {item.percentage.toFixed(1)}%
                      </p>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5 border-t border-gray-100">
              <div className="bg-[#F9FAFB] border border-gray-100 rounded-xl p-4">
                <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">
                  Active Members
                </p>
                <p className="text-2xl font-extrabold text-[#1F2937] leading-none mb-1">
                  {totalActiveMembers}
                </p>
                <p className="text-xs text-[#9CA3AF]">
                  Across {plansWithMembers.length} plan
                  {plansWithMembers.length !== 1 ? "s" : ""}
                </p>
              </div>

              {mostPopularPlan && (
                <div className="bg-[#F9FAFB] border border-gray-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">
                    Most Popular
                  </p>
                  <p className="text-base font-bold text-[#1F2937] mb-1">
                    {mostPopularPlan.planName}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: mostPopularPlan.color }}
                    />
                    <p className="text-xs text-[#9CA3AF]">
                      {mostPopularPlan.count} members ·{" "}
                      {mostPopularPlan.percentage.toFixed(0)}%
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Inactive plans */}
            {plansWithoutMembers.length > 0 && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-3">
                  Inactive Plans ({plansWithoutMembers.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {plansWithoutMembers.map((item) => (
                    <div
                      key={item.planId}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F9FAFB] border border-gray-100"
                    >
                      <div
                        className="w-2 h-2 rounded-full opacity-40"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-semibold text-[#9CA3AF]">
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
