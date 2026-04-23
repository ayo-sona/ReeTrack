"use client";

import { motion } from "framer-motion";
import { X, Sparkles, Trophy } from "lucide-react";
// import { Member } from "@/types/organization";
import { useState, useMemo } from "react";
import Image from "next/image";
import { LeaderboardMemberRaw } from "@/hooks/useMembers";

const C = {
  teal: "#0D9488",
  coral: "#F06543",
  snow: "#F9FAFB",
  white: "#FFFFFF",
  ink: "#1F2937",
  coolGrey: "#9CA3AF",
  border: "#E5E7EB",
  gold: "#F59E0B",
  purple: "#8B5CF6",
};

const MONTHLY_THRESHOLD = 15;

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  currentWeekCheckIns: number;
  isStreakActive: boolean;
  streakStartDate: string | null;
  weeksWithCheckIns: Array<{
    weekStart: string;
    weekEnd: string;
    checkInCount: number;
    meetsRequirement: boolean;
  }>;
}

export interface LeaderboardMember extends LeaderboardMemberRaw {
  score: number;
  monthCount: number;
  qualifies: boolean;
}

function getCheckInCount(
  checked_in_at: string[] | string | null | undefined,
): number {
  if (!checked_in_at) return 0;
  const timestamps = Array.isArray(checked_in_at)
    ? checked_in_at
    : [checked_in_at];
  const now = new Date();
  return timestamps.filter((t) => {
    const d = new Date(t);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;
}

interface MemberStatsModalProps {
  member: LeaderboardMember;
  rank: number;
  onClose: () => void;
}

export function MemberStatsModal({
  member,
  rank,
  onClose,
}: MemberStatsModalProps) {
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const name = `${member.user.first_name} ${member.user.last_name}`;
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();
  const streak = (member as unknown as { streakInfo?: StreakInfo }).streakInfo;
  const checkedInAt = member.checked_in_at;
  const totalCheckIns = Array.isArray(checkedInAt) ? checkedInAt.length : 0;
  const thisMonth = getCheckInCount(checkedInAt);

  // const daysInCommunity = useMemo(() => {
  //   if (!member.created_at) return 0;
  //   const memberSince = new Date(member.created_at);
  //   const now = new Date();
  //   return Math.floor((now.getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24));
  // }, [member.created_at]);
  // const lastCheckIn =
  //   Array.isArray(checkedInAt) && checkedInAt.length > 0
  //     ? new Date(checkedInAt[0])
  //     : null;

  const rankGradient =
    rank === 1
      ? "linear-gradient(135deg, #F59E0B, #D97706)"
      : rank === 2
        ? "linear-gradient(135deg, #6366F1, #4F46E5)"
        : rank === 3
          ? "linear-gradient(135deg, #CD7F32, #A0522D)"
          : `linear-gradient(135deg, ${C.teal}, #0F766E)`;

  const achievements: { emoji: string; label: string; desc: string }[] = [];
  if (totalCheckIns >= 1)
    achievements.push({
      emoji: "🌱",
      label: "First Steps",
      desc: "First check-in",
    });
  if (totalCheckIns >= 10)
    achievements.push({ emoji: "⭐", label: "Regular", desc: "10 check-ins" });
  if (totalCheckIns >= 25)
    achievements.push({
      emoji: "💪",
      label: "Dedicated",
      desc: "25 check-ins",
    });
  if (totalCheckIns >= 50)
    achievements.push({ emoji: "🔥", label: "On Fire", desc: "50 check-ins" });
  if (totalCheckIns >= 100)
    achievements.push({ emoji: "👑", label: "Legend", desc: "100 check-ins" });
  if ((streak?.longestStreak ?? 0) >= 3)
    achievements.push({
      emoji: "⚡",
      label: "Streak Master",
      desc: "3+ week streak",
    });
  if (thisMonth >= MONTHLY_THRESHOLD)
    achievements.push({
      emoji: "🏆",
      label: "Qualifier",
      desc: `${MONTHLY_THRESHOLD}+ this month`,
    });
  if (rank <= 3)
    achievements.push({ emoji: "🥇", label: "Podium", desc: `Rank #${rank}` });

  const weeks = streak?.weeksWithCheckIns ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(8px)",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 440,
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: 24,
          background: C.white,
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
          position: "relative",
        }}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div
          style={{
            background: rankGradient,
            borderRadius: "24px 24px 0 0",
            padding: "28px 24px 48px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -20,
              left: -20,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 60,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
            }}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              backdropFilter: "blur(4px)",
            }}
          >
            <X size={16} />
          </button>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.15,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`relative overflow-hidden rounded-full flex items-center justify-center font-extrabold text-white bg-white/25 shadow-2xl
      ${
        rank === 1
          ? "w-24 h-24 text-3xl border-4 border-white/50"
          : "w-[72px] h-[72px] text-2xl border-[3px] border-white/50"
      }`}
              >
                {member.user.avatarUrl ? (
                  <Image
                    src={member.user.avatarUrl}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  initials
                )}
              </motion.div>

              {/* ✅ rank badge below — not overlapping */}
              <div className="inline-flex items-center justify-center px-3 py-0.5 rounded-full bg-white/20 backdrop-blur border border-white/30 font-extrabold text-xs text-white">
                #{rank}
              </div>
            </div>
            <p
              style={{
                fontWeight: 800,
                fontSize: 20,
                color: "white",
                textAlign: "center",
              }}
            >
              {name}
            </p>
            <p
              style={{
                fontWeight: 500,
                fontSize: 12,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              {member.user.email}
            </p>
          </div>
        </div>

        {/* ── Streak banner ───────────────────────────────────────────────── */}
        <div
          style={{ margin: "-28px 16px 0", position: "relative", zIndex: 2 }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{
              background: streak?.isStreakActive
                ? "linear-gradient(135deg, #F97316, #EF4444)"
                : `linear-gradient(135deg, ${C.coolGrey}, #6B7280)`,
              borderRadius: 16,
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: streak?.isStreakActive
                ? "0 8px 24px rgba(249,115,22,0.3)"
                : "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>
                {streak?.isStreakActive ? "🔥" : "💤"}
              </span>
              <div>
                <p
                  style={{
                    fontWeight: 800,
                    fontSize: 18,
                    color: "white",
                    lineHeight: 1,
                  }}
                >
                  {streak?.currentStreak ?? 0} week
                  {(streak?.currentStreak ?? 0) !== 1 ? "s" : ""}
                </p>
                <p
                  style={{
                    fontWeight: 500,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  {streak?.isStreakActive
                    ? "Current streak — keep it going!"
                    : "No active streak"}
                </p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: 10,
                  color: "rgba(255,255,255,0.7)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Best
              </p>
              <p style={{ fontWeight: 800, fontSize: 18, color: "white" }}>
                {streak?.longestStreak ?? 0}🏅
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── 30-day activity strip ──────────────────────────────────────── */}
        <div style={{ padding: "20px 16px 0" }}>
          <div
            style={{
              background: C.snow,
              borderRadius: 16,
              padding: "14px 16px",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <p style={{ fontWeight: 700, fontSize: 13, color: C.ink }}>
                Last 30 days
              </p>
              <p style={{ fontWeight: 500, fontSize: 11, color: C.coolGrey }}>
                {thisMonth} check-in{thisMonth !== 1 ? "s" : ""} this month
              </p>
            </div>

            {/* Dot grid */}
            {(() => {
              const checkedDays = new Set<number>();
              if (Array.isArray(checkedInAt)) {
                const now = new Date();
                checkedInAt.forEach((t) => {
                  const d = new Date(t);
                  const diffDays = Math.floor(
                    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
                  );
                  if (diffDays >= 0 && diffDays < 30) checkedDays.add(diffDays);
                });
              }
              return (
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    flexWrap: "wrap",
                    position: "relative",
                  }}
                >
                  {tooltip && (
                    <div
                      style={{
                        position: "fixed",
                        top: tooltip.y - 32,
                        left: tooltip.x,
                        transform: "translateX(-50%)",
                        background: C.ink,
                        color: C.white,
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "4px 8px",
                        borderRadius: 6,
                        pointerEvents: "none",
                        whiteSpace: "nowrap",
                        zIndex: 200,
                      }}
                    >
                      {tooltip.text}
                    </div>
                  )}
                  {Array.from({ length: 30 }, (_, i) => {
                    const daysAgo = 29 - i;
                    const active = checkedDays.has(daysAgo);
                    const d = new Date();
                    d.setDate(d.getDate() - daysAgo);
                    const label = d.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    });
                    const tooltipText = active
                      ? `Checked in — ${label}`
                      : label;

                    return (
                      <div
                        key={i}
                        onMouseEnter={(e) =>
                          setTooltip({
                            text: tooltipText,
                            x: e.clientX,
                            y: e.clientY,
                          })
                        }
                        onMouseLeave={() => setTooltip(null)}
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 3,
                          background: active ? C.teal : C.border,
                          cursor: "default",
                        }}
                      />
                    );
                  })}
                </div>
              );
            })()}

            {/* Legend */}
            <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
              {[
                { color: C.teal, label: "checked in" },
                { color: C.border, label: "no visit" },
              ].map(({ color, label }) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: 5 }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: color,
                    }}
                  />
                  <span style={{ fontSize: 10, color: C.coolGrey }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary stats */}
            <div
              style={{
                display: "flex",
                gap: 20,
                marginTop: 12,
                paddingTop: 10,
                borderTop: `1px solid ${C.border}`,
              }}
            >
              {[
                { value: totalCheckIns, label: "total check-ins" },
                {
                  value: `${streak?.longestStreak ?? 0}wk`,
                  label: "best streak",
                },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p
                    style={{
                      fontWeight: 800,
                      fontSize: 15,
                      color: C.ink,
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </p>
                  <p
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: C.coolGrey,
                      marginTop: 3,
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {weeks.length > 0 && (
          <div style={{ padding: "20px 16px 0" }}>
            <p
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: C.ink,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Sparkles size={14} style={{ color: C.purple }} /> Weekly Activity
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {weeks.map((week, i) => {
                const maxCount = Math.max(
                  ...weeks.map((w) => w.checkInCount),
                  1,
                );
                const barPct = (week.checkInCount / maxCount) * 100;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.35 }}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: 10,
                        color: C.coolGrey,
                        width: 100,
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {week.weekStart.replace(/, \d{4}$/, "")}
                    </p>
                    <div
                      style={{
                        flex: 1,
                        height: 20,
                        borderRadius: 6,
                        background: C.snow,
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barPct}%` }}
                        transition={{
                          delay: 0.5 + i * 0.08,
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{
                          height: "100%",
                          borderRadius: 6,
                          background: week.meetsRequirement
                            ? `linear-gradient(90deg, ${C.teal}, #14B8A6)`
                            : `linear-gradient(90deg, ${C.coral}CC, ${C.coral})`,
                          minWidth: week.checkInCount > 0 ? 20 : 0,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        flexShrink: 0,
                        width: 36,
                        justifyContent: "flex-end",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: 13,
                          color: week.meetsRequirement ? C.teal : C.coolGrey,
                        }}
                      >
                        {week.checkInCount}
                      </span>
                      {week.meetsRequirement && (
                        <span style={{ fontSize: 10 }}>✅</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Achievements ────────────────────────────────────────────────── */}
        {achievements.length > 0 && (
          <div style={{ padding: "20px 16px" }}>
            <p
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: C.ink,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Trophy size={14} style={{ color: C.gold }} /> Achievements
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {achievements.map((a, i) => (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.5 + i * 0.06,
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 12,
                    background: C.snow,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{a.emoji}</span>
                  <div>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: 11,
                        color: C.ink,
                        lineHeight: 1.2,
                      }}
                    >
                      {a.label}
                    </p>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: 9,
                        color: C.coolGrey,
                      }}
                    >
                      {a.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
