"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, ShoppingBag, Tag } from "lucide-react";
import { MarketplaceListing } from "@/types/marketplace";

// ── Demo seed — replace with usePublicListings() when backend is ready ────────

const DEMO_LISTINGS: (MarketplaceListing & { org_name: string })[] = [
  {
    id: "d1",
    organization_id: "org-1",
    org_name: "Founders Hub Lagos",
    title: "Annual Conference Ticket",
    description:
      "Full access to our 2-day annual summit. Includes workshops, networking dinner, and speaker sessions.",
    images: [],
    price: 75000,
    currency: "NGN",
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: "d2",
    organization_id: "org-1",
    org_name: "Founders Hub Lagos",
    title: "Business Growth Bootcamp",
    description:
      "Intensive 4-week cohort for founders and operators. Live sessions, templates, and lifetime access.",
    images: [],
    price: 120000,
    currency: "NGN",
    status: "active",
    installment: { enabled: true, count: 3, interval: "monthly" },
    created_at: "",
    updated_at: "",
  },
  {
    id: "d3",
    organization_id: "org-2",
    org_name: "Lekki Real Estate Circle",
    title: "3 Bedroom Flat – Lekki Phase 1",
    description:
      "Fully finished 3-bed apartment, 2 bathrooms, BQ, and 24hr power. Ideal for families or professionals.",
    images: [],
    price: 45000000,
    currency: "NGN",
    status: "active",
    installment: { enabled: true, count: 12, interval: "monthly" },
    created_at: "",
    updated_at: "",
  },
  {
    id: "d4",
    organization_id: "org-3",
    org_name: "FitLife Community",
    title: "Premium Gym Equipment Bundle",
    description:
      "Adjustable dumbbells, resistance bands, and a foldable bench. Everything you need for a home gym.",
    images: [],
    price: 185000,
    currency: "NGN",
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: "d5",
    organization_id: "org-2",
    org_name: "Lekki Real Estate Circle",
    title: "Studio Apartment – Victoria Island",
    description:
      "Modern studio in the heart of VI. Fully furnished with high-speed internet and pool access.",
    images: [],
    price: 18500000,
    currency: "NGN",
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: "d6",
    organization_id: "org-4",
    org_name: "Creative Collective",
    title: "Member Kit – Branded Pack",
    description:
      "Official community merch: notebook, tote bag, pen, and welcome card. Shipped to your door.",
    images: [],
    price: 18500,
    currency: "NGN",
    status: "active",
    created_at: "",
    updated_at: "",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const PALETTE = [
  { bg: "#0D9488", light: "#E6F7F5" },
  { bg: "#0284C7", light: "#E0F2FE" },
  { bg: "#7C3AED", light: "#EDE9FE" },
  { bg: "#DB2777", light: "#FCE7F3" },
  { bg: "#EA580C", light: "#FEF3C7" },
  { bg: "#16A34A", light: "#DCFCE7" },
];

function getPalette(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return PALETTE[h % PALETTE.length];
}

function fmt(n: number) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`;
  return `₦${n.toLocaleString()}`;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ── Detail sheet ──────────────────────────────────────────────────────────────

function DetailSheet({
  listing,
  onClose,
}: {
  listing: MarketplaceListing & { org_name: string };
  onClose: () => void;
}) {
  const { bg } = getPalette(listing.title);
  const installment = listing.installment;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#fff",
          borderRadius: "22px 22px 0 0",
          maxHeight: "88vh",
          overflowY: "auto",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E5E7EB", margin: "16px auto 0" }} />

        {/* Cover */}
        <PlaceholderCoverLarge title={listing.title} />

        <div style={{ padding: "20px 22px 44px" }}>
          {/* Org tag */}
          <p style={{ fontSize: 11, fontWeight: 600, color: bg, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
            {listing.org_name}
          </p>

          <h2 style={{ fontWeight: 700, fontSize: 20, color: "#111827", letterSpacing: "-0.3px", marginBottom: 8 }}>
            {listing.title}
          </h2>

          {listing.description && (
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, marginBottom: 20 }}>
              {listing.description}
            </p>
          )}

          {/* Pricing */}
          <div style={{ background: "#F9FAFB", border: "1px solid #F3F4F6", borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
              Price
            </p>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}>
              ₦{listing.price.toLocaleString()}
            </p>
            {installment?.enabled && (
              <p style={{ fontSize: 13, fontWeight: 600, color: bg, marginTop: 4 }}>
                or {installment.count}× ₦{(listing.price / installment.count).toLocaleString("en-NG", { maximumFractionDigits: 0 })}/{installment.interval === "monthly" ? "mo" : "wk"}
              </p>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 14,
              background: bg,
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            Buy Now <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PlaceholderCoverLarge({ title }: { title: string }) {
  const { bg, light } = getPalette(title);
  const initial = title.trim().charAt(0).toUpperCase();
  return (
    <div style={{ background: light, position: "relative", width: "100%", height: 180, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: bg, opacity: 0.15 }} />
      <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: bg, opacity: 0.1 }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 28, color: "#fff", boxShadow: `0 8px 24px ${bg}40` }}>
          {initial}
        </div>
      </div>
    </div>
  );
}

// ── Listing card ──────────────────────────────────────────────────────────────

function ListingCard({
  listing,
  index,
  onClick,
}: {
  listing: MarketplaceListing & { org_name: string };
  index: number;
  onClick: () => void;
}) {
  const { bg, light } = getPalette(listing.title);
  const installment = listing.installment;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.96 }}
      custom={index}
      onClick={onClick}
      className="grid-card"
      style={{ cursor: "pointer" }}
    >
      {/* Cover */}
      <div style={{ background: light, position: "relative", height: 130, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: bg, opacity: 0.15 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20, color: "#fff", boxShadow: `0 6px 16px ${bg}40` }}>
            {listing.title.trim().charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1, gap: 8 }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: bg, textTransform: "uppercase", letterSpacing: "0.4px" }}>
          {listing.org_name}
        </p>
        <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {listing.title}
        </p>
        <div style={{ marginTop: "auto", paddingTop: 8, borderTop: "1px solid #F0F0F0" }}>
          <p style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>
            {fmt(listing.price)}
          </p>
          {installment?.enabled ? (
            <p style={{ fontSize: 11, fontWeight: 600, color: bg, marginTop: 2 }}>
              or {installment.count}× {fmt(listing.price / installment.count)}/{installment.interval === "monthly" ? "mo" : "wk"}
            </p>
          ) : (
            <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>one-time</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MemberListingsExplore() {
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selected, setSelected] = useState<(typeof DEMO_LISTINGS)[0] | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return DEMO_LISTINGS;
    const q = search.toLowerCase();
    return DEMO_LISTINGS.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.org_name.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F9FA",
        fontFamily: "'DM Sans', sans-serif",
        padding: "24px 24px 96px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #9CA3AF; }
        .grid-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #EBEBEB;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow 240ms ease, transform 240ms ease, border-color 240ms ease;
        }
        .grid-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.10);
          transform: translateY(-4px);
          border-color: transparent;
        }
      `}</style>

      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        {/* Search */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          style={{ marginBottom: 20 }}
        >
          <div style={{ position: "relative" }}>
            <Search
              size={15}
              style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: searchFocused ? "#0D9488" : "#9CA3AF", transition: "color 200ms" }}
            />
            <input
              type="text"
              placeholder="Search listings, communities…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{ width: "100%", paddingLeft: 38, paddingRight: search ? 36 : 14, paddingTop: 11, paddingBottom: 11, borderRadius: 12, border: `1px solid ${searchFocused ? "#0D9488" : "#E5E7EB"}`, boxShadow: searchFocused ? "0 0 0 3px rgba(13,148,136,0.08)" : "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14, color: "#111827", background: "#fff", outline: "none", transition: "border-color 250ms, box-shadow 250ms" }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", padding: 0 }}>
                <X size={14} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Count */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 16 }}
        >
          {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
        </motion.p>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "64px 24px" }}
            >
              <ShoppingBag size={40} color="#D1D5DB" style={{ margin: "0 auto 12px" }} />
              <p style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>No listings found</p>
              <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Try a different search</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}
            >
              {filtered.map((listing, i) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  index={i}
                  onClick={() => setSelected(listing)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plans highlight strip */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={filtered.length + 2}
          style={{ marginTop: 48 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Tag size={15} color="#0D9488" />
            <p style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>Featured Plans</p>
            <span style={{ fontSize: 12, color: "#9CA3AF", marginLeft: 4 }}>Recurring memberships from our communities</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {FEATURED_PLANS.map((plan, i) => (
              <PlanHighlightCard key={i} plan={plan} />
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <DetailSheet listing={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Featured plans strip ──────────────────────────────────────────────────────

const FEATURED_PLANS = [
  { name: "Founders Hub – Pro", org: "Founders Hub Lagos", price: 15000, interval: "monthly", accent: "#0D9488" },
  { name: "FitLife – Premium", org: "FitLife Community", price: 8000, interval: "monthly", accent: "#7C3AED" },
  { name: "RE Circle – Annual", org: "Lekki Real Estate Circle", price: 120000, interval: "yearly", accent: "#0284C7" },
];

function PlanHighlightCard({
  plan,
}: {
  plan: (typeof FEATURED_PLANS)[0];
}) {
  return (
    <div
      style={{ background: "#fff", borderRadius: 16, border: "1px solid #EBEBEB", padding: "16px", transition: "box-shadow 200ms, transform 200ms", cursor: "pointer" }}
      className="plan-highlight"
    >
      <style>{`.plan-highlight:hover{box-shadow:0 8px 24px rgba(0,0,0,0.08);transform:translateY(-2px);}`}</style>
      <p style={{ fontSize: 11, fontWeight: 600, color: plan.accent, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 4 }}>
        {plan.org}
      </p>
      <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 8 }}>{plan.name}</p>
      <p style={{ fontWeight: 800, fontSize: 18, color: "#111827" }}>
        ₦{plan.price.toLocaleString()}
        <span style={{ fontWeight: 400, fontSize: 12, color: "#9CA3AF" }}>/{plan.interval}</span>
      </p>
    </div>
  );
}
