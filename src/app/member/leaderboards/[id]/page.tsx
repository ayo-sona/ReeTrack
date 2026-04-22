"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Calendar,
  Search,
  X,
  Crown,
  ArrowLeft,
} from "lucide-react";
import { useMemberStore } from "@/store/memberStore";
import { useLeaderboardStats } from "@/hooks/useMembers";
import {
  MemberStatsModal,
  LeaderboardMember,
} from "@/components/member/MemberStatsModal";
import Image from "next/image";

const C = {
  teal: "#0D9488",
  coral: "#F06543",
  snow: "#F9FAFB",
  white: "#FFFFFF",
  ink: "#1F2937",
  coolGrey: "#9CA3AF",
  border: "#E5E7EB",
  gold: "#F59E0B",
  silver: "#94A3B8",
  bronze: "#CD7F32",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

type Period = "all" | "month";
const MONTHLY_THRESHOLD = 15;

function getCheckInCount(
  checked_in_at: string[] | string | null | undefined,
  period: Period,
): number {
  if (!checked_in_at) return 0;
  const timestamps = Array.isArray(checked_in_at)
    ? checked_in_at
    : [checked_in_at];
  if (period === "all") return timestamps.length;
  const now = new Date();
  return timestamps.filter((t) => {
    const d = new Date(t);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;
}

function RankBadge({ rank, qualifies }: { rank: number; qualifies: boolean }) {
  if (!qualifies)
    return (
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: C.snow,
          border: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 13, color: C.coolGrey }}>
          #{rank}
        </span>
      </div>
    );
  if (rank === 1)
    return (
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #F59E0B, #D97706)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(245,158,11,0.4)",
          flexShrink: 0,
        }}
      >
        <Crown size={16} style={{ color: C.white }} />
      </div>
    );
  if (rank === 2)
    return (
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #94A3B8, #64748B)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(148,163,184,0.35)",
          flexShrink: 0,
        }}
      >
        <Medal size={16} style={{ color: C.white }} />
      </div>
    );
  if (rank === 3)
    return (
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #CD7F32, #A0522D)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(205,127,50,0.35)",
          flexShrink: 0,
        }}
      >
        <Award size={16} style={{ color: C.white }} />
      </div>
    );
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: C.snow,
        border: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ fontWeight: 700, fontSize: 13, color: C.coolGrey }}>
        #{rank}
      </span>
    </div>
  );
}

function InfoTooltip() {
  const [show, setShow] = React.useState(false);
  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span
        style={{
          fontSize: 14,
          color: C.coolGrey,
          cursor: "default",
          lineHeight: 1,
        }}
      >
        ⓘ
      </span>
      {show && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: C.ink,
            color: C.white,
            fontSize: 12,
            fontWeight: 500,
            lineHeight: 1.6,
            padding: "10px 14px",
            borderRadius: 10,
            width: 230,
            zIndex: 50,
            whiteSpace: "normal",
            pointerEvents: "none",
          }}
        >
          Members need at least{" "}
          <strong style={{ color: "#5EEAD4" }}>
            {MONTHLY_THRESHOLD} check-ins
          </strong>{" "}
          this month to be considered locked in. Rankings reset monthly.
          <div
            style={{
              position: "absolute",
              top: -4,
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: 8,
              height: 8,
              background: C.ink,
              borderRadius: 2,
            }}
          />
        </div>
      )}
    </div>
  );
}

