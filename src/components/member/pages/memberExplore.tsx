"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Users,
  Compass,
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
  created_at: string;
}

const AVATAR_COLORS = [
  "#0D9488", "#0284C7", "#7C3AED", "#DB2777",
  "#EA580C", "#16A34A", "#CA8A04", "#DC2626",
];

function getAvatarColor(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
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
    if (filter === "discover") orgs = orgs.filter((o) => !joinedOrgIds.has(o.id));

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
      <div style={{ minHeight: "100vh", background: "#F8F9FA", padding: "32px 24px", fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}.sk{background:linear-gradient(90deg,#ececec 25%,#f5f5f5 50%,#ececec 75%);background-size:800px 100%;animation:shimmer 1.5s infinite;border-radius:12px;}`}</style>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div className="sk" style={{ height: 32, width: 180, marginBottom: 24 }} />
          <div className="sk" style={{ height: 44, marginBottom: 20 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
            {[1,2,3,4,5,6].map(i => <div key={i} className="sk" style={{ height: 180 }} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA", fontFamily: "'DM Sans', sans-serif", padding: "32px 24px 96px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #9CA3AF; }
        .org-card { display: flex; flex-direction: column; height: 228px; overflow: hidden; }
        .org-card:hover { border-color: #0D9488 !important; box-shadow: 0 4px 20px rgba(13,148,136,0.1) !important; }
        .org-card:hover .card-arrow { color: #0D9488; transform: translateX(2px); }
        .card-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .card-desc {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 36px;
        }
        .card-address { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .card-email { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; flex: 1; }
        .org-row:hover { border-color: #0D9488 !important; background: #FAFFFE !important; }
        .org-row:hover .card-arrow { color: #0D9488; transform: translateX(2px); }
        .card-arrow { transition: color 200ms, transform 200ms; }
        .filter-chip { transition: all 160ms; cursor: pointer; }
        .view-btn { transition: all 160ms; cursor: pointer; }
      `}</style>

      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Page heading */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} style={{ marginBottom: 24 }}>
          <h1 style={{ fontWeight: 700, fontSize: 26, color: "#111827", letterSpacing: "-0.4px", margin: 0 }}>
            Communities
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
            Find and join organisations that match your interests
          </p>
        </motion.div>

        {/* Search + view toggle */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
          style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search
              size={15}
              style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: searchFocused ? "#0D9488" : "#9CA3AF", transition: "color 200ms" }}
            />
            <input
              type="text"
              placeholder="Search by name, location, topic…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                width: "100%", paddingLeft: 38, paddingRight: search ? 36 : 14,
                paddingTop: 11, paddingBottom: 11, borderRadius: 12,
                border: `1px solid ${searchFocused ? "#0D9488" : "#E5E7EB"}`,
                boxShadow: searchFocused ? "0 0 0 3px rgba(13,148,136,0.08)" : "none",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14,
                color: "#111827", background: "#fff", outline: "none",
                transition: "border-color 250ms, box-shadow 250ms",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", padding: 0 }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* View toggle */}
          <div style={{ display: "flex", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 3, gap: 2 }}>
            {(["grid", "list"] as ViewMode[]).map((v) => (
              <button
                key={v}
                className="view-btn"
                onClick={() => setView(v)}
                style={{
                  background: view === v ? "#F3F4F6" : "transparent",
                  border: "none", borderRadius: 9, padding: "7px 10px",
                  color: view === v ? "#111827" : "#9CA3AF", display: "flex", alignItems: "center",
                }}
              >
                {v === "grid" ? <LayoutGrid size={15} /> : <List size={15} />}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Filter chips */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
          style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {([
            { key: "all", label: `All  ${totalAll}` },
            { key: "discover", label: `Discover  ${totalDiscover}` },
            { key: "joined", label: `Joined  ${totalJoined}` },
          ] as { key: FilterMode; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              className="filter-chip"
              onClick={() => setFilter(key)}
              style={{
                padding: "6px 14px", borderRadius: 999,
                border: `1px solid ${filter === key ? "#0D9488" : "#E5E7EB"}`,
                background: filter === key ? "rgba(13,148,136,0.06)" : "#fff",
                color: filter === key ? "#0D9488" : "#6B7280",
                fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {label}
            </button>
          ))}
          <span style={{ fontSize: 13, color: "#9CA3AF", alignSelf: "center", marginLeft: 4 }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "64px 24px" }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <p style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>No communities found</p>
              <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Try a different search or filter</p>
            </motion.div>
          ) : view === "grid" ? (
            <motion.div
              key="grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 7, alignItems: "start" }}
            >
              {filtered.map((org: Organization, i: number) => (
                <motion.div key={org.id} variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, scale: 0.96 }} custom={i}
                  style={{ display: "flex" }}>
                  <GridCard org={org} isJoined={joinedOrgIds.has(org.id)} onClick={() => setSelected(org)} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="list" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map((org: Organization, i: number) => (
                <motion.div key={org.id} variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, x: -8 }} custom={i}>
                  <ListRow org={org} isJoined={joinedOrgIds.has(org.id)} onClick={() => setSelected(org)} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail drawer */}
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

/* ── Grid card ── */
function GridCard({ org, isJoined, onClick }: { org: Organization; isJoined: boolean; onClick: () => void }) {
  const color = getAvatarColor(org.name);
  return (
    <div
      className="org-card"
      onClick={onClick}
      style={{
        background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB",
        padding: "18px 18px 14px", cursor: "pointer",
        transition: "border-color 200ms, box-shadow 200ms",
      }}
    >
      {/* Top: avatar + joined badge */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 19, color: "#fff",
        }}>
          {org.name.charAt(0).toUpperCase()}
        </div>
        {isJoined ? (
          <span style={{ fontSize: 11, fontWeight: 600, color: "#0D9488", background: "rgba(13,148,136,0.08)", padding: "3px 9px", borderRadius: 999 }}>
            Joined
          </span>
        ) : (
          <span style={{ padding: "3px 9px", fontSize: 11 }}>{"\u00A0"}</span>
        )}
      </div>

      {/* Name — single line with ellipsis */}
      <p className="card-name" style={{ fontWeight: 600, fontSize: 14, color: "#111827", margin: "0 0 4px", lineHeight: 1.3 }}>
        {org.name}
      </p>

      {/* Description — exactly 2 lines with ellipsis */}
      <p className="card-desc" style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5, margin: "0 0 10px" }}>
        {org.description || "\u00A0"}
      </p>

      {/* Location — single line with ellipsis */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10, height: 16 }}>
        <MapPin size={11} color="#9CA3AF" style={{ flexShrink: 0, visibility: org.address ? "visible" : "hidden" }} />
        <span className="card-address" style={{ fontSize: 12, color: "#9CA3AF" }}>
          {org.address || "\u00A0"}
        </span>
      </div>

      {/* Footer — pinned to bottom */}
      <div style={{
        borderTop: "1px solid #F3F4F6", paddingTop: 10,
        display: "flex", alignItems: "center", gap: 8,
        marginTop: "auto",
      }}>
        <span className="card-email" style={{ fontSize: 12, color: "#9CA3AF" }}>{org.email}</span>
        <ArrowRight size={14} className="card-arrow" color="#D1D5DB" style={{ flexShrink: 0 }} />
      </div>
    </div>
  );
}

/* ── List row ── */
function ListRow({ org, isJoined, onClick }: { org: Organization; isJoined: boolean; onClick: () => void }) {
  const color = getAvatarColor(org.name);
  return (
    <div
      className="org-row"
      onClick={onClick}
      style={{
        background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB",
        padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
        transition: "border-color 200ms, background 200ms",
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 11, background: color, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 18, color: "#fff",
      }}>
        {org.name.charAt(0).toUpperCase()}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0, flex: 1 }}>
            {org.name}
          </p>
          {isJoined && (
            <span style={{ fontSize: 10, fontWeight: 600, color: "#0D9488", background: "rgba(13,148,136,0.08)", padding: "2px 8px", borderRadius: 999, flexShrink: 0 }}>
              Joined
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          {org.address ? (
            <div style={{ display: "flex", alignItems: "center", gap: 3, minWidth: 0 }}>
              <MapPin size={11} color="#9CA3AF" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#9CA3AF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {org.address}
              </span>
            </div>
          ) : org.description ? (
            <span style={{ fontSize: 12, color: "#9CA3AF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {org.description}
            </span>
          ) : (
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>—</span>
          )}
        </div>
      </div>

      <ArrowRight size={15} className="card-arrow" color="#D1D5DB" style={{ flexShrink: 0 }} />
    </div>
  );
}

/* ── Detail sheet ── */
function DetailSheet({ org, isJoined, onClose }: { org: Organization; isJoined: boolean; onClose: () => void }) {
  const color = getAvatarColor(org.name);
  const details = [
    { icon: <Mail size={14} />, label: "Email", value: org.email, href: `mailto:${org.email}` },
    org.phone && { icon: <Phone size={14} />, label: "Phone", value: org.phone, href: `tel:${org.phone}` },
    org.address && { icon: <MapPin size={14} />, label: "Address", value: org.address },
    org.website && { icon: <Globe size={14} />, label: "Website", value: org.website, href: org.website },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href?: string }[];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 560, background: "#fff",
          borderRadius: "22px 22px 0 0", padding: "20px 22px 44px",
          maxHeight: "88vh", overflowY: "auto",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E5E7EB", margin: "0 auto 22px" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 22 }}>
          <div style={{
            width: 54, height: 54, borderRadius: 15, background: color, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 24, color: "#fff",
          }}>
            {org.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h2 style={{ fontWeight: 700, fontSize: 19, color: "#111827", letterSpacing: "-0.3px" }}>{org.name}</h2>
              {isJoined && (
                <span style={{ fontSize: 11, fontWeight: 600, color: "#0D9488", background: "rgba(13,148,136,0.08)", padding: "3px 9px", borderRadius: 999 }}>
                  Joined
                </span>
              )}
            </div>
            {org.description && (
              <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4, lineHeight: 1.55 }}>{org.description}</p>
            )}
          </div>
        </div>

        {/* Contact details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {details.map(({ icon, label, value, href }) => (
            <div key={label} style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "12px 14px", borderRadius: 12,
              background: "#F9FAFB", border: "1px solid #F3F4F6",
            }}>
              <div style={{ color: "#0D9488", marginTop: 1, flexShrink: 0 }}>{icon}</div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>
                  {label}
                </p>
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 14, fontWeight: 500, color: "#0D9488", textDecoration: "none" }}>
                    {value}
                  </a>
                ) : (
                  <p style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {isJoined ? (
          <a
            href={`/member/communities/${org.id}`}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", padding: "14px", borderRadius: 14,
              background: "#0D9488", color: "#fff",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15,
              textDecoration: "none",
            }}
          >
            Go to community <ArrowRight size={16} />
          </a>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{
                flex: 1, padding: "14px", borderRadius: 14,
                background: "#0D9488", color: "#fff", border: "none",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer",
              }}
            >
              Request to join
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "14px 18px", borderRadius: 14,
                background: "none", border: "1px solid #E5E7EB",
                color: "#6B7280", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600, fontSize: 14, cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}