"use client";

import { useState } from "react";
import {
  Search,
  CreditCard,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  Zap,
} from "lucide-react";
import {
  useAllSubscriptions,
  useMemberOrgs,
} from "@/hooks/memberHook/useMember";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const C = {
  teal: "#0D9488",
  tealLight: "#CCFBF1",
  tealDark: "#0F766E",
  snow: "#F9FAFB",
  white: "#FFFFFF",
  ink: "#111827",
  inkMid: "#374151",
  coolGrey: "#9CA3AF",
  border: "#E5E7EB",
  coral: "#F06543",
  coralLight: "#FEE2D5",
  amber: "#D97706",
  amberLight: "#FEF3C7",
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

const isExpiringSoon = (expiresAt: string) => {
  const days = Math.ceil(
    (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  return days <= 7 && days > 0;
};

const daysUntil = (expiresAt: string) =>
  Math.ceil(
    (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

const STATUS_CONFIG: Record<
  string,
  { bg: string; color: string; label: string; dot: string }
> = {
  active: { bg: C.tealLight, color: C.tealDark, label: "Active", dot: C.teal },
  expired: { bg: C.coralLight, color: C.coral, label: "Expired", dot: C.coral },
  cancelled: {
    bg: "#F3F4F6",
    color: C.coolGrey,
    label: "Cancelled",
    dot: C.coolGrey,
  },
  pending: { bg: C.amberLight, color: C.amber, label: "Pending", dot: C.amber },
};

const FILTER_OPTIONS = [
  "all",
  "active",
  "pending",
  "expired",
  "cancelled",
] as const;
type StatusFilter = (typeof FILTER_OPTIONS)[number];

function StatCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: number;
  sub?: string;
  accent?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      style={{
        background: accent ? C.teal : C.white,
        borderRadius: "16px",
        border: `1px solid ${accent ? "transparent" : C.border}`,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow: accent
          ? "0 8px 24px rgba(13,148,136,0.25)"
          : "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          flexShrink: 0,
          background: accent
            ? "rgba(255,255,255,0.2)"
            : "rgba(13,148,136,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent ? C.white : C.teal,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            fontWeight: 400,
            fontSize: "12px",
            color: accent ? "rgba(255,255,255,0.7)" : C.coolGrey,
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            marginBottom: "2px",
          }}
        >
          {label}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: "24px",
              color: accent ? C.white : C.ink,
              letterSpacing: "-0.5px",
            }}
          >
            {value}
          </span>
          {sub && (
            <span
              style={{
                fontWeight: 400,
                fontSize: "13px",
                color: accent ? "rgba(255,255,255,0.6)" : C.coolGrey,
              }}
            >
              {sub}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SubscriptionCard({ sub, index, orgLogo }: { sub: any; index: number; orgLogo: string | null }) {
  // console.log("sub", sub);
  const [hovered, setHovered] = useState(false);
  const expiringSoon =
    sub.status === "active" && isExpiringSoon(sub.expires_at);
  const days = sub.expires_at ? daysUntil(sub.expires_at) : null;
  const featuresArray: string[] = sub.plan.features?.features ?? [];
  const isActive = sub.status === "active";
  const isCancelled = sub.status === "cancelled";
  const isExpired = sub.status === "expired";
  const isPending = sub.status === "pending";
  const cfg = STATUS_CONFIG[sub.status];
  const dimmed = isCancelled || isExpired;

  return (
    <Link
      href={`/member/subscriptions/${sub.id}`}
      style={{ textDecoration: "none" }}
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={index}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{
          y: -3,
          transition: { type: "spring", stiffness: 400, damping: 28 },
        }}
        style={{
          background: C.white,
          borderRadius: "16px",
          border: `1px solid ${expiringSoon ? "rgba(240,101,67,0.4)" : hovered ? C.teal : C.border}`,
          padding: "0",
          overflow: "hidden",
          boxShadow: hovered
            ? "0 12px 32px rgba(13,148,136,0.12)"
            : expiringSoon
              ? "0 4px 16px rgba(240,101,67,0.08)"
              : "0 1px 4px rgba(0,0,0,0.05)",
          cursor: "pointer",
          transition: "border-color 280ms, box-shadow 280ms",
          opacity: dimmed ? 0.75 : 1,
        }}
      >
        {/* Top accent strip */}
        <div
          style={{
            height: "4px",
            background: expiringSoon
              ? C.coral
              : isPending
                ? C.amber
                : isActive
                  ? `linear-gradient(90deg, ${C.teal}, ${C.tealDark})`
                  : C.border,
          }}
        />

        <div style={{ padding: "20px 22px" }}>
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "16px",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                minWidth: 0,
              }}
            >
              <div style={{ width: "44px", height: "44px", borderRadius: "11px", background: dimmed ? C.snow : C.teal, border: dimmed ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", justifyContent: "center", color: dimmed ? C.coolGrey : C.white, fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "18px", flexShrink: 0, overflow: "hidden", position: "relative" }}>
  {orgLogo && !dimmed ? (
    <Image src={orgLogo} alt={sub.plan.name} fill className="object-cover" />
  ) : (
    sub.plan.name.charAt(0)
  )}
</div>
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "15px",
                    color: C.ink,
                    marginBottom: "2px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {sub.plan.name}
                </p>
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    color: C.coolGrey,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {sub.plan.description}
                </p>
              </div>
            </div>

            {/* Status badge */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 10px",
                borderRadius: "999px",
                background: cfg.bg,
                color: cfg.color,
                fontFamily: "Nunito, sans-serif",
                fontWeight: 700,
                fontSize: "11px",
                flexShrink: 0,
                letterSpacing: "0.2px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: cfg.dot,
                  flexShrink: 0,
                }}
              />
              {cfg.label}
            </span>
          </div>

          {/* Price */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
              marginBottom: "14px",
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: "26px",
                color: dimmed ? C.coolGrey : C.ink,
                letterSpacing: "-0.5px",
              }}
            >
              ₦{sub.plan.price.toLocaleString()}
            </span>
            <span
              style={{ fontWeight: 400, fontSize: "13px", color: C.coolGrey }}
            >
              /{sub.plan.interval}
            </span>
          </div>

          {/* Features (active only) */}
          {isActive && featuresArray.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                marginBottom: "14px",
              }}
            >
              {featuresArray.slice(0, 2).map((feature: string, idx: number) => (
                <div
                  key={idx}
                  style={{ display: "flex", alignItems: "center", gap: "7px" }}
                >
                  <CheckCircle
                    size={12}
                    style={{ color: C.teal, flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: "12px",
                      color: C.inkMid,
                    }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
              {featuresArray.length > 2 && (
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    color: C.coolGrey,
                    paddingLeft: "19px",
                  }}
                >
                  +{featuresArray.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "12px",
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <div>
              {isActive && days !== null && (
                <p
                  style={{
                    fontWeight: expiringSoon ? 600 : 400,
                    fontSize: "12px",
                    color: expiringSoon ? C.coral : C.coolGrey,
                  }}
                >
                  {expiringSoon && (
                    <AlertTriangle
                      size={11}
                      style={{
                        display: "inline",
                        marginRight: "4px",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                  {sub.auto_renew ? "Renews" : "Expires"}{" "}
                  <span
                    style={{
                      fontWeight: 600,
                      color: expiringSoon ? C.coral : C.inkMid,
                    }}
                  >
                    {days <= 0 ? "today" : `in ${days}d`}
                  </span>
                </p>
              )}
              {isPending && (
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    color: C.amber,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Clock size={11} /> Awaiting payment
                </p>
              )}
              {isCancelled && sub.canceled_at && (
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    color: C.coolGrey,
                  }}
                >
                  Cancelled {new Date(sub.canceled_at).toLocaleDateString()}
                </p>
              )}
              {isExpired && (
                <p
                  style={{ fontWeight: 400, fontSize: "12px", color: C.coral }}
                >
                  Expired
                </p>
              )}
            </div>
            <ChevronRight
              size={16}
              style={{
                color: hovered ? C.teal : C.coolGrey,
                transition: "color 280ms",
                flexShrink: 0,
              }}
            />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        background: C.white,
        borderRadius: "16px",
        border: `1px solid ${C.border}`,
        overflow: "hidden",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    >
      <div style={{ height: "4px", background: C.border }} />
      <div
        style={{
          padding: "20px 22px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "11px",
              background: C.border,
            }}
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              paddingTop: "4px",
            }}
          >
            <div
              style={{
                height: "14px",
                width: "60%",
                borderRadius: "4px",
                background: C.border,
              }}
            />
            <div
              style={{
                height: "11px",
                width: "40%",
                borderRadius: "4px",
                background: C.border,
              }}
            />
          </div>
        </div>
        <div
          style={{
            height: "28px",
            width: "40%",
            borderRadius: "6px",
            background: C.border,
          }}
        />
        <div style={{ height: "1px", background: C.border }} />
        <div
          style={{
            height: "11px",
            width: "50%",
            borderRadius: "4px",
            background: C.border,
          }}
        />
      </div>
    </div>
  );
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const { data: subscriptions, isLoading } = useAllSubscriptions();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchFocused, setSearchFocused] = useState(false);
  const { data: memberOrgs } = useMemberOrgs();
const orgLogo = memberOrgs?.[0]?.organization_user?.organization?.logo_url ?? null;

  const all = subscriptions ?? [];

  // Stats
  const activeCount = all.filter((s) => s.status === "active").length;
  const pendingCount = all.filter((s) => s.status === "pending").length;
  const expiringCount = all.filter(
    (s) => s.status === "active" && isExpiringSoon(s.expires_at),
  ).length;

  const filtered = all
    .filter((sub) => {
      if (!sub.plan?.name) return false;
      const matchesSearch =
        sub.plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.plan.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort(
      (a, b) =>
        new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime(),
    );

  const isEmpty = !isLoading && filtered.length === 0;
  const showStats = !isLoading && all.length > 0;

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
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        input::placeholder { color: #9CA3AF; }
      `}</style>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* ── Page header ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          style={{ marginBottom: "28px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h1
                style={{
                  fontWeight: 900,
                  fontSize: "30px",
                  color: C.ink,
                  letterSpacing: "-0.5px",
                  lineHeight: 1.1,
                }}
              >
                My Subscriptions
              </h1>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: "14px",
                  color: C.coolGrey,
                  marginTop: "5px",
                }}
              >
                {isLoading
                  ? "Loading…"
                  : `${all.length} subscription${all.length !== 1 ? "s" : ""} across all plans`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Stats row ── */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <StatCard
                label="Active"
                value={activeCount}
                sub="plans"
                accent
                icon={<Zap size={20} />}
              />
              <StatCard
                label="Expiring soon"
                value={expiringCount}
                sub="this week"
                icon={<AlertTriangle size={20} />}
              />
              <StatCard
                label="Pending"
                value={pendingCount}
                sub="awaiting"
                icon={<Clock size={20} />}
              />
              <StatCard
                label="Total"
                value={all.length}
                sub="all time"
                icon={<CreditCard size={20} />}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Search & filters ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          style={{
            background: C.white,
            borderRadius: "12px",
            border: `1px solid ${C.border}`,
            padding: "16px 20px",
            marginBottom: "20px",
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: "1 1 220px" }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: searchFocused ? C.teal : C.coolGrey,
                transition: "color 300ms",
              }}
            />
            <input
              type="text"
              placeholder="Search by plan name…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                width: "100%",
                paddingLeft: "34px",
                paddingRight: "14px",
                paddingTop: "9px",
                paddingBottom: "9px",
                borderRadius: "8px",
                border: `1px solid ${searchFocused ? C.teal : C.border}`,
                boxShadow: searchFocused
                  ? "0 0 0 3px rgba(13,148,136,0.1)"
                  : "none",
                fontFamily: "Nunito, sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                color: C.ink,
                background: C.snow,
                outline: "none",
                transition: "border-color 300ms, box-shadow 300ms",
              }}
            />
          </div>

          {/* Filter pills */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {FILTER_OPTIONS.map((s) => {
              const isActive = statusFilter === s;
              const cfg = s !== "all" ? STATUS_CONFIG[s] : null;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: 700,
                    fontSize: "12px",
                    border: `1.5px solid ${isActive ? C.teal : C.border}`,
                    background: isActive ? C.teal : C.white,
                    color: isActive ? C.white : C.coolGrey,
                    transition: "all 200ms",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {cfg && (
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: isActive
                          ? "rgba(255,255,255,0.7)"
                          : cfg.dot,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Results count ── */}
        {!isLoading && !isEmpty && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontWeight: 400,
              fontSize: "13px",
              color: C.coolGrey,
              marginBottom: "14px",
              paddingLeft: "2px",
            }}
          >
            Showing <strong style={{ color: C.ink }}>{filtered.length}</strong>{" "}
            subscription{filtered.length !== 1 ? "s" : ""}
            {statusFilter !== "all" && (
              <>
                {" "}
                ·{" "}
                <span style={{ color: STATUS_CONFIG[statusFilter]?.color }}>
                  {STATUS_CONFIG[statusFilter]?.label}
                </span>
              </>
            )}
          </motion.p>
        )}

        {/* ── Content ── */}
        {isLoading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "16px",
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : !isEmpty ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "16px",
            }}
          >
            {filtered.map((sub, i) => (
              <SubscriptionCard key={sub.id} sub={sub} index={i} orgLogo={orgLogo} />
            ))}
          </div>
        ) : (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <div
              style={{
                background: C.white,
                borderRadius: "20px",
                border: `1px solid ${C.border}`,
                padding: "72px 32px",
                textAlign: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "20px",
                  background: "rgba(13,148,136,0.06)",
                  border: `1px solid rgba(13,148,136,0.12)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <CreditCard size={32} style={{ color: C.teal }} />
              </div>
              <h3
                style={{
                  fontWeight: 800,
                  fontSize: "20px",
                  color: C.ink,
                  marginBottom: "8px",
                }}
              >
                {searchQuery || statusFilter !== "all"
                  ? "No subscriptions match"
                  : "No subscriptions yet"}
              </h3>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: "14px",
                  color: C.coolGrey,
                  marginBottom: "28px",
                  maxWidth: "300px",
                  margin: "0 auto 28px",
                  lineHeight: 1.65,
                }}
              >
                {searchQuery || statusFilter !== "all"
                  ? "Try clearing your search or switching the filter"
                  : "Browse available plans and subscribe to get started"}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => router.push("/member/communities")}
                  style={{
                    background: C.teal,
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Browse Plans
                </Button>
              )}
              {(searchQuery || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                >
                  <X size={13} /> Clear filters
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
