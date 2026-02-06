"use client";

import { Users, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { useAnalyticsOverview } from "../../hooks/useAnalytics";
import { useTeamMembers } from "../../hooks/useOrganisations";
import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { StatCard } from "../ui/StatCard";
import { MemberListDropdown } from "../ui";
import { MetricsDropdown } from "../ui";
import { LoadingSkeleton } from "../ui/Skeleton";
import { ErrorAlert } from "../ui/ErrorAlert";

export function AnalyticsCards() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useAnalyticsOverview({
    period: "month",
  });

  const { data: teamMembers, isLoading: teamLoading } = useTeamMembers();

  const isLoading = analyticsLoading || teamLoading;

  const memberStats = useMemo(() => {
    if (!teamMembers) {
      return { active: 0, inactive: 0, total: 0 };
    }

    const members = teamMembers.filter((m) => m.role === "MEMBER");
    const active = members.filter((m) => m.status === "active").length;
    const inactive = members.filter((m) => m.status === "inactive").length;

    return {
      active,
      inactive,
      total: members.length,
    };
  }, [teamMembers]);

  if (isLoading) {
    return <LoadingSkeleton count={4} />;
  }

  if (analyticsError || !analytics) {
    return <ErrorAlert />;
  }

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
      gradient: "from-blue-400 via-blue-500 to-indigo-500",
      glowColor: "blue",
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
      name: "This Month Revenue",
      value: `₦${((analytics.revenue.period_revenue || 0) / 1000).toFixed(1)}K`,
      change: `${analytics.revenue.growth_rate >= 0 ? "+" : ""}${(analytics.revenue.growth_rate || 0).toFixed(1)}% from last period`,
      changeType:
        (analytics.revenue.growth_rate || 0) >= 0
          ? ("positive" as const)
          : ("negative" as const),
      icon: DollarSign,
      gradient: "from-emerald-400 via-emerald-500 to-teal-500",
      glowColor: "emerald",
      subStats: [
        {
          label: "Payments",
          value: analytics.payments.successful_payments || 0,
        },
        {
          label: "Total",
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
      gradient: "from-purple-400 via-purple-500 to-indigo-500",
      glowColor: "purple",
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
            label: "Average per Sub",
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
      gradient: "from-orange-400 via-orange-500 to-red-500",
      glowColor: "orange",
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
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
              gradient={stat.gradient}
              glowColor={stat.glowColor}
              subStats={stat.subStats}
              index={index}
              isExpanded={isExpanded}
              onClick={() => setExpandedCard(isExpanded ? null : stat.name)}
            />

            {/* Dropdown Panel */}
            <AnimatePresence>
              {isExpanded && (
                <>
                  {stat.dropdownType === "members" && teamMembers && (
                    <MemberListDropdown
                      title={stat.details.title}
                      members={teamMembers.filter((m) => m.role === "MEMBER")}
                      gradient={stat.gradient}
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
                      gradient={stat.gradient}
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
