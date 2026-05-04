"use client";

import Link from "next/link";
import {
  Gift,
  Flame,
  Trophy,
  Users,
  ChevronRight,
  Check,
  Lock,
  Zap,
  ArrowLeft,
  Copy,
} from "lucide-react";

const C = {
  teal: "#0D9488",
  snow: "#F9FAFB",
  ink: "#1F2937",
  muted: "#6B7280",
  coolGrey: "#9CA3AF",
  border: "#E5E7EB",
  amber: "#F59E0B",
  purple: "#8B5CF6",
  green: "#16A34A",
  white: "#FFFFFF",
};

// Demo data — swap with real API
const DEMO = {
  tier: "Rise",
  tierLevel: 2,
  tierProgress: 40,
  checkInsToNextTier: 18,
  streak: 12,
  rank: 3,
  checkInsThisMonth: 12,
  checkInsGoal: 15,
  consecutiveMonths: 2,
  consecutiveMonthsGoal: 3,
  friendsReferred: 1,
  totalRewardsEarned: 1000,
  leaderboardDaysInTop3: 2,
  leaderboardDaysGoal: 7,
} as const;

const TIERS = [
  { name: "Spark", level: 1, color: C.amber },
  { name: "Rise", level: 2, color: C.teal },
  { name: "Apex", level: 3, color: C.purple },
  { name: "Legend", level: 4, color: "#D97706" },
] as const;

const currentTier = TIERS.find((t) => t.name === DEMO.tier)!;
const nextTier = TIERS.find((t) => t.level === DEMO.tierLevel + 1);