function PodiumCard({
  member,
  rank,
  period,
}: {
  member: LeaderboardMember;
  rank: 1 | 2 | 3;
  period: Period;
}) {
  const count = getCheckInCount(member.checked_in_at, period);
  const name = `${member.user.first_name} ${member.user.last_name}`;
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();
  const heights = { 1: 140, 2: 110, 3: 90 };
  const rankColors = {
    1: {
      bg: "linear-gradient(135deg, #F59E0B, #D97706)",
      shadow: "0 8px 32px rgba(245,158,11,0.35)",
    },
    2: {
      bg: "linear-gradient(135deg, #94A3B8, #64748B)",
      shadow: "0 8px 24px rgba(148,163,184,0.3)",
    },
    3: {
      bg: "linear-gradient(135deg, #CD7F32, #A0522D)",
      shadow: "0 8px 20px rgba(205,127,50,0.3)",
    },
  };
  const cfg = rankColors[rank];
  const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: rank * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ position: "relative", marginBottom: 4 }}>
        <div
          style={{
            width: rank === 1 ? 72 : 60,
            height: rank === 1 ? 72 : 60,
            borderRadius: "50%",
            background: cfg.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: rank === 1 ? 24 : 20,
            color: C.white,
            boxShadow: cfg.shadow,
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {member.user.avatar_url ? (
            <Image
              src={member.user.avatar_url}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <div
          style={{ position: "absolute", bottom: -4, right: -4, fontSize: 18 }}
        >
          {medals[rank]}
        </div>
      </div>
      <p
        style={{
          fontWeight: 700,
          fontSize: 13,
          color: C.ink,
          textAlign: "center",
          maxWidth: 90,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {name.split(" ")[0]}
      </p>
      <div
        style={{
          width: "100%",
          height: heights[rank],
          borderRadius: "12px 12px 0 0",
          background: cfg.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          boxShadow: cfg.shadow,
        }}
      >
        <p
          style={{
            fontWeight: 900,
            fontSize: rank === 1 ? 28 : 22,
            color: C.white,
            lineHeight: 1,
          }}
        >
          {count}
        </p>
        <p
          style={{
            fontWeight: 600,
            fontSize: 10,
            color: "rgba(255,255,255,0.8)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          check-ins
        </p>
      </div>
    </motion.div>
  );
}

export default function CommunityLeaderboardPage() {
  const params = useParams();
  const orgId = params.id as string;

  const { getMember } = useMemberStore();
  const memberData = getMember(orgId);
  const { data: members, isLoading } = useLeaderboardStats(orgId);

  const [period, setPeriod] = useState<Period>("all");
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{
    member: LeaderboardMember;
    rank: number;
  } | null>(null);

  const orgName =
    memberData?.organization_user?.organization?.name ?? "Community";

  const ranked = useMemo(() => {
    if (!members || !Array.isArray(members)) return [];
    return [...members]
      .map((m) => ({
        ...m,
        score: getCheckInCount(m.checked_in_at, period),
        monthCount: getCheckInCount(m.checked_in_at, "month"),
        qualifies:
          getCheckInCount(m.checked_in_at, "month") >= MONTHLY_THRESHOLD,
      }))
      .sort((a, b) => b.score - a.score);
  }, [members, period]);

  const filtered = useMemo(() => {
    if (!search.trim()) return ranked;
    const q = search.toLowerCase();
    return ranked.filter(
      (m) =>
        m.user.first_name.toLowerCase().includes(q) ||
        m.user.last_name.toLowerCase().includes(q),
    );
  }, [ranked, search]);

  const qualifyingRanked = ranked.filter((m) => m.qualifies);
  const top3 = qualifyingRanked.slice(0, 3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : [];

  // const totalCheckIns = ranked.reduce((s, m) => s + m.score, 0);
  // const monthTotal = ranked.reduce((s, m) => s + m.monthCount, 0);
  const qualifyingCount = ranked.filter((m) => m.qualifies).length;

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.snow,
          padding: "32px 24px",
          fontFamily: "Nunito, sans-serif",
        }}
      >
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {[48, 200, 120, 320].map((h, i) => (
            <div
              key={i}
              style={{
                height: h,
                borderRadius: 16,
                background: C.white,
                border: `1px solid ${C.border}`,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.snow,
        fontFamily: "Nunito, sans-serif",
        padding: "32px 24px 96px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        input::placeholder { color: #9CA3AF; }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          style={{ marginBottom: 20 }}
        >
          <Link
            href="/member/leaderboards"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 600,
              fontSize: 14,
              color: C.coolGrey,
              transition: "color 200ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.teal)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.coolGrey)}
          >
            <ArrowLeft size={16} /> Back to Leaderboards
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          style={{ marginBottom: 28 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: C.teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 18,
                color: C.white,
                flexShrink: 0,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {memberData?.organization_user?.organization?.logo_url ? (
                <Image
                  src={memberData.organization_user.organization.logo_url}
                  alt={orgName}
                  fill
                  className="object-cover"
                />
              ) : (
                orgName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h1
                style={{
                  fontWeight: 900,
                  fontSize: "clamp(20px,4vw,28px)",
                  color: C.ink,
                  letterSpacing: "-0.4px",
                  lineHeight: 1.1,
                }}
              >
                {orgName}
              </h1>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: 13,
                  color: C.coolGrey,
                  marginTop: 2,
                }}
              >
                Community leaderboard
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {[
            {
              label: "Total Check-Ins",
              value: ranked.reduce(
                (s, m) => s + getCheckInCount(m.checked_in_at, "all"),
                0,
              ),
              icon: <TrendingUp size={16} />,
              accent: true,
            },
            {
              label: "This Month",
              value: ranked.reduce((s, m) => s + m.monthCount, 0),
              icon: <Calendar size={16} />,
              accent: false,
            },
            {
              label: "Locked in",
              value: qualifyingCount,
              icon: <Trophy size={16} />,
              accent: false,
            },
          ].map(({ label, value, icon, accent }) => (
            <div
              key={label}
              style={{
                background: accent ? C.teal : C.white,
                borderRadius: 14,
                border: `1px solid ${accent ? "transparent" : C.border}`,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                boxShadow: accent ? "0 6px 24px rgba(13,148,136,0.2)" : "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: accent
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(13,148,136,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: accent ? C.white : C.teal,
                  flexShrink: 0,
                }}
              >
                {icon}
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: 11,
                    color: accent ? "rgba(255,255,255,0.7)" : C.coolGrey,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: 2,
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontWeight: 800,
                    fontSize: 22,
                    color: accent ? C.white : C.ink,
                    letterSpacing: "-0.3px",
                  }}
                >
                  {value}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {podiumOrder.length === 3 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            style={{
              background: C.white,
              borderRadius: 20,
              border: `1px solid ${C.border}`,
              padding: "32px 24px 0",
              marginBottom: 20,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: "linear-gradient(90deg, #F59E0B, #0D9488, #F06543)",
                backgroundSize: "200% auto",
                animation: "shimmer 3s linear infinite",
              }}
            />
            <p
              style={{
                fontWeight: 700,
                fontSize: 12,
                color: C.coolGrey,
                textTransform: "uppercase",
                letterSpacing: "1px",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              🏆 Top Performers
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                maxWidth: 400,
                margin: "0 auto",
              }}
            >
              {podiumOrder.map((m) => {
                const r = qualifyingRanked.indexOf(m) + 1;
                return (
                  <PodiumCard
                    key={m.id}
                    member={m}
                    rank={r as 1 | 2 | 3}
                    period={period}
                  />
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          style={{
            background: C.white,
            borderRadius: 14,
            border: `1px solid ${C.border}`,
            padding: "14px 20px",
            marginBottom: 16,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: "1 1 200px" }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: searchFocused ? C.teal : C.coolGrey,
                transition: "color 200ms",
              }}
            />
            <input
              type="text"
              placeholder="Search members…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                width: "100%",
                paddingLeft: 34,
                paddingRight: search ? 32 : 14,
                paddingTop: 9,
                paddingBottom: 9,
                borderRadius: 8,
                border: `1px solid ${searchFocused ? C.teal : C.border}`,
                boxShadow: searchFocused
                  ? "0 0 0 3px rgba(13,148,136,0.1)"
                  : "none",
                fontFamily: "Nunito, sans-serif",
                fontWeight: 400,
                fontSize: 14,
                color: C.ink,
                background: C.snow,
                outline: "none",
                transition: "border-color 300ms, box-shadow 300ms",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: C.coolGrey,
                  display: "flex",
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              background: C.snow,
              borderRadius: 10,
              padding: 4,
              border: `1px solid ${C.border}`,
            }}
          >
            {(
              [
                ["all", "All Time"],
                ["month", "This Month"],
              ] as [Period, string][]
            ).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setPeriod(val)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 7,
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  border: "none",
                  cursor: "pointer",
                  background: period === val ? C.white : "transparent",
                  color: period === val ? C.ink : C.coolGrey,
                  boxShadow:
                    period === val ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 200ms",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={6}
          style={{
            background: C.white,
            borderRadius: 16,
            border: `1px solid ${C.border}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 24px",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              className="flex items-center gap-2 font-bold text-[15px]"
              style={{ fontWeight: 700, fontSize: 15, color: C.ink, gap: 6 }}
            >
              Full Rankings
              <InfoTooltip />
            </h2>
            <span style={{ fontWeight: 600, fontSize: 12, color: C.coolGrey }}>
              {filtered.length} members
            </span>
          </div>

          {filtered.length > 0 ? (
            <div>
              {filtered.map((member, i) => {
                const rank = ranked.indexOf(member) + 1;
                const name = `${member.user.first_name} ${member.user.last_name}`;
                const initials = name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase();
                const isTop3 = rank <= 3 && member.qualifies;
                const rankColor =
                  rank === 1
                    ? C.gold
                    : rank === 2
                      ? C.silver
                      : rank === 3
                        ? C.bronze
                        : C.teal;
                const barWidth =
                  ranked[0]?.score > 0
                    ? (member.score / ranked[0].score) * 100
                    : 0;
                const prevMember = filtered[i - 1];
                const showDivider =
                  i > 0 && prevMember?.qualifies && !member.qualifies;

                return (
                  <div key={member.id}>
                    {showDivider && (
                      <div
                        style={{
                          padding: "10px 24px",
                          background: "rgba(240,101,67,0.04)",
                          borderTop: "1px dashed rgba(240,101,67,0.3)",
                          borderBottom: "1px dashed rgba(240,101,67,0.3)",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: 1,
                            background: "rgba(240,101,67,0.2)",
                          }}
                        />
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 11,
                            color: C.coral,
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Below {MONTHLY_THRESHOLD} check-ins — not qualifying
                        </span>
                        <div
                          style={{
                            flex: 1,
                            height: 1,
                            background: "rgba(240,101,67,0.2)",
                          }}
                        />
                      </div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: i * 0.03,
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onClick={() => setSelectedMember({ member, rank })}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "14px 24px",
                        background: !member.qualifies
                          ? "transparent"
                          : isTop3
                            ? `${rankColor}08`
                            : "transparent",
                        borderBottom:
                          i < filtered.length - 1
                            ? `1px solid ${C.border}`
                            : "none",
                        transition: "background 200ms",
                        opacity: member.qualifies ? 1 : 0.45,
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${C.teal}06`;
                        e.currentTarget.style.opacity = "1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = !member.qualifies
                          ? "transparent"
                          : isTop3
                            ? `${rankColor}08`
                            : "transparent";
                        e.currentTarget.style.opacity = member.qualifies
                          ? "1"
                          : "0.45";
                      }}
                    >
                      <RankBadge rank={rank} qualifies={member.qualifies} />

                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: !member.qualifies
                            ? C.snow
                            : isTop3
                              ? `linear-gradient(135deg, ${rankColor}, ${rankColor}BB)`
                              : "rgba(13,148,136,0.1)",
                          border: !member.qualifies
                            ? `1px solid ${C.border}`
                            : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 14,
                          color: !member.qualifies
                            ? C.coolGrey
                            : isTop3
                              ? C.white
                              : C.teal,
                          flexShrink: 0,
                          boxShadow:
                            isTop3 && member.qualifies
                              ? `0 4px 12px ${rankColor}40`
                              : "none",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        {member.user.avatar_url ? (
                          <Image
                            src={member.user.avatar_url}
                            alt={name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 5,
                          }}
                        >
                          <p
                            style={{
                              fontWeight: 700,
                              fontSize: 14,
                              color: member.qualifies ? C.ink : C.coolGrey,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {name}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              flexShrink: 0,
                              marginLeft: 8,
                            }}
                          >
                            {/* {!member.qualifies ? (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 3,
                                  padding: "2px 8px",
                                  borderRadius: 999,
                                  background: "rgba(240,101,67,0.08)",
                                  color: C.coral,
                                  fontWeight: 600,
                                  fontSize: 11,
                                }}
                              >
                                {member.monthCount}/{MONTHLY_THRESHOLD} mo
                              </span>
                            ) : member.monthCount > 0 ? (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 3,
                                  padding: "2px 8px",
                                  borderRadius: 999,
                                  background: "rgba(13,148,136,0.08)",
                                  color: C.teal,
                                  fontWeight: 600,
                                  fontSize: 11,
                                }}
                              >
                                <Flame size={10} />
                                {member.monthCount} mo
                              </span>
                            ) : null} */}
                            <span
                              style={{
                                fontWeight: 800,
                                fontSize: 18,
                                color: !member.qualifies
                                  ? C.coolGrey
                                  : isTop3
                                    ? rankColor
                                    : C.ink,
                                letterSpacing: "-0.3px",
                              }}
                            >
                              {member.score}
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            height: 4,
                            borderRadius: 999,
                            background: C.snow,
                            overflow: "hidden",
                          }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${barWidth}%` }}
                            transition={{
                              duration: 0.8,
                              delay: i * 0.04,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            style={{
                              height: "100%",
                              borderRadius: 999,
                              background: !member.qualifies
                                ? C.border
                                : isTop3
                                  ? `linear-gradient(90deg, ${rankColor}, ${rankColor}99)`
                                  : `linear-gradient(90deg, ${C.teal}, ${C.teal}88)`,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: "56px 24px", textAlign: "center" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: C.snow,
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                  color: C.coolGrey,
                }}
              >
                <Trophy size={24} />
              </div>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: C.ink,
                  marginBottom: 4,
                }}
              >
                No members found
              </p>
              <p style={{ fontWeight: 400, fontSize: 13, color: C.coolGrey }}>
                Try adjusting your search
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedMember && (
          <MemberStatsModal
            member={selectedMember.member}
            rank={selectedMember.rank}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
