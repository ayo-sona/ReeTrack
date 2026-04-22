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

  const totalJoined = joinedOrgIds.size;
  const totalAll = (allOrgs as Organization[] | undefined)?.length ?? 0;
  const totalDiscover = totalAll - totalJoined;

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
          <DetailSheet
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

/* ── Grid card — editorial-geometric ── */
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
      {/* ── Colored header block ── */}
      <div
        style={{
          background: light,
          padding: "22px 22px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles in header */}
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

        {/* Top row: logo + joined pill */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 16,
            position: "relative",
          }}
        >
          {/* Logo */}
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

        {/* Org name — sits in the colored zone */}
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

      {/* ── White body ── */}
      <div
        style={{
          padding: "16px 22px 20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Description */}
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

        {/* Meta */}
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

        {/* Footer CTA */}
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

/* ── Detail sheet ── */
function DetailSheet({
  org,
  isJoined,
  onClose,
}: {
  org: Organization;
  isJoined: boolean;
  onClose: () => void;
}) {
  const details = [
    {
      icon: <Mail size={14} />,
      label: "Email",
      value: org.email,
      href: `mailto:${org.email}`,
    },
    org.phone && {
      icon: <Phone size={14} />,
      label: "Phone",
      value: org.phone,
      href: `tel:${org.phone}`,
    },
    org.address && {
      icon: <MapPin size={14} />,
      label: "Address",
      value: org.address,
    },
    org.website && {
      icon: <Globe size={14} />,
      label: "Website",
      value: org.website,
      href: org.website,
    },
  ].filter(Boolean) as {
    icon: React.ReactNode;
    label: string;
    value: string;
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
          padding: "20px 22px 44px",
          maxHeight: "88vh",
          overflowY: "auto",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: "#E5E7EB",
            margin: "0 auto 22px",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            marginBottom: 22,
          }}
        >
          <OrgAvatar org={org} size={54} radius={15} />
          <div style={{ flex: 1, minWidth: 0 }}>
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
                  fontSize: 19,
                  color: "#111827",
                  letterSpacing: "-0.3px",
                }}
              >
                {org.name}
              </h2>
              {isJoined && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#0D9488",
                    background: "rgba(13,148,136,0.08)",
                    padding: "3px 9px",
                    borderRadius: 999,
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
                  marginTop: 4,
                  lineHeight: 1.55,
                }}
              >
                {org.description}
              </p>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {details.map(({ icon, label, value, href }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 12,
                background: "#F9FAFB",
                border: "1px solid #F3F4F6",
              }}
            >
              <div style={{ color: "#0D9488", marginTop: 1, flexShrink: 0 }}>
                {icon}
              </div>
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    marginBottom: 3,
                  }}
                >
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#0D9488",
                      textDecoration: "none",
                    }}
                  >
                    {value}
                  </a>
                ) : (
                  <p
                    style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}
                  >
                    {value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {isJoined ? (
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
              background: "#0D9488",
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              textDecoration: "none",
            }}
          >
            Go to community <ArrowRight size={16} />
          </a>
        ) : (
          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 14,
              background: "none",
              border: "1px solid #E5E7EB",
              color: "#6B7280",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
