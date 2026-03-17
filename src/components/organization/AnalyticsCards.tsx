"use client";

import { Users, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { useAnalyticsOverview } from "../../hooks/useAnalytics";
import { useTeamMembers } from "../../hooks/useOrganisations";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MemberListDropdown } from "../ui";
import { MetricsDropdown } from "../ui";
import { LoadingSkeleton } from "../ui/Skeleton";
import { ErrorAlert } from "../ui/ErrorAlert";

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface SubStat {
  label: string;
  value: string | number;
}

interface StatCardProps {
  name: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "warning";
  icon: React.ElementType;
  accent: "teal" | "coral" | "muted";
  subStats: SubStat[];
  index: number;
  isExpanded: boolean;
  onClick: () => void;
}

function StatCard({
  name,
  value,
  change,
  changeType,
  icon: Icon,
  accent,
  subStats,
  index,
  isExpanded,
  onClick,
}: StatCardProps) {
  const accentStyles = {
    teal: {
      iconBg: "bg-[#0D9488]/10",
      iconColor: "text-[#0D9488]",
      valueBorder: "border-l-[#0D9488]",
    },
    coral: {
      iconBg: "bg-[#F06543]/10",
      iconColor: "text-[#F06543]",
      valueBorder: "border-l-[#F06543]",
    },
    muted: {
      iconBg: "bg-gray-100",
      iconColor: "text-[#9CA3AF]",
      valueBorder: "border-l-gray-300",
    },
  };

  const changeColors = {
    positive: "text-emerald-600",
    negative: "text-red-500",
    warning: "text-[#F06543]",
  };

  const styles = accentStyles[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      onClick={onClick}
      className={`bg-white rounded-xl border cursor-pointer select-none transition-all duration-200 ${
        isExpanded
          ? "border-[#0D9488]/40 shadow-md"
          : "border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
      }`}
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">
              {name}
            </p>
            <p className="text-2xl font-800 font-extrabold text-[#1F2937] leading-none">
              {value}
            </p>
          </div>
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${styles.iconBg}`}
          >
            <Icon className={`w-4 h-4 ${styles.iconColor}`} />
          </div>
        </div>

        {/* Change badge */}
        <p className={`text-xs font-semibold ${changeColors[changeType]} mb-3`}>
          {change}
        </p>

        {/* Sub stats */}
        {subStats.length > 0 && (
          <div className={`flex gap-4 pt-3 border-t border-gray-100`}>
            {subStats.map((s) => (
              <div key={s.label}>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">
                  {s.label}
                </p>
                <p className="text-sm font-bold text-[#1F2937]">{s.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expand indicator */}
      <div className={`flex items-center justify-center pb-3`}>
        <span
          className={`text-xs font-semibold transition-colors ${isExpanded ? "text-[#0D9488]" : "text-[#9CA3AF]"}`}
        >
          {isExpanded ? "↑ Collapse" : "↓ View details"}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Analytics Cards ──────────────────────────────────────────────────────────

export function AnalyticsCards() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useAnalyticsOverview({ period: "month" });

  const { data: teamMembers, isLoading: teamLoading } = useTeamMembers();

  const isLoading = analyticsLoading || teamLoading;

  const memberStats = useMemo(() => {
    if (!teamMembers) return { active: 0, inactive: 0, total: 0 };
    const members = teamMembers.filter((m) => m.role === "MEMBER");
    const active = members.filter((m) => m.status === "active").length;
    const inactive = members.filter((m) => m.status === "inactive").length;
    return { active, inactive, total: members.length };
  }, [teamMembers]);

  if (isLoading) return <LoadingSkeleton count={4} />;
  if (analyticsError || !analytics) return <ErrorAlert />;

  const activeMembers =
    analytics.members.active_members ??
    memberStats.active ??
    analytics.subscriptions.active_subscriptions ??
    0;
  const inactiveMembers =
    analytics.members.inactive_members ??
    memberStats.inactive ??
    Math.max(0, memberStats.total - activeMembers) ??
    0;
  const totalMembers = memberStats.total || 0;

  const stats = [
    {
      name: "Total Members",
      value: totalMembers.toString(),
      change: `+${analytics.members.new_members || 0} this period`,
      changeType: "positive" as const,
      icon: Users,
      accent: "teal" as const,
      subStats: [
        { label: "Active", value: activeMembers },
        { label: "Inactive", value: inactiveMembers },
      ],
      details: {
        title: "Member Statistics",
        metrics: [
          {
            label: "Total Members",
            value: totalMembers,
            description: "All registered members",
          },
          {
            label: "Active Members",
            value: activeMembers,
            description: "Currently active subscriptions",
          },
          {
            label: "Inactive Members",
            value: inactiveMembers,
            description: "Paused or expired",
          },
          {
            label: "New This Period",
            value: analytics.members.new_members || 0,
            description: "Recent sign-ups",
          },
        ],
      },
      dropdownType: "members" as const,
    },
    {
      name: "Month Revenue",
      value: `₦${((analytics.revenue.period_revenue || 0) / 1000).toFixed(1)}K`,
      change: `${analytics.revenue.growth_rate >= 0 ? "+" : ""}${(analytics.revenue.growth_rate || 0).toFixed(1)}% from last period`,
      changeType:
        (analytics.revenue.growth_rate || 0) >= 0
          ? ("positive" as const)
          : ("negative" as const),
      icon: DollarSign,
      accent: "teal" as const,
      subStats: [
        {
          label: "Successful Payments",
          value: analytics.payments.successful_payments || 0,
        },
        {
          label: "Total Revenue",
          value: `₦${(analytics.revenue.total_revenue || 0).toLocaleString()}`,
        },
      ],
      details: {
        title: "Revenue Breakdown",
        metrics: [
          {
            label: "Period Revenue",
            value: `₦${analytics.revenue.period_revenue?.toLocaleString() || 0}`,
            description: "This period's earnings",
          },
          {
            label: "Total Revenue",
            value: `₦${analytics.revenue.total_revenue?.toLocaleString() || 0}`,
            description: "All-time revenue",
          },
          {
            label: "Growth Rate",
            value: `${(analytics.revenue.growth_rate || 0).toFixed(1)}%`,
            description: "Compared to last period",
          },
          {
            label: "Successful Payments",
            value: analytics.payments.successful_payments || 0,
            description: "Completed transactions",
          },
        ],
      },
      dropdownType: "metrics" as const,
    },
    {
      name: "MRR",
      value: `₦${((analytics.mrr.current_mrr || 0) / 1000).toFixed(1)}K`,
      change: `${analytics.mrr.growth_rate >= 0 ? "+" : ""}${(analytics.mrr.growth_rate || 0).toFixed(1)}% growth`,
      changeType:
        (analytics.mrr.growth_rate || 0) >= 0
          ? ("positive" as const)
          : ("negative" as const),
      icon: TrendingUp,
      accent: "teal" as const,
      subStats: [
        {
          label: "Active Subs",
          value: analytics.subscriptions.active_subscriptions || 0,
        },
      ],
      details: {
        title: "MRR Details",
        metrics: [
          {
            label: "Current MRR",
            value: `₦${analytics.mrr.current_mrr?.toLocaleString() || 0}`,
            description: "Monthly recurring revenue",
          },
          {
            label: "MRR Growth",
            value: `${(analytics.mrr.growth_rate || 0).toFixed(1)}%`,
            description: "Month-over-month growth",
          },
          {
            label: "Active Subscriptions",
            value: analytics.subscriptions.active_subscriptions || 0,
            description: "Current active plans",
          },
          {
            label: "Avg. per Sub",
            value: `₦${Math.round((analytics.mrr.current_mrr || 0) / Math.max(1, analytics.subscriptions.active_subscriptions || 1)).toLocaleString()}`,
            description: "Revenue per subscription",
          },
        ],
      },
      dropdownType: "metrics" as const,
    },
    {
      name: "Needs Attention",
      value: inactiveMembers.toString(),
      change: `${inactiveMembers} inactive members`,
      changeType: "warning" as const,
      icon: AlertCircle,
      accent: "coral" as const,
      subStats: [],
      details: {
        title: "Attention Required",
        metrics: [
          {
            label: "Inactive Members",
            value: inactiveMembers,
            description: "Members to follow up with",
          },
          {
            label: "Retention Rate",
            value: `${Math.round((activeMembers / Math.max(1, totalMembers)) * 100)}%`,
            description: "Active/Total ratio",
          },
          {
            label: "At Risk",
            value: inactiveMembers,
            description: "Potential churn",
          },
        ],
      },
      dropdownType: "members" as const,
    },
  ];

  return (
    <div
      className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {stats.map((stat, index) => {
        const isExpanded = expandedCard === stat.name;

        return (
          <div key={stat.name} className="relative">
            <StatCard
              name={stat.name}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={stat.icon}
              accent={stat.accent}
              subStats={stat.subStats}
              index={index}
              isExpanded={isExpanded}
              onClick={() => setExpandedCard(isExpanded ? null : stat.name)}
            />

            <AnimatePresence>
              {isExpanded && (
                <>
                  {stat.dropdownType === "members" && teamMembers && (
                    <MemberListDropdown
                      title={stat.details.title}
                      members={teamMembers.filter((m) => m.role === "MEMBER")}
                      gradient="from-[#0D9488] to-[#0B7A70]"
                      onClose={(e) => {
                        e.stopPropagation();
                        setExpandedCard(null);
                      }}
                      filterInactive={stat.name === "Needs Attention"}
                    />
                  )}

                  {stat.dropdownType === "metrics" && (
                    <MetricsDropdown
                      title={stat.details.title}
                      metrics={stat.details.metrics}
                      gradient="from-[#0D9488] to-[#0B7A70]"
                      onClose={(e) => {
                        e.stopPropagation();
                        setExpandedCard(null);
                      }}
                    />
                  )}
                </>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
