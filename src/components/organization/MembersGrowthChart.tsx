"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTeamMembers } from "../../hooks/useOrganisations";
import clsx from "clsx";

type ChartType = "line" | "area";
type TimeRange = "3m" | "6m" | "12m";

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-lg min-w-[150px]"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-[#9CA3AF] capitalize">{entry.name}</span>
              </div>
              <span className="text-sm font-bold text-[#1F2937]">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function MembersGrowthChart() {
  const [chartType, setChartType] = useState<ChartType>("area");
  const [timeRange, setTimeRange] = useState<TimeRange>("6m");

  const { data: teamMembers, isLoading } = useTeamMembers();
  const actualMembers = teamMembers?.filter((m) => m.role === "MEMBER");

  const chartData = useMemo(() => {
    if (!actualMembers || actualMembers.length === 0) return [];

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const monthsToShow = timeRange === "3m" ? 3 : timeRange === "6m" ? 6 : 12;

    const data = [];
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;

      const totalMembers = actualMembers.filter((m) => {
        const joined = new Date(m.user.created_at);
        return joined.getFullYear() < year || (joined.getFullYear() === year && joined.getMonth() <= monthIndex);
      }).length;

      const activeMembers = actualMembers.filter((m) => {
        const joined = new Date(m.user.created_at);
        const joinedByMonth = joined.getFullYear() < year || (joined.getFullYear() === year && joined.getMonth() <= monthIndex);
        return joinedByMonth && m.status === "active";
      }).length;

      data.push({
        month: months[monthIndex],
        total: totalMembers,
        active: activeMembers,
        inactive: totalMembers - activeMembers,
      });
    }
    return data;
  }, [actualMembers, timeRange]);

  const stats = useMemo(() => {
    if (!actualMembers || actualMembers.length === 0) return { total: 0, active: 0, inactive: 0, growthRate: 0 };
    const total = actualMembers.length;
    const active = actualMembers.filter((m) => m.status === "active").length;
    const inactive = total - active;
    let growthRate = 0;
    if (chartData.length >= 2) {
      const first = chartData[0].total;
      const last = chartData[chartData.length - 1].total;
      if (first > 0) growthRate = ((last - first) / first) * 100;
    }
    return { total, active, inactive, growthRate };
  }, [actualMembers, chartData]);

  if (isLoading) {
    return (
      <div
        className="rounded-xl bg-white border border-gray-100 shadow-sm p-8 animate-pulse"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <div className="h-5 w-40 bg-gray-100 rounded-lg mb-6" />
        <div className="h-72 bg-gray-50 rounded-xl" />
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-8 flex items-center justify-center h-64">
        <p className="text-sm text-[#9CA3AF]" style={{ fontFamily: "Nunito, sans-serif" }}>
          No member data available yet.
        </p>
      </div>
    );
  }

  const segmentBtnClass = (active: boolean) =>
    clsx(
      "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200",
      active
        ? "bg-white text-[#1F2937] shadow-sm"
        : "text-[#9CA3AF] hover:text-[#1F2937]"
    );

  const renderChart = () => {
    const commonProps = { data: chartData, margin: { top: 10, right: 10, left: 0, bottom: 0 } };
    const axisProps = {
      tick: { fill: "#9CA3AF", fontSize: 11, fontWeight: 600 },
      tickLine: false,
      axisLine: false,
    };

    if (chartType === "area") {
      return (
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0D9488" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="inactiveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F06543" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#F06543" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="month" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="total" stroke="#0D9488" strokeWidth={2} fill="url(#totalGrad)" name="Total" animationDuration={1200} />
          <Area type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} fill="url(#activeGrad)" name="Active" animationDuration={1200} />
          <Area type="monotone" dataKey="inactive" stroke="#F06543" strokeWidth={1.5} fill="url(#inactiveGrad)" name="Inactive" animationDuration={1200} />
        </AreaChart>
      );
    }

    return (
      <LineChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="total" stroke="#0D9488" strokeWidth={2.5} dot={{ fill: "#0D9488", r: 4 }} activeDot={{ r: 6 }} name="Total" animationDuration={1200} />
        <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 4 }} activeDot={{ r: 6 }} name="Active" animationDuration={1200} />
        <Line type="monotone" dataKey="inactive" stroke="#F06543" strokeWidth={2} dot={{ fill: "#F06543", r: 3 }} activeDot={{ r: 5 }} name="Inactive" animationDuration={1200} />
      </LineChart>
    );
  };

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 shadow-sm"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#1F2937]">Member Growth</h2>
            <p className="text-sm text-[#9CA3AF] mt-0.5">Track team expansion and activity over time</p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            {/* Chart type toggle */}
            <div className="inline-flex items-center bg-[#F9FAFB] border border-gray-100 rounded-lg p-1">
              {(["line", "area"] as ChartType[]).map((type) => (
                <button key={type} onClick={() => setChartType(type)} className={segmentBtnClass(chartType === type)}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Time range toggle */}
            <div className="inline-flex items-center bg-[#F9FAFB] border border-gray-100 rounded-lg p-1">
              {(["3m", "6m", "12m"] as TimeRange[]).map((range) => (
                <button key={range} onClick={() => setTimeRange(range)} className={segmentBtnClass(timeRange === range)}>
                  {range === "3m" ? "3M" : range === "6m" ? "6M" : "12M"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-5 mb-6">
          {[
            { label: "Total Members", color: "#0D9488" },
            { label: "Active", color: "#10b981" },
            { label: "Inactive", color: "#F06543" },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-semibold text-[#9CA3AF]">{label}</span>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-gray-100">
          {[
            {
              label: "Total Members",
              value: stats.total,
              sub: stats.growthRate !== 0
                ? `${stats.growthRate > 0 ? "↑" : "↓"} ${Math.abs(stats.growthRate).toFixed(1)}% growth`
                : null,
              subColor: stats.growthRate >= 0 ? "text-emerald-600" : "text-red-500",
            },
            {
              label: "Active",
              value: stats.active,
              sub: `${stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(0) : 0}% of total`,
              subColor: "text-[#9CA3AF]",
            },
            {
              label: "Inactive",
              value: stats.inactive,
              sub: `${stats.total > 0 ? ((stats.inactive / stats.total) * 100).toFixed(0) : 0}% of total`,
              subColor: "text-[#9CA3AF]",
            },
            {
              label: "Active Rate",
              value: `${stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(0) : 0}%`,
              sub: "Member engagement",
              subColor: "text-[#9CA3AF]",
            },
          ].map(({ label, value, sub, subColor }) => (
            <div key={label} className="bg-[#F9FAFB] rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">{label}</p>
              <p className="text-2xl font-extrabold text-[#1F2937] leading-none mb-1">{value}</p>
              {sub && <p className={clsx("text-xs font-semibold", subColor)}>{sub}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}