"use client";

import { useState } from "react";
import { Search, CreditCard, X, CheckCircle } from "lucide-react";
import { useAllSubscriptions } from "@/hooks/memberHook/useMember";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const C = {
  teal:     "#0D9488",
  snow:     "#F9FAFB",
  white:    "#FFFFFF",
  ink:      "#1F2937",
  coolGrey: "#9CA3AF",
  border:   "#E5E7EB",
  coral:    "#F06543",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

const isExpiringSoon = (expiresAt: string) => {
  const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return days <= 7 && days > 0;
};

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  active:   { bg: "rgba(13,148,136,0.1)",   color: C.teal,     label: "Active" },
  expired:  { bg: "rgba(240,101,67,0.1)",   color: C.coral,    label: "Expired" },
  canceled: { bg: "rgba(156,163,175,0.15)", color: C.coolGrey, label: "Canceled" },
  pending:  { bg: "rgba(251,191,36,0.12)",  color: "#D97706",  label: "Pending" },
};

const FILTER_OPTIONS = ["all", "active", "pending", "expired", "canceled"] as const;
type StatusFilter = typeof FILTER_OPTIONS[number];

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.canceled;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "4px 10px", borderRadius: "999px",
      background: cfg.bg, color: cfg.color,
      fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "12px", flexShrink: 0,
    }}>
      {status === "active"   && <CheckCircle size={12} />}
      {status === "canceled" && <X size={12} />}
      {cfg.label}
    </span>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Button
      variant={active ? "secondary" : "outline"}
      size="sm"
      onClick={onClick}
    >
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </Button>
  );
}

function SkeletonCard() {
  return (
    <div style={{
      background: C.white, borderRadius: "12px", border: `1px solid ${C.border}`,
      height: "220px", animation: "pulse 1.5s ease-in-out infinite",
    }} />
  );
}