export default function MemberRewardsPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: C.snow, fontFamily: "Nunito, sans-serif" }}
    >
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/member/dashboard">
            <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] transition-colors">
              <ArrowLeft className="w-4 h-4" style={{ color: C.ink }} />
            </button>
          </Link>
          <div>
            <h1
              className="text-2xl font-extrabold"
              style={{ color: C.ink }}
            >
              Rewards & Progress
            </h1>
            <p
              className="text-sm font-medium"
              style={{ color: C.coolGrey }}
            >
              Track your journey and unlock exclusive rewards
            </p>
          </div>
        </div>

        {/* Tier Card */}
        <div
          className="rounded-2xl p-6 overflow-hidden relative shadow-md"
          style={{
            background: `linear-gradient(135deg, ${currentTier.color} 0%, ${currentTier.color}CC 100%)`,
          }}
        >
          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
          <div
            className="absolute -bottom-8 right-32 w-28 h-28 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />

          <div className="relative">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-white/70 text-sm font-semibold mb-1">
                  Current Tier
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-extrabold text-white">
                    {DEMO.tier}
                  </span>
                  <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full mt-1">
                    {DEMO.tierLevel} / 4
                  </span>
                </div>
                {nextTier && (
                  <p className="text-white/70 text-sm mt-2">
                    {DEMO.checkInsToNextTier} check-ins to reach{" "}
                    <span className="font-bold text-white">{nextTier.name}</span>
                  </p>
                )}
              </div>
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>

            {nextTier && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                  <span>Progress to {nextTier.name}</span>
                  <span className="font-bold text-white">
                    {DEMO.tierProgress}%
                  </span>
                </div>
                <div
                  className="h-3 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${DEMO.tierProgress}%`,
                      background: "rgba(255,255,255,0.9)",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Tier progression chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {TIERS.map((t, i) => (
                <div key={t.name} className="flex items-center gap-1.5">
                  <div
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                    style={
                      t.level < DEMO.tierLevel
                        ? { background: "rgba(255,255,255,0.3)", color: "white" }
                        : t.level === DEMO.tierLevel
                          ? {
                              background: "white",
                              color: currentTier.color,
                            }
                          : {
                              background: "rgba(255,255,255,0.1)",
                              color: "rgba(255,255,255,0.45)",
                            }
                    }
                  >
                    {t.level < DEMO.tierLevel && (
                      <Check className="w-3 h-3 mr-0.5" />
                    )}
                    {t.name}
                  </div>
                  {i < TIERS.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-white/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Day Streak", value: `🔥 ${DEMO.streak}`, sub: "days" },
            {
              label: "Leaderboard Rank",
              value: `#${DEMO.rank}`,
              sub: "this month",
            },
            {
              label: "Check-ins",
              value: `${DEMO.checkInsThisMonth}/${DEMO.checkInsGoal}`,
              sub: "this month",
            },
            {
              label: "Rewards Earned",
              value: `₦${DEMO.totalRewardsEarned.toLocaleString()}`,
              sub: "total",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 border shadow-sm"
              style={{ borderColor: C.border }}
            >
              <p
                className="text-2xl font-extrabold"
                style={{ color: C.ink }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs font-semibold mt-0.5"
                style={{ color: C.coolGrey }}
              >
                {stat.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: C.coolGrey }}>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Milestone Progress — 2 cols */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Consistency */}
          <div
            className="bg-white rounded-xl p-5 border shadow-sm"
            style={{ borderColor: C.border }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#CCFBF1" }}
              >
                <Flame className="w-4 h-4" style={{ color: C.teal }} />
              </div>
              <h3
                className="font-bold text-base"
                style={{ color: C.ink }}
              >
                Consistency Rewards
              </h3>
            </div>

            <div className="space-y-4">
              <ProgressMilestone
                label="Monthly Check-ins"
                current={DEMO.checkInsThisMonth}
                goal={DEMO.checkInsGoal}
                reward="10% off next payment"
                unit="check-ins"
              />
              <ProgressMilestone
                label="Consecutive Active Months"
                current={DEMO.consecutiveMonths}
                goal={DEMO.consecutiveMonthsGoal}
                reward="40% off next payment"
                unit="months"
              />
            </div>

            <div
              className="mt-4 pt-4 border-t"
              style={{ borderColor: C.border }}
            >
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: C.coolGrey }}
              >
                Coming up next
              </p>
              <div className="space-y-1.5">
                {[
                  { milestone: "6 consecutive months", reward: "One free month" },
                  {
                    milestone: "12 consecutive months",
                    reward: "Two free months",
                  },
                ].map((m) => (
                  <div
                    key={m.milestone}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs" style={{ color: C.muted }}>
                      {m.milestone}
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: C.teal }}
                    >
                      {m.reward}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div
            className="bg-white rounded-xl p-5 border shadow-sm"
            style={{ borderColor: C.border }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#FEF3C7" }}
              >
                <Trophy className="w-4 h-4" style={{ color: C.amber }} />
              </div>
              <h3
                className="font-bold text-base"
                style={{ color: C.ink }}
              >
                Leaderboard Rewards
              </h3>
            </div>

            <div className="space-y-3 mb-4">
              <div
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-extrabold text-lg shrink-0"
                  style={{ background: C.amber, color: "white" }}
                >
                  #{DEMO.rank}
                </div>
                <div>
                  <p
                    className="font-bold text-sm"
                    style={{ color: C.ink }}
                  >
                    You&apos;re ranked #{DEMO.rank} this month
                  </p>
                  <p className="text-xs" style={{ color: C.coolGrey }}>
                    Keep pushing to maintain Top 3!
                  </p>
                </div>
              </div>

              <ProgressMilestone
                label="Days in Top 3 (consecutive)"
                current={DEMO.leaderboardDaysInTop3}
                goal={DEMO.leaderboardDaysGoal}
                reward="10% off next payment"
                unit="days"
                color={C.amber}
              />
            </div>

            <div
              className="pt-4 border-t"
              style={{ borderColor: C.border }}
            >
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: C.coolGrey }}
              >
                More leaderboard rewards
              </p>
              <div className="space-y-1.5">
                {[
                  { milestone: "Top 3 for 2 months", reward: "40% off" },
                  {
                    milestone: "#1 for 3 consecutive weeks",
                    reward: "50% off",
                  },
                  {
                    milestone: "#1 for 2 consecutive months",
                    reward: "Free month!",
                  },
                ].map((m) => (
                  <div
                    key={m.milestone}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs" style={{ color: C.muted }}>
                      {m.milestone}
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: C.amber }}
                    >
                      {m.reward}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Referrals */}
        <div
          className="bg-white rounded-xl p-5 border shadow-sm"
          style={{ borderColor: C.border }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#EDE9FE" }}
              >
                <Users className="w-4 h-4" style={{ color: C.purple }} />
              </div>
              <h3
                className="font-bold text-base"
                style={{ color: C.ink }}
              >
                Referrals
              </h3>
            </div>
            <button
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors hover:bg-[#F9FAFB]"
              style={{ color: C.purple, borderColor: "#DDD6FE" }}
            >
              <Copy className="w-3.5 h-3.5" /> Copy Link
            </button>
          </div>

          <div
            className="flex items-center gap-4 p-4 rounded-xl mb-4"
            style={{ background: "#F5F3FF", border: "1px solid #DDD6FE" }}
          >
            <div className="text-center">
              <p
                className="text-3xl font-extrabold"
                style={{ color: C.purple }}
              >
                {DEMO.friendsReferred}
              </p>
              <p
                className="text-xs font-semibold mt-0.5"
                style={{ color: C.coolGrey }}
              >
                friend referred
              </p>
            </div>
            <div
              className="flex-1 h-px"
              style={{ background: "#DDD6FE" }}
            />
            <div className="text-right">
              <p className="font-bold text-sm" style={{ color: C.ink }}>
                ₦1,000 earned!
              </p>
              <p className="text-xs" style={{ color: C.coolGrey }}>
                Refer 3 for ₦5,000 off
              </p>
            </div>
          </div>

          <ProgressMilestone
            label="Referral Progress"
            current={DEMO.friendsReferred}
            goal={3}
            reward="₦5,000 off next payment"
            unit="friends"
            color={C.purple}
          />

          <div
            className="mt-4 pt-4 border-t"
            style={{ borderColor: C.border }}
          >
            <div className="grid grid-cols-2 gap-3">
              {[
                { goal: "5 friends", reward: "50% off" },
                {
                  goal: "15+ friends",
                  reward: "Permanent 10% off every payment",
                },
              ].map((m) => (
                <div
                  key={m.goal}
                  className="p-3 rounded-xl"
                  style={{
                    background: C.snow,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <p
                    className="text-xs font-bold"
                    style={{ color: C.ink }}
                  >
                    {m.goal}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: C.purple }}
                  >
                    {m.reward}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Earned Rewards */}
        <div
          className="bg-white rounded-xl p-5 border shadow-sm"
          style={{ borderColor: C.border }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#DCFCE7" }}
            >
              <Gift className="w-4 h-4" style={{ color: C.green }} />
            </div>
            <h3
              className="font-bold text-base"
              style={{ color: C.ink }}
            >
              Earned Rewards
            </h3>
          </div>

          <div
            className="flex items-center justify-between p-4 rounded-xl border"
            style={{ borderColor: "#86EFAC", background: "#F0FDF4" }}
          >
            <div>
              <p
                className="font-bold text-sm"
                style={{ color: C.ink }}
              >
                ₦1,000 off next payment
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: C.coolGrey }}
              >
                Referred 1 friend · Expires in 30 days
              </p>
            </div>
            <button
              className="text-xs font-bold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-80"
              style={{ background: C.green }}
            >
              Claim
            </button>
          </div>
        </div>

        {/* Surprise Drops */}
        <div
          className="rounded-2xl p-5 overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #1F2937 0%, #374151 100%)",
          }}
        >
          <div
            className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.03)" }}
          />
          <div className="relative flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <Lock className="w-6 h-6 text-white/60" />
            </div>
            <div>
              <p className="font-bold text-white text-base">Surprise Drops</p>
              <p className="text-white/60 text-sm mt-1 leading-relaxed">
                Festive season discounts, random loyalty appreciation drops
                (₦1,000–₦3,000), member anniversaries, and platform milestones
                — exclusive for active members. Stay active to stay eligible.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  "Festive Seasons",
                  "Loyalty Drops",
                  "Anniversaries",
                  "Platform Milestones",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Progress Milestone helper ─────────────────────────────────────────────────
interface ProgressMilestoneProps {
  label: string;
  current: number;
  goal: number;
  reward: string;
  unit: string;
  color?: string;
}

function ProgressMilestone({
  label,
  current,
  goal,
  reward,
  unit,
  color = C.teal,
}: ProgressMilestoneProps) {
  const pct = Math.min(Math.round((current / goal) * 100), 100);
  const left = goal - current;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold" style={{ color: C.ink }}>
          {label}
        </span>
        <span className="text-xs font-bold" style={{ color }}>
          {current}/{goal} {unit}
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden mb-1"
        style={{ background: "#F3F4F6" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <p className="text-xs" style={{ color: C.coolGrey }}>
        {left > 0 ? `${left} more ${unit} → ` : "Completed → "}
        <span className="font-semibold" style={{ color }}>
          {reward}
        </span>
      </p>
    </div>
  );
}
