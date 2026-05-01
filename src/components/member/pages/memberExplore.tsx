"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Search,
  X,
  MapPin,
  Globe,
  Phone,
  Mail,
  ArrowRight,
  LayoutGrid,
  List,
  ShoppingBag,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { useAllCommunities } from "@/hooks/useGetCommunities";
import { useMemberOrgs } from "@/hooks/memberHook/useMember";

interface Organization {
  id: string;
  name: string;
  email: string;
  address?: string;
  website?: string;
  phone?: string;
  description?: string;
  logo_url?: string | null;
  created_at: string;
}

// ── Demo plans per org — swap with usePublicPlans({ orgId }) when ready ──
const EXPLORE_DEMO_PLANS = [
  {
    id: "dp-1",
    name: "Starter",
    price: 15000,
    interval: "monthly",
    description: "Perfect for individuals getting started.",
    features: [
      "Access to all resources",
      "Monthly newsletter",
      "Community forum",
    ],
  },
  {
    id: "dp-2",
    name: "Growth",
    price: 35000,
    interval: "monthly",
    description: "For serious members who want more.",
    features: [
      "Everything in Starter",
      "1-on-1 mentorship (monthly)",
      "Priority support",
      "Event discounts",
    ],
    popular: true,
  },
  {
    id: "dp-3",
    name: "Pro",
    price: 75000,
    interval: "monthly",
    description: "Full access, no limits.",
    features: [
      "Everything in Growth",
      "Unlimited 1-on-1 sessions",
      "Private mastermind group",
      "Annual retreat access",
    ],
  },
];

// ── Demo marketplace listings per org — swap with usePublicListings({ orgId }) when ready ──
const EXPLORE_DEMO_LISTINGS = [
  {
    id: "el-1",
    title: "Annual Conference Ticket",
    price: 75000,
    description: "Full access to our 2-day annual summit.",
  },
  {
    id: "el-2",
    title: "Business Growth Bootcamp",
    price: 120000,
    description: "Intensive 4-week cohort for founders.",
    installment: { count: 3, interval: "monthly" },
  },
  {
    id: "el-3",
    title: "Member Kit – Branded Pack",
    price: 18500,
    description: "Official community merch bundle.",
  },
];

const PALETTE = [
  { accent: "#0D9488", light: "#E6F7F5" },
  { accent: "#0284C7", light: "#E0F2FE" },
  { accent: "#7C3AED", light: "#EDE9FE" },
  { accent: "#DB2777", light: "#FCE7F3" },
  { accent: "#EA580C", light: "#FEF3C7" },
  { accent: "#16A34A", light: "#DCFCE7" },
  { accent: "#CA8A04", light: "#FEF9C3" },
  { accent: "#DC2626", light: "#FEE2E2" },
];

function getPalette(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return PALETTE[h % PALETTE.length];
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
  }),
};

type ViewMode = "grid" | "list";
type FilterMode = "all" | "joined" | "discover";
type ModalTab = "plans" | "marketplace";

