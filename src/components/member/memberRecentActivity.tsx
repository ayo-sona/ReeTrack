"use client";

import { CheckCircle, CreditCard, Award, TrendingUp } from "lucide-react";
import { useRecentActivity } from "@/hooks/memberHook/useRecentActivity";
import type { Activity } from "@/hooks/memberHook/useRecentActivity";

// ============================================
// ACTIVITY ICON MAPPER
// ============================================

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "payment":
      return <CreditCard className="w-5 h-5 text-green-600" />;
    case "check_in":
      return <CheckCircle className="w-5 h-5 text-blue-600" />;
    case "badge":
      return <Award className="w-5 h-5 text-yellow-600" />;
    case "subscription":
      return <TrendingUp className="w-5 h-5 text-purple-600" />;
    default:
      return <CheckCircle className="w-5 h-5 text-gray-600" />;
  }
};

const getActivityBgColor = (type: Activity["type"]) => {
  switch (type) {
    case "payment":
      return "bg-green-100";
    case "check_in":
      return "bg-blue-100";
    case "badge":
      return "bg-yellow-100";
    case "subscription":
      return "bg-purple-100";
    default:
      return "bg-gray-100";
  }
};

// ============================================
// ACTIVITY ITEM COMPONENT
// ============================================

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem = ({ activity }: ActivityItemProps) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityBgColor(activity.type)}`}
      >
        {getActivityIcon(activity.type)}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">{activity.title}</p>
        <p className="text-sm text-gray-600 truncate">{activity.description}</p>
        <p className="text-xs text-gray-500 mt-1">
          {formatTime(activity.timestamp)}
        </p>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function RecentActivity() {
  const { data: activities, isLoading } = useRecentActivity(5); // Show last 5

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No recent activity</p>
          <p className="text-sm text-gray-500 mt-2">
            Your payments, check-ins, and badges will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>

      <div className="space-y-2">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>

      {/* Optional: View All Link */}
      {activities.length >= 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            View All Activity →
          </button>
        </div>
      )}
    </div>
  );
}