"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useRevenueChart } from "../../hooks/useAnalytics";

// ─── Design tokens ───────────────────────────────────────────────────────────
const C = {
  teal:      "#0D9488",
  tealAlpha: "rgba(13,148,136,0.08)",
  coral:     "#F06543",
  ink:       "#1F2937",
  muted:     "#9CA3AF",
  faint:     "#D1D5DB",
  border:    "#E5E7EB",
  light:     "#F3F4F6",
  snow:      "#F9FAFB",
  white:     "#FFFFFF",
};

// Locks native date inputs to light mode — prevents OS dark mode inversion
const DATE_INPUT_STYLE: React.CSSProperties = {
  colorScheme: "light",
  backgroundColor: C.snow,
  color: C.ink,
  border: `1px solid ${C.border}`,
  borderRadius: 8,
  padding: "6px 12px",
  fontSize: 13,
  outline: "none",
  width: "100%",
};

type ChartType = "area" | "bar" | "line";

interface RevenueChartData { date?: string; revenue?: number }
interface TooltipPayload { value: number }
interface CustomTooltipProps { active?: boolean; payload?: TooltipPayload[]; label?: string }

// ─── Custom tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 10,
      padding: "10px 14px", boxShadow: "0 4px 20px rgba(13,148,136,0.10)" }}>
      <p style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{label}</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>
          ₦{Number(payload[0].value).toLocaleString()}
        </span>
        <span style={{ fontSize: 11, color: C.teal, fontWeight: 600 }}>Revenue</span>
      </div>
    </div>
  );
};

const PERIODS = [
  { value: "week",    label: "Week"    },
  { value: "month",   label: "Month"   },
  { value: "quarter", label: "Quarter" },
  { value: "custom",  label: "Custom"  },
];

