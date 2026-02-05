"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRevenueChart } from "../../hooks/useAnalytics";
import clsx from "clsx";

type PeriodOption = {
  value: string;
  label: string;
};

type ChartType = "area" | "bar" | "line";

// Use the actual type from the API hook
interface RevenueChartData {
  date?: string;
  revenue?: number;
}

// Custom Tooltip Component with proper types - Defined outside
interface TooltipPayload {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 shadow-2xl">
        <p className="text-gray-400 text-xs font-light mb-2">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-white">
            ₦{Number(payload[0].value).toLocaleString()}
          </span>
          <span className="text-xs text-emerald-400">Revenue</span>
        </div>
      </div>
    );
  }
  return null;
};

const PERIOD_OPTIONS: PeriodOption[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "custom", label: "Custom" },
];

export function RevenueChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [chartType, setChartType] = useState<ChartType>("area");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const params =
    selectedPeriod === "custom" && startDate && endDate
      ? { period: "custom", startDate, endDate }
      : { period: selectedPeriod };

  const { data: chartData, isLoading, error } = useRevenueChart(params);
  console.log("chartData", chartData);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    if (period === "custom") {
      setShowDatePicker(true);
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
    } else {
      setShowDatePicker(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-900/40 dark:to-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5" />
        <div className="relative space-y-4 animate-pulse">
          <div className="h-6 w-48 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg" />
          <div className="h-80 bg-gray-200/30 dark:bg-gray-700/30 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-900/40 dark:to-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5" />
        <div className="relative flex items-center justify-center h-64">
          <p className="text-gray-600 dark:text-gray-400 font-light">
            Unable to load revenue data
          </p>
        </div>
      </div>
    );
  }

  const totalRevenue = chartData.reduce(
    (sum: number, d: RevenueChartData) => sum + (Number(d.revenue) || 0),
    0,
  );
  const avgRevenue = chartData.length > 0 ? totalRevenue / chartData.length : 0;
  const hasRevenue = totalRevenue > 0;

  // Calculate trend
  const firstHalf = chartData.slice(0, Math.floor(chartData.length / 2));
  const secondHalf = chartData.slice(Math.floor(chartData.length / 2));
  const firstHalfAvg =
    firstHalf.reduce(
      (sum: number, d: RevenueChartData) => sum + (Number(d.revenue) || 0),
      0,
    ) / firstHalf.length;
  const secondHalfAvg =
    secondHalf.reduce(
      (sum: number, d: RevenueChartData) => sum + (Number(d.revenue) || 0),
      0,
    ) / secondHalf.length;
  const trendPercentage =
    firstHalfAvg > 0
      ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100
      : 0;

  const formattedData = chartData.map((item: RevenueChartData) => ({
    ...item,
    date: item.date || "",
    revenue: item.revenue || 0,
    displayDate: item.date ? formatDate(item.date) : "",
  }));

  const renderChart = () => {
    const commonProps = {
      data: formattedData,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };

    const chartComponents = {
      area: (
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-gray-200/20 dark:text-gray-700/20"
          />
          <XAxis
            dataKey="displayDate"
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
            tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#revenueGradient)"
            animationDuration={1500}
            animationBegin={0}
          />
        </AreaChart>
      ),
      bar: (
        <BarChart {...commonProps}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-gray-200/20 dark:text-gray-700/20"
          />
          <XAxis
            dataKey="displayDate"
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
            tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="revenue"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
            animationDuration={1500}
            animationBegin={0}
          />
        </BarChart>
      ),
      line: (
        <LineChart {...commonProps}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-gray-200/20 dark:text-gray-700/20"
          />
          <XAxis
            dataKey="displayDate"
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
            tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ fill: "#10b981", r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={1500}
            animationBegin={0}
          />
        </LineChart>
      ),
    };

    return chartComponents[chartType];
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-900/40 dark:to-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

      {/* Content */}
      <div className="relative p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">
              Revenue Analytics
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
              Track payment performance over time
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Chart Type Selector */}
            <div className="inline-flex items-center rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 p-1">
              {(["area", "bar", "line"] as ChartType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={clsx(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 capitalize",
                    chartType === type
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
                  )}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Period Selector */}
            <div className="inline-flex items-center rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 p-1">
              {PERIOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePeriodChange(option.value)}
                  className={clsx(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 whitespace-nowrap",
                    selectedPeriod === option.value
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Date Picker */}
        {showDatePicker && (
          <div className="mb-6 flex gap-3 items-center p-4 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-gray-300/30 dark:border-gray-600/30 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <span className="text-gray-400 dark:text-gray-500 text-sm font-light">
              to
            </span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-gray-300/30 dark:border-gray-600/30 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        )}

        {/* Empty State */}
        {!hasRevenue && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 dark:border-blue-400/20">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-blue-900 dark:text-blue-100 font-light">
                No revenue recorded yet. Your revenue will appear here once you
                receive successful payments.
              </p>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={320}>
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Revenue */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/30 to-white/10 dark:from-gray-800/30 dark:to-gray-700/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-5 hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/5 group-hover:from-emerald-500/10 group-hover:to-emerald-500/5 transition-all duration-300" />
            <div className="relative">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-light mb-2">
                Total Revenue
              </p>
              <p className="text-3xl font-light text-gray-900 dark:text-white mb-1">
                ₦{totalRevenue.toLocaleString()}
              </p>
              {trendPercentage !== 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <span
                    className={clsx(
                      "font-medium",
                      trendPercentage > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400",
                    )}
                  >
                    {trendPercentage > 0 ? "↑" : "↓"}{" "}
                    {Math.abs(trendPercentage).toFixed(1)}%
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 font-light">
                    vs previous period
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Average Revenue */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/30 to-white/10 dark:from-gray-800/30 dark:to-gray-700/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-5 hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/5 group-hover:from-cyan-500/10 group-hover:to-cyan-500/5 transition-all duration-300" />
            <div className="relative">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-light mb-2">
                Average / Period
              </p>
              <p className="text-3xl font-light text-gray-900 dark:text-white">
                ₦{Math.round(avgRevenue).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Data Points */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/30 to-white/10 dark:from-gray-800/30 dark:to-gray-700/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-5 hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/5 group-hover:from-purple-500/10 group-hover:to-purple-500/5 transition-all duration-300" />
            <div className="relative">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-light mb-2">
                Data Points
              </p>
              <p className="text-3xl font-light text-gray-900 dark:text-white">
                {chartData.length}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-light mt-1">
                {selectedPeriod === "custom"
                  ? "Custom range"
                  : `Last ${selectedPeriod}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
