"use client";

import { CheckCircle, CreditCard, Award, TrendingUp } from "lucide-react";
import { useRecentActivity } from "@/hooks/memberHook/useRecentActivity";
import type { Activity } from "@/hooks/memberHook/useRecentActivity";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const C = {
  teal:     "#0D9488",
  snow:     "#F9FAFB",
  white:    "#FFFFFF",
  ink:      "#1F2937",
  coolGrey: "#9CA3AF",
  border:   "#E5E7EB",
  skeleton: "#E5E7EB",
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ============================================
// ACTIVITY ICON MAPPER
// ============================================

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "payment":
      return <CreditCard size={18} style={{ color: C.teal }} />;
    case "check_in":
      return <CheckCircle size={18} style={{ color: C.teal }} />;
    case "badge":
      return <Award size={18} style={{ color: "#D97706" }} />;
    case "subscription":
      return <TrendingUp size={18} style={{ color: C.teal }} />;
    default:
      return <CheckCircle size={18} style={{ color: C.coolGrey }} />;
  }
};

const getActivityBgColor = (type: Activity["type"]) => {
  switch (type) {
    case "payment":
      return "rgba(13,148,136,0.1)";
    case "check_in":
      return "rgba(13,148,136,0.1)";
    case "badge":
      return "rgba(251,191,36,0.12)";
    case "subscription":
      return "rgba(13,148,136,0.1)";
    default:
      return C.snow;
  }
};

// ============================================
// ACTIVITY ITEM COMPONENT
// ============================================

interface ActivityItemProps {
  activity: Activity;
  index: number;
}

const ActivityItem = ({ activity, index }: ActivityItemProps) => {
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
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={index}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        padding: "14px 16px",
        borderRadius: "8px",
        cursor: "default",
        transition: "background 200ms",
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = C.snow}
      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: getActivityBgColor(activity.type),
        }}
      >
        {getActivityIcon(activity.type)}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "Nunito, sans-serif",
          fontWeight: 600,
          fontSize: "14px",
          color: C.ink,
          marginBottom: "2px",
        }}>
          {activity.title}
        </p>
        <p style={{
          fontFamily: "Nunito, sans-serif",
          fontWeight: 400,
          fontSize: "13px",
          color: C.coolGrey,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginBottom: "4px",
        }}>
          {activity.description}
        </p>
        <p style={{
          fontFamily: "Nunito, sans-serif",
          fontWeight: 400,
          fontSize: "12px",
          color: C.coolGrey,
        }}>
          {formatTime(activity.timestamp)}
        </p>
      </div>
    </motion.div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function RecentActivity() {
  const { data: activities, isLoading } = useRecentActivity(5);

  if (isLoading) {
    return (
      <div style={{
        background: C.white,
        borderRadius: "16px",
        padding: "28px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        border: `1px solid ${C.border}`,
        fontFamily: "Nunito, sans-serif",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>

        <h2 style={{
          fontWeight: 700,
          fontSize: "18px",
          color: C.teal,
          marginBottom: "24px",
          letterSpacing: "-0.2px",
        }}>
          Recent Activity
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              animation: "pulse 1.5s ease-in-out infinite",
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                background: C.skeleton,
                borderRadius: "8px",
                flexShrink: 0,
              }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ height: "14px", background: C.skeleton, borderRadius: "4px", width: "75%" }} />
                <div style={{ height: "12px", background: C.skeleton, borderRadius: "4px", width: "50%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div style={{
        background: C.white,
        borderRadius: "16px",
        padding: "28px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        border: `1px solid ${C.border}`,
        fontFamily: "Nunito, sans-serif",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        `}</style>

        <h2 style={{
          fontWeight: 700,
          fontSize: "18px",
          color: C.teal,
          marginBottom: "24px",
          letterSpacing: "-0.2px",
        }}>
          Recent Activity
        </h2>

        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <div style={{
            width: "72px",
            height: "72px",
            borderRadius: "18px",
            background: C.snow,
            border: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            color: C.coolGrey,
          }}>
            <TrendingUp size={32} />
          </div>
          <p style={{
            fontWeight: 600,
            fontSize: "16px",
            color: C.ink,
            marginBottom: "6px",
          }}>
            No recent activity
          </p>
          <p style={{
            fontWeight: 400,
            fontSize: "14px",
            color: C.coolGrey,
            lineHeight: 1.5,
          }}>
            Your payments, check-ins, and badges will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: C.white,
      borderRadius: "16px",
      padding: "28px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      border: `1px solid ${C.border}`,
      fontFamily: "Nunito, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
      `}</style>

      <h2 style={{
        fontWeight: 700,
        fontSize: "18px",
        color: C.teal,
        marginBottom: "20px",
        letterSpacing: "-0.2px",
      }}>
        Recent Activity
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {activities.map((activity, i) => (
          <ActivityItem key={activity.id} activity={activity} index={i} />
        ))}
      </div>

      {/* View All Link */}
      {activities.length >= 5 && (
        <div style={{
          marginTop: "16px",
          paddingTop: "16px",
          borderTop: `1px solid ${C.border}`,
        }}>
          <Button variant="ghost" size="sm" className="w-full">
            View All Activity →
          </Button>
        </div>
      )}
    </div>
  );
}