function SubscriptionCard({ sub, index }: { sub: any; index: number }) {
  const [hovered, setHovered] = useState(false);
  const expiringSoon = sub.status === "active" && isExpiringSoon(sub.expires_at);
  const featuresArray: string[] = sub.plan.features?.features ?? [];

  return (
    <Link href={`/member/subscriptions/${sub.id}`} style={{ textDecoration: "none" }}>
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={index}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          background: expiringSoon ? "rgba(240,101,67,0.04)" : C.white,
          borderRadius: "12px",
          border: `1px solid ${expiringSoon ? "rgba(240,101,67,0.35)" : hovered ? C.teal : C.border}`,
          padding: "24px",
          boxShadow: hovered ? "0 8px 24px rgba(13,148,136,0.1)" : "0 1px 4px rgba(0,0,0,0.05)",
          cursor: "pointer", transition: "border-color 300ms, box-shadow 300ms",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "12px", background: C.teal,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.white, fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "20px", flexShrink: 0,
            }}>
              {sub.plan.name.charAt(0)}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: "15px", color: C.ink, marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {sub.plan.name}
              </p>
              <p style={{ fontWeight: 400, fontSize: "13px", color: C.coolGrey, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {sub.plan.description}
              </p>
            </div>
          </div>
          <StatusBadge status={sub.status} />
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "16px" }}>
          <span style={{ fontWeight: 800, fontSize: "28px", color: C.ink, letterSpacing: "-0.5px" }}>
            ₦{sub.plan.price.toLocaleString()}
          </span>
          <span style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey }}>/{sub.plan.interval}</span>
        </div>

        {featuresArray.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
            {featuresArray.slice(0, 3).map((feature: string, idx: number) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.teal, flexShrink: 0 }} />
                <span style={{ fontWeight: 400, fontSize: "13px", color: C.ink }}>{feature}</span>
              </div>
            ))}
            {featuresArray.length > 3 && (
              <span style={{ fontWeight: 400, fontSize: "13px", color: C.coolGrey }}>
                +{featuresArray.length - 3} more features
              </span>
            )}
          </div>
        )}

        {(sub.status === "active" || sub.status === "canceled") && (
          <div style={{ paddingTop: "12px", borderTop: `1px solid ${C.border}` }}>
            {sub.status === "active" && (
              <p style={{ fontWeight: expiringSoon ? 600 : 400, fontSize: "13px", color: expiringSoon ? C.coral : C.coolGrey }}>
                {expiringSoon && "⚠️ "}
                {sub.auto_renew ? "Renews" : "Expires"}:{" "}
                <span style={{ fontWeight: 600, color: expiringSoon ? C.coral : C.ink }}>
                  {new Date(sub.expires_at).toLocaleDateString()}
                </span>
              </p>
            )}
            {sub.status === "canceled" && sub.canceled_at && (
              <p style={{ fontWeight: 400, fontSize: "13px", color: C.coolGrey }}>
                Canceled on:{" "}
                <span style={{ fontWeight: 600, color: C.ink }}>
                  {new Date(sub.canceled_at).toLocaleDateString()}
                </span>
              </p>
            )}
          </div>
        )}
      </motion.div>
    </Link>
  );
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const { data: subscriptions, isLoading } = useAllSubscriptions();
  const [searchQuery, setSearchQuery]     = useState("");
  const [statusFilter, setStatusFilter]   = useState<StatusFilter>("all");
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = subscriptions
    ?.filter((sub) => {
      if (!sub.plan?.name) return false;
      const matchesSearch =
        sub.plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.plan.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime()) ?? [];

  const isEmpty = !isLoading && filtered.length === 0;

  return (
    <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "32px 24px 96px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        input::placeholder { color: #9CA3AF; }
      `}</style>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} style={{ marginBottom: "32px" }}>
          <h1 style={{ fontWeight: 800, fontSize: "32px", color: C.ink, letterSpacing: "-0.4px" }}>My Subscriptions</h1>
          <p style={{ fontWeight: 400, fontSize: "15px", color: C.coolGrey, marginTop: "4px" }}>Manage all your active and past subscriptions</p>
        </motion.div>

        {/* Search & filters */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
          style={{ background: C.white, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "20px 24px", marginBottom: "28px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}
        >
          <div style={{ position: "relative", flex: "1 1 240px" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: searchFocused ? C.teal : C.coolGrey, transition: "color 300ms" }} />
            <input
              type="text" placeholder="Search subscriptions..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
              style={{
                width: "100%", paddingLeft: "36px", paddingRight: "16px", paddingTop: "10px", paddingBottom: "10px",
                borderRadius: "8px", border: `1px solid ${searchFocused ? C.teal : C.border}`,
                boxShadow: searchFocused ? "0 0 0 3px rgba(13,148,136,0.12)" : "none",
                fontFamily: "Nunito, sans-serif", fontWeight: 400, fontSize: "14px",
                color: C.ink, background: C.white, outline: "none",
                transition: "border-color 300ms, box-shadow 300ms",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {FILTER_OPTIONS.map((s) => (
              <FilterPill key={s} label={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
            ))}
          </div>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : !isEmpty ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
            {filtered.map((sub, i) => <SubscriptionCard key={sub.id} sub={sub} index={i} />)}
          </div>
        ) : (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            <div style={{ background: C.white, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "64px 32px", textAlign: "center" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "18px", background: C.snow, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <CreditCard size={32} style={{ color: C.coolGrey }} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "20px", color: C.ink, marginBottom: "8px" }}>
                {searchQuery || statusFilter !== "all" ? "No subscriptions found" : "No subscriptions yet"}
              </h3>
              <p style={{ fontWeight: 400, fontSize: "15px", color: C.coolGrey, marginBottom: "28px", maxWidth: "340px", margin: "0 auto 28px", lineHeight: 1.6 }}>
                {searchQuery || statusFilter !== "all" ? "Try adjusting your search or filters" : "Subscribe to a plan to get started"}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <div style={{
                    position: "absolute", inset: "-4px", borderRadius: "12px",
                    background: `linear-gradient(to right, rgba(240,101,67,0.4), rgba(240,101,67,0.2), rgba(240,101,67,0.4))`,
                    filter: "blur(14px)", opacity: 0.7, zIndex: 0,
                  }} />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <Button variant="default" size="lg" onClick={() => router.push("/communities")}>
                      Browse Plans
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}