// ─── Segment control ─────────────────────────────────────────────────────────
function SegmentControl<T extends string>({
  options, value, onChange,
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", backgroundColor: C.snow,
      border: `1px solid ${C.border}`, borderRadius: 10, padding: 3, gap: 2 }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)}
            style={{ padding: "5px 12px", fontSize: 12, fontWeight: active ? 700 : 500,
              borderRadius: 8, border: "none", cursor: "pointer", whiteSpace: "nowrap",
              transition: "all 150ms",
              backgroundColor: active ? C.white : "transparent",
              color: active ? C.teal : C.muted,
              boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = C.ink; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = C.muted; }}>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent }: {
  label: string; value: string; sub?: React.ReactNode; accent: string;
}) {
  return (
    <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 12,
      padding: "16px 20px", borderLeft: `3px solid ${accent}` }}>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
        color: C.muted, marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1 }}>
        {value}
      </p>
      {sub && <div style={{ marginTop: 6, fontSize: 11 }}>{sub}</div>}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 16,
      padding: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 4px 24px rgba(13,148,136,0.06)" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ height: 24, width: 160, backgroundColor: C.light, borderRadius: 8 }} className="animate-pulse" />
        <div style={{ height: 24, width: 80, backgroundColor: C.light, borderRadius: 8, marginLeft: "auto" }} className="animate-pulse" />
      </div>
      <div style={{ height: 280, backgroundColor: C.snow, borderRadius: 12 }} className="animate-pulse" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 20 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: 80, backgroundColor: C.light, borderRadius: 12 }} className="animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 16,
      padding: 28, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
      <p style={{ color: C.muted, fontSize: 14 }}>Unable to load revenue data</p>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export function RevenueChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [chartType,      setChartType]      = useState<ChartType>("area");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate,      setStartDate]      = useState("");
  const [endDate,        setEndDate]        = useState("");


  const params = selectedPeriod === "custom" && startDate && endDate
    ? { period: "custom", startDate, endDate }
    : { period: selectedPeriod };

  const { data: chartData, isLoading, error } = useRevenueChart(params);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    if (period === "custom") {
      setShowDatePicker(true);
      const end = new Date(), start = new Date();
      start.setDate(start.getDate() - 30);
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
    } else {
      setShowDatePicker(false);
    }
  };

  const fmtDate = (ds: string) =>
    new Date(ds).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  if (isLoading) return <Skeleton />;
  if (error || !chartData)     return <ErrorState />;

  const totalRevenue  = chartData.reduce((s: number, d: RevenueChartData) => s + (Number(d.revenue) || 0), 0);
  const avgRevenue    = chartData.length > 0 ? totalRevenue / chartData.length : 0;
  const hasRevenue    = totalRevenue > 0;

  const half          = Math.floor(chartData.length / 2);
  const firstAvg      = chartData.slice(0, half).reduce((s: number, d: RevenueChartData) => s + (Number(d.revenue) || 0), 0) / (half || 1);
  const secondAvg     = chartData.slice(half).reduce((s: number, d: RevenueChartData) => s + (Number(d.revenue) || 0), 0) / ((chartData.length - half) || 1);
  const trend         = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;

  const data = chartData.map((item: RevenueChartData) => ({
    ...item,
    revenue:     item.revenue || 0,
    displayDate: item.date ? fmtDate(item.date) : "",
  }));

  const axisStyle = { fill: C.muted, fontSize: 11, fontWeight: 500 };
  const cp        = { data, margin: { top: 10, right: 10, left: 0, bottom: 0 } };
  const grid      = <CartesianGrid strokeDasharray="3 3" stroke={C.light} />;
  const xAxis     = <XAxis dataKey="displayDate" tick={axisStyle} tickLine={false} axisLine={false} />;
  const yAxis     = <YAxis tick={axisStyle} tickLine={false} axisLine={false}
                      tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />;
  const tip       = <Tooltip content={<CustomTooltip />} cursor={{ stroke: C.tealAlpha, strokeWidth: 1 }} />;

  const focusInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = C.teal;
    e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(13,148,136,0.12)";
  };
  const blurInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = C.border;
    e.currentTarget.style.boxShadow   = "none";
  };

  const renderChart = () => {
    if (chartType === "area") return (
      <AreaChart {...cp}>
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor={C.teal} stopOpacity={0.18} />
            <stop offset="95%" stopColor={C.teal} stopOpacity={0}    />
          </linearGradient>
        </defs>
        {grid}{xAxis}{yAxis}{tip}
        <Area type="monotone" dataKey="revenue" stroke={C.teal} strokeWidth={2}
          fill="url(#rg)" animationDuration={1200} />
      </AreaChart>
    );
    if (chartType === "bar") return (
      <BarChart {...cp}>
        {grid}{xAxis}{yAxis}{tip}
        <Bar dataKey="revenue" fill={C.teal} radius={[5, 5, 0, 0]} animationDuration={1200} />
      </BarChart>
    );
    return (
      <LineChart {...cp}>
        {grid}{xAxis}{yAxis}{tip}
        <Line type="monotone" dataKey="revenue" stroke={C.teal} strokeWidth={2.5}
          dot={{ fill: C.teal, r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: C.teal }}
          animationDuration={1200} />
      </LineChart>
    );
  };

  return (
    <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 16,
      overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 4px 24px rgba(13,148,136,0.06)" }}>

      {/* Header */}
      <div style={{ padding: "24px 24px 20px", borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em", margin: 0 }}>
            Revenue Analytics
          </h2>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
            Track payment performance over time
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <SegmentControl
            options={[{ value: "area", label: "Area" }, { value: "bar", label: "Bar" }, { value: "line", label: "Line" }]}
            value={chartType}
            onChange={setChartType}
          />
          <SegmentControl options={PERIODS} value={selectedPeriod} onChange={handlePeriodChange} />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px 24px" }}>

        {/* Custom date range picker */}
        {showDatePicker && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20,
            padding: "12px 16px", backgroundColor: C.snow, border: `1px solid ${C.border}`,
            borderRadius: 12, flexWrap: "wrap" }}>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              style={DATE_INPUT_STYLE} onFocus={focusInput} onBlur={blurInput} />
            <span style={{ color: C.muted, fontSize: 13, flexShrink: 0 }}>to</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              style={DATE_INPUT_STYLE} onFocus={focusInput} onBlur={blurInput} />
          </div>
        )}

        {/* Empty state */}
        {!hasRevenue && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20,
            padding: "12px 16px", backgroundColor: "rgba(13,148,136,0.04)",
            border: "1px solid rgba(13,148,136,0.15)", borderRadius: 12 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={C.teal} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ fontSize: 13, color: C.ink, lineHeight: 1.5 }}>
              No revenue recorded yet. Your revenue will appear here once you receive successful payments.
            </p>
          </div>
        )}

        {/* Chart */}
        <div style={{ marginBottom: 20 }}>
          <ResponsiveContainer width="100%" height={280}>
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Stats — auto-fit grid, 1-col on small, 3-col on wide */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          <StatCard
            label="Total Revenue"
            value={`₦${totalRevenue.toLocaleString()}`}
            accent={C.teal}
            sub={trend !== 0 ? (
              <span style={{ color: trend > 0 ? "#059669" : "#DC2626", fontWeight: 700 }}>
                {trend > 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}%{" "}
                <span style={{ color: C.muted, fontWeight: 400 }}>vs previous half</span>
              </span>
            ) : undefined}
          />
          <StatCard
            label="Average / Period"
            value={`₦${Math.round(avgRevenue).toLocaleString()}`}
            accent={C.coral}
          />
          <StatCard
            label="Data Points"
            value={String(chartData.length)}
            accent={C.faint}
            sub={<span style={{ color: C.muted }}>{selectedPeriod === "custom" ? "Custom range" : `Last ${selectedPeriod}`}</span>}
          />
        </div>
      </div>
    </div>
  );
}