export default function CommunitiesPage() {
  const { data: allOrgs, isLoading } = useAllCommunities();
  const { data: memberOrgs } = useMemberOrgs();
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selected, setSelected] = useState<Organization | null>(null);
  const [view, setView] = useState<ViewMode>("grid");
  const [filter, setFilter] = useState<FilterMode>("all");

  const joinedOrgIds = useMemo(() => {
    if (!memberOrgs) return new Set<string>();
    return new Set(
      memberOrgs.map(
        (m: { organization_user?: { organization_id?: string } }) =>
          m.organization_user?.organization_id,
      ),
    );
  }, [memberOrgs]);

  const filtered = useMemo(() => {
    if (!allOrgs) return [];
    let orgs = allOrgs as Organization[];
    if (filter === "joined") orgs = orgs.filter((o) => joinedOrgIds.has(o.id));
    if (filter === "discover")
      orgs = orgs.filter((o) => !joinedOrgIds.has(o.id));
    if (search.trim()) {
      const q = search.toLowerCase();
      orgs = orgs.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          (o.address ?? "").toLowerCase().includes(q) ||
          (o.description ?? "").toLowerCase().includes(q),
      );
    }
    return orgs;
  }, [allOrgs, search, filter, joinedOrgIds]);

  const searchFiltered = useMemo(() => {
    if (!allOrgs) return [];
    let orgs = allOrgs as Organization[];
    if (search.trim()) {
      const q = search.toLowerCase();
      orgs = orgs.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          (o.address ?? "").toLowerCase().includes(q) ||
          (o.description ?? "").toLowerCase().includes(q),
      );
    }
    return orgs;
  }, [allOrgs, search]);

  const totalAll = searchFiltered.length;
  const totalJoined = searchFiltered.filter((o) =>
    joinedOrgIds.has(o.id),
  ).length;
  const totalDiscover = searchFiltered.filter(
    (o) => !joinedOrgIds.has(o.id),
  ).length;

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F8F9FA",
          padding: "32px 24px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <style>{`@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}.sk{background:linear-gradient(90deg,#ececec 25%,#f5f5f5 50%,#ececec 75%);background-size:800px 100%;animation:shimmer 1.5s infinite;border-radius:16px;}`}</style>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div
            className="sk"
            style={{ height: 32, width: 180, marginBottom: 24 }}
          />
          <div className="sk" style={{ height: 44, marginBottom: 20 }} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
              gap: 16,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="sk" style={{ height: 260 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F9FA",
        fontFamily: "'DM Sans', sans-serif",
        padding: "32px 24px 96px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #9CA3AF; }

        .grid-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #EBEBEB;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          transition: box-shadow 240ms ease, transform 240ms ease, border-color 240ms ease;
        }
        .grid-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.10);
          transform: translateY(-4px);
          border-color: transparent;
        }
        .grid-card:hover .cta-arrow { transform: translateX(3px); opacity: 1; }
        .cta-arrow { transition: transform 220ms ease, opacity 220ms ease; opacity: 0.5; }

        .org-row { transition: border-color 200ms, background 200ms; }
        .org-row:hover { border-color: #0D9488 !important; background: #FAFFFE !important; }
        .org-row:hover .list-arrow { color: #0D9488; transform: translateX(2px); }
        .list-arrow { transition: color 200ms, transform 200ms; }
        .filter-chip { transition: all 160ms; cursor: pointer; }
        .view-btn { transition: all 160ms; cursor: pointer; }
        .modal-tab { transition: all 180ms; cursor: pointer; border: none; background: none; font-family: 'DM Sans', sans-serif; }
        .plan-card { transition: box-shadow 200ms, border-color 200ms; }
        .plan-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
      `}</style>

      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        {/* Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          style={{ marginBottom: 24 }}
        >
          <h1
            style={{
              fontWeight: 700,
              fontSize: 26,
              color: "#111827",
              letterSpacing: "-0.4px",
              margin: 0,
            }}
          >
            Communities
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
            Find and join organisations that match your interests
          </p>
        </motion.div>

        {/* Search + view toggle */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 12,
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, position: "relative" }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 13,
                top: "50%",
                transform: "translateY(-50%)",
                color: searchFocused ? "#0D9488" : "#9CA3AF",
                transition: "color 200ms",
              }}
            />
            <input
              type="text"
              placeholder="Search by name, location, topic…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                width: "100%",
                paddingLeft: 38,
                paddingRight: search ? 36 : 14,
                paddingTop: 11,
                paddingBottom: 11,
                borderRadius: 12,
                border: `1px solid ${searchFocused ? "#0D9488" : "#E5E7EB"}`,
                boxShadow: searchFocused
                  ? "0 0 0 3px rgba(13,148,136,0.08)"
                  : "none",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                color: "#111827",
                background: "#fff",
                outline: "none",
                transition: "border-color 250ms, box-shadow 250ms",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: 11,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9CA3AF",
                  display: "flex",
                  padding: 0,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div
            style={{
              display: "flex",
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: 3,
              gap: 2,
            }}
          >
            {(["grid", "list"] as ViewMode[]).map((v) => (
              <button
                key={v}
                className="view-btn"
                onClick={() => setView(v)}
                style={{
                  background: view === v ? "#F3F4F6" : "transparent",
                  border: "none",
                  borderRadius: 9,
                  padding: "7px 10px",
                  color: view === v ? "#111827" : "#9CA3AF",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {v === "grid" ? <LayoutGrid size={15} /> : <List size={15} />}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Filter chips */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {(
            [
              { key: "all", label: `All  ${totalAll}` },
              { key: "discover", label: `Discover  ${totalDiscover}` },
              { key: "joined", label: `Joined  ${totalJoined}` },
            ] as { key: FilterMode; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              className="filter-chip"
              onClick={() => setFilter(key)}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: `1px solid ${filter === key ? "#0D9488" : "#E5E7EB"}`,
                background: filter === key ? "rgba(13,148,136,0.06)" : "#fff",
                color: filter === key ? "#0D9488" : "#6B7280",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {label}
            </button>
          ))}
          <span
            style={{
              fontSize: 13,
              color: "#9CA3AF",
              alignSelf: "center",
              marginLeft: 4,
            }}
          >
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "64px 24px" }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <p style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>
                No communities found
              </p>
              <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                Try a different search or filter
              </p>
            </motion.div>
          ) : view === "grid" ? (
            <motion.div
              key="grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 16,
                alignItems: "start",
              }}
            >
              {filtered.map((org: Organization, i: number) => (
                <motion.div
                  key={org.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.96 }}
                  custom={i}
                >
                  <GridCard
                    org={org}
                    isJoined={joinedOrgIds.has(org.id)}
                    onClick={() => setSelected(org)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              {filtered.map((org: Organization, i: number) => (
                <motion.div
                  key={org.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: -8 }}
                  custom={i}
                >
                  <ListRow
                    org={org}
                    isJoined={joinedOrgIds.has(org.id)}
                    onClick={() => setSelected(org)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selected && (
          <CommunityModal
            org={selected}
            isJoined={joinedOrgIds.has(selected.id)}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Shared org avatar ── */
function OrgAvatar({
  org,
  size,
  radius,
}: {
  org: Organization;
  size: number;
  radius: number;
}) {
  const { accent } = getPalette(org.name);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: accent,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.4,
        color: "#fff",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {org.logo_url ? (
        <Image
          src={org.logo_url}
          alt={org.name}
          fill
          className="object-cover"
        />
      ) : (
        org.name.charAt(0).toUpperCase()
      )}
    </div>
  );
}

/* ── Grid card ── */
function GridCard({
  org,
  isJoined,
  onClick,
}: {
  org: Organization;
  isJoined: boolean;
  onClick: () => void;
}) {
  const { accent, light } = getPalette(org.name);
  return (
    <div className="grid-card" onClick={onClick}>
      <div
        style={{
          background: light,
          padding: "22px 22px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -28,
            right: -28,
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: accent,
            opacity: 0.13,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 32,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: accent,
            opacity: 0.09,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 16,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 24,
              color: "#fff",
              overflow: "hidden",
              position: "relative",
              boxShadow: `0 6px 16px ${accent}38`,
            }}
          >
            {org.logo_url ? (
              <Image
                src={org.logo_url}
                alt={org.name}
                fill
                className="object-cover"
              />
            ) : (
              org.name.charAt(0).toUpperCase()
            )}
          </div>
          {isJoined && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.4px",
                textTransform: "uppercase",
                color: accent,
                background: "#fff",
                padding: "4px 10px",
                borderRadius: 999,
                border: `1px solid ${accent}28`,
                boxShadow: `0 2px 8px ${accent}18`,
              }}
            >
              Joined
            </span>
          )}
        </div>
        <p
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: "#111827",
            margin: "0 0 18px",
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {org.name}
        </p>
      </div>
      <div
        style={{
          padding: "16px 22px 20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <p
          style={{
            fontSize: 12.5,
            color: "#6B7280",
            lineHeight: 1.65,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 40,
          }}
        >
          {org.description || "No description available."}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {org.address && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={11} color={accent} style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontSize: 11.5,
                  color: "#9CA3AF",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {org.address}
              </span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Mail size={11} color={accent} style={{ flexShrink: 0 }} />
            <span
              style={{
                fontSize: 11.5,
                color: "#9CA3AF",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {org.email}
            </span>
          </div>
        </div>
        <div
          style={{
            marginTop: "auto",
            paddingTop: 14,
            borderTop: "1px solid #F0F0F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: accent }}>
            View details
          </span>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: light,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowRight size={13} color={accent} className="cta-arrow" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── List row ── */
function ListRow({
  org,
  isJoined,
  onClick,
}: {
  org: Organization;
  isJoined: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="org-row"
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #E5E7EB",
        padding: "14px 16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <OrgAvatar org={org} size={42} radius={11} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 2,
          }}
        >
          <p
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: "#111827",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
              flex: 1,
            }}
          >
            {org.name}
          </p>
          {isJoined && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#0D9488",
                background: "rgba(13,148,136,0.08)",
                padding: "2px 8px",
                borderRadius: 999,
                flexShrink: 0,
              }}
            >
              Joined
            </span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 0,
          }}
        >
          {org.address ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                minWidth: 0,
              }}
            >
              <MapPin size={11} color="#9CA3AF" style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontSize: 12,
                  color: "#9CA3AF",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {org.address}
              </span>
            </div>
          ) : org.description ? (
            <span
              style={{
                fontSize: 12,
                color: "#9CA3AF",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {org.description}
            </span>
          ) : (
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>—</span>
          )}
        </div>
      </div>
      <ArrowRight
        size={15}
        className="list-arrow"
        color="#D1D5DB"
        style={{ flexShrink: 0 }}
      />
    </div>
  );
}

/* ── Big centered community modal with tabs ── */
function CommunityModal({
  org,
  isJoined,
  onClose,
}: {
  org: Organization;
  isJoined: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<ModalTab>("plans");
  const { accent, light } = getPalette(org.name);

  const details = [
    org.address && { icon: <MapPin size={13} />, label: org.address },
    org.phone && {
      icon: <Phone size={13} />,
      label: org.phone,
      href: `tel:${org.phone}`,
    },
    org.website && {
      icon: <Globe size={13} />,
      label: org.website,
      href: org.website,
    },
    { icon: <Mail size={13} />, label: org.email, href: `mailto:${org.email}` },
  ].filter(Boolean) as {
    icon: React.ReactNode;
    label: string;
    href?: string;
  }[];

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
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 680,
          background: "#fff",
          borderRadius: 24,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
        }}
      >
        {/* ── Modal header ── */}
        <div
          style={{
            background: light,
            padding: "24px 24px 0",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: "absolute",
              top: -32,
              right: -32,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: accent,
              opacity: 0.12,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 64,
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: accent,
              opacity: 0.08,
              pointerEvents: "none",
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "rgba(0,0,0,0.08)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <X size={15} color="#374151" />
          </button>

          {/* Org identity */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              marginBottom: 16,
              position: "relative",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background: accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 26,
                color: "#fff",
                overflow: "hidden",
                position: "relative",
                flexShrink: 0,
                boxShadow: `0 8px 20px ${accent}40`,
              }}
            >
              {org.logo_url ? (
                <Image
                  src={org.logo_url}
                  alt={org.name}
                  fill
                  className="object-cover"
                />
              ) : (
                org.name.charAt(0).toUpperCase()
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#111827",
                    letterSpacing: "-0.4px",
                    margin: 0,
                  }}
                >
                  {org.name}
                </h2>
                {isJoined && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: accent,
                      background: "#fff",
                      padding: "3px 10px",
                      borderRadius: 999,
                      border: `1px solid ${accent}30`,
                    }}
                  >
                    Joined
                  </span>
                )}
              </div>
              {org.description && (
                <p
                  style={{
                    fontSize: 13,
                    color: "#6B7280",
                    marginTop: 5,
                    lineHeight: 1.55,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {org.description}
                </p>
              )}
              {/* Contact pills */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginTop: 10,
                }}
              >
                {details.map(({ icon, label, href }, idx) =>
                  href ? (
                    <a
                      key={idx}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "4px 10px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.7)",
                        border: "1px solid rgba(0,0,0,0.07)",
                        fontSize: 12,
                        color: "#374151",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      <span style={{ color: accent }}>{icon}</span>
                      {label}
                    </a>
                  ) : (
                    <span
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "4px 10px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.7)",
                        border: "1px solid rgba(0,0,0,0.07)",
                        fontSize: 12,
                        color: "#374151",
                        fontWeight: 500,
                      }}
                    >
                      <span style={{ color: accent }}>{icon}</span>
                      {label}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div
            style={{
              display: "flex",
              gap: 0,
              borderTop: "1px solid rgba(0,0,0,0.06)",
              marginTop: 4,
            }}
          >
            {(
              [
                {
                  key: "plans",
                  label: "Plans",
                  icon: <CreditCard size={14} />,
                },
                {
                  key: "marketplace",
                  label: "Marketplace",
                  icon: <ShoppingBag size={14} />,
                },
              ] as { key: ModalTab; label: string; icon: React.ReactNode }[]
            ).map(({ key, label, icon }) => (
              <button
                key={key}
                className="modal-tab"
                onClick={() => setActiveTab(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: activeTab === key ? accent : "#9CA3AF",
                  borderBottom: `2px solid ${activeTab === key ? accent : "transparent"}`,
                  transition: "all 180ms",
                }}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Scrollable tab content ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 28px" }}>
          <AnimatePresence mode="wait">
            {activeTab === "plans" ? (
              <motion.div
                key="plans"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: 12,
                  }}
                >
                  {EXPLORE_DEMO_PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      className="plan-card"
                      style={{
                        borderRadius: 16,
                        border: `1.5px solid ${plan.popular ? accent : "#E5E7EB"}`,
                        background: plan.popular ? light : "#fff",
                        padding: "18px 16px",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                      }}
                    >
                      {plan.popular && (
                        <span
                          style={{
                            position: "absolute",
                            top: -1,
                            right: 12,
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#fff",
                            background: accent,
                            padding: "3px 10px",
                            borderRadius: "0 0 8px 8px",
                            letterSpacing: "0.3px",
                          }}
                        >
                          POPULAR
                        </span>
                      )}
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          color: "#111827",
                          margin: "0 0 4px",
                        }}
                      >
                        {plan.name}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#6B7280",
                          margin: "0 0 12px",
                          lineHeight: 1.5,
                        }}
                      >
                        {plan.description}
                      </p>
                      <div style={{ marginBottom: 14 }}>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: 22,
                            color: "#111827",
                          }}
                        >
                          ₦{plan.price.toLocaleString()}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "#9CA3AF",
                            marginLeft: 4,
                          }}
                        >
                          /{plan.interval === "monthly" ? "mo" : "yr"}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          marginBottom: 16,
                        }}
                      >
                        {plan.features.map((f, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 7,
                            }}
                          >
                            <div
                              style={{
                                width: 14,
                                height: 14,
                                borderRadius: "50%",
                                background: accent,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                marginTop: 1,
                              }}
                            >
                              <svg width="8" height="8" viewBox="0 0 8 8">
                                <path
                                  d="M1.5 4L3.5 6L6.5 2"
                                  stroke="#fff"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  fill="none"
                                />
                              </svg>
                            </div>
                            <span
                              style={{
                                fontSize: 12,
                                color: "#374151",
                                lineHeight: 1.4,
                              }}
                            >
                              {f}
                            </span>
                          </div>
                        ))}
                      </div>
                      <a
                        href={`/member/communities/${org.id}`}
                        style={{
                          marginTop: "auto",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          padding: "10px",
                          borderRadius: 10,
                          background: plan.popular ? accent : "#F3F4F6",
                          color: plan.popular ? "#fff" : "#374151",
                          fontSize: 13,
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        Get started <ChevronRight size={13} />
                      </a>
                    </div>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "#9CA3AF",
                    textAlign: "center",
                    marginTop: 16,
                  }}
                >
                  Placeholder plans — live data loads when you visit the
                  community
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="marketplace"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {EXPLORE_DEMO_LISTINGS.map((item) => {
                    const { accent: itemAccent, light: itemLight } = getPalette(
                      item.title,
                    );
                    const backHref = encodeURIComponent("/member/explore");
                    const href = `/member/marketplace/checkout/${item.id}?title=${encodeURIComponent(item.title)}&price=${item.price}&desc=${encodeURIComponent(item.description)}&backHref=${backHref}&backLabel=${encodeURIComponent("Back to Explore")}`;
                    return (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          padding: "14px 16px",
                          borderRadius: 14,
                          background: "#F9FAFB",
                          border: "1px solid #F0F0F0",
                        }}
                      >
                        {/* Placeholder cover */}
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 12,
                            background: itemLight,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 20,
                            color: itemAccent,
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: -8,
                              right: -8,
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              background: itemAccent,
                              opacity: 0.2,
                            }}
                          />
                          {item.title.charAt(0)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#111827",
                              margin: 0,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.title}
                          </p>
                          <p
                            style={{
                              fontSize: 12,
                              color: "#6B7280",
                              margin: "3px 0 0",
                              lineHeight: 1.4,
                            }}
                          >
                            {item.description}
                          </p>
                          <p
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#111827",
                              margin: "5px 0 0",
                            }}
                          >
                            ₦{item.price.toLocaleString()}
                            {"installment" in item && item.installment ? (
                              <span
                                style={{ fontWeight: 500, color: "#9CA3AF" }}
                              >
                                {" "}
                                · or {item.installment.count}× ₦
                                {Math.round(
                                  item.price / item.installment.count,
                                ).toLocaleString()}
                                /
                                {item.installment.interval === "monthly"
                                  ? "mo"
                                  : "wk"}
                              </span>
                            ) : null}
                          </p>
                        </div>
                        <a
                          href={href}
                          style={{
                            padding: "8px 16px",
                            borderRadius: 10,
                            background: "#0D9488",
                            color: "#fff",
                            fontSize: 13,
                            fontWeight: 700,
                            textDecoration: "none",
                            flexShrink: 0,
                            fontFamily: "'DM Sans', sans-serif",
                            boxShadow: "0 4px 12px rgba(13,148,136,0.25)",
                          }}
                        >
                          Buy Now
                        </a>
                      </div>
                    );
                  })}
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "#9CA3AF",
                    textAlign: "center",
                    marginTop: 16,
                  }}
                >
                  Placeholder listings — live data loads when the org publishes
                  products
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Sticky footer CTA ── */}
        <div
          style={{
            padding: "14px 24px 20px",
            borderTop: "1px solid #F0F0F0",
            flexShrink: 0,
          }}
        >
          <a
            href={`/member/communities/${org.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: "14px",
              borderRadius: 14,
              background: accent,
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              textDecoration: "none",
              boxShadow: `0 6px 20px ${accent}40`,
            }}
          >
            {isJoined ? "Go to community" : "View community"}{" "}
            <ArrowRight size={16} />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
