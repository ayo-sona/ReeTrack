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
  Building2,
} from "lucide-react";
import { useAllCommunities } from "@/hooks/useGetCommunities";
import { useMemberOrgs } from "@/hooks/memberHook/useMember";

const C = {
  teal: "#0D9488",
  coral: "#F06543",
  snow: "#F9FAFB",
  white: "#FFFFFF",
  ink: "#1F2937",
  coolGrey: "#9CA3AF",
  border: "#E5E7EB",
  gold: "#F59E0B",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

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

export default function CommunitiesPage() {
  const { data: allOrgs, isLoading } = useAllCommunities();
  const { data: memberOrgs } = useMemberOrgs();
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selected, setSelected] = useState<Organization | null>(null);
  const [showJoined, setShowJoined] = useState(false);

  const joinedOrgIds = useMemo(() => {
    if (!memberOrgs) return new Set<string>();
    return new Set(
      memberOrgs.map((m: { organization_user?: { organization_id?: string } }) => m.organization_user?.organization_id),
    );
  }, [memberOrgs]);

  const filtered = useMemo(() => {
    if (!allOrgs) return [];
    let orgs = allOrgs as Organization[];

    if (!showJoined && !search.trim()) {
      orgs = orgs.filter((o) => !joinedOrgIds.has(o.id));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      orgs = orgs.filter((o) => o.name.toLowerCase().includes(q));
    }

    return orgs;
  }, [allOrgs, search, showJoined, joinedOrgIds]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-nunito">
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          <div style={{ height: 40, width: 200, borderRadius: 10, background: C.white, border: `1px solid ${C.border}`, animation: "pulse 1.5s ease-in-out infinite" }} />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 88, borderRadius: 16, background: C.white, border: `1px solid ${C.border}`, animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "32px 24px 96px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap'); * { box-sizing: border-box; } input::placeholder { color: #9CA3AF; }`}</style>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} style={{ marginBottom: 28 }}>
          <div className="flex items-center gap-3 mb-1">
            <div style={{ width: 40, height: 40, borderRadius: 12, background: C.teal, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Building2 size={20} color={C.white} />
            </div>
            <h1 style={{ fontWeight: 900, fontSize: "clamp(22px,5vw,30px)", color: C.ink, letterSpacing: "-0.5px" }}>
              Communities
            </h1>
          </div>
          <div className="flex items-center justify-between" style={{ marginLeft: 52 }}>
            <p style={{ fontWeight: 400, fontSize: 14, color: C.coolGrey }}>
              {filtered.length} communities
            </p>
            {joinedOrgIds.size > 0 && (
              <button
                onClick={() => setShowJoined((v) => !v)}
                style={{
                  fontSize: 12, fontWeight: 700,
                  color: showJoined ? C.teal : C.coolGrey,
                  background: showJoined ? "rgba(13,148,136,0.08)" : "transparent",
                  border: `1px solid ${showJoined ? "rgba(13,148,136,0.2)" : C.border}`,
                  borderRadius: 999, padding: "4px 12px", cursor: "pointer",
                  fontFamily: "Nunito, sans-serif", transition: "all 200ms",
                }}
              >
                {showJoined ? "Hiding joined" : "Show joined"}
              </button>
            )}
          </div>
        </motion.div>

        {/* Search */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} style={{ marginBottom: 20 }}>
          <div style={{ position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: searchFocused ? C.teal : C.coolGrey, transition: "color 200ms" }} />
            <input
              type="text"
              placeholder="Search communities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                width: "100%", paddingLeft: 40, paddingRight: search ? 36 : 14,
                paddingTop: 11, paddingBottom: 11, borderRadius: 12,
                border: `1px solid ${searchFocused ? C.teal : C.border}`,
                boxShadow: searchFocused ? "0 0 0 3px rgba(13,148,136,0.08)" : "none",
                fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: 14,
                color: C.ink, background: C.white, outline: "none",
                transition: "border-color 300ms, box-shadow 300ms",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.coolGrey, display: "flex" }}>
                <X size={15} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Community list */}
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((org: Organization, i: number) => {
              const isJoined = joinedOrgIds.has(org.id);
              return (
                <motion.div
                  key={org.id}
                  layout
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  custom={i + 2}
                >
                  <CommunityCard org={org} isJoined={isJoined} onClick={() => setSelected(org)} />
                </motion.div>
              );
            })}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "56px 24px" }}>
              <p style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>No communities found</p>
              <p style={{ fontSize: 13, color: C.coolGrey, marginTop: 4 }}>Try a different search</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail sheet */}
      <AnimatePresence>
        {selected && (
          <CommunitySheet org={selected} isJoined={joinedOrgIds.has(selected.id)} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function CommunityCard({ org, isJoined, onClick }: { org: Organization; isJoined: boolean; onClick: () => void }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      style={{
        background: C.white, borderRadius: 16,
        border: `1px solid ${hovered ? C.teal : C.border}`,
        padding: "18px 20px", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 14,
        boxShadow: hovered ? "0 8px 24px rgba(13,148,136,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "border-color 250ms, box-shadow 250ms",
      }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 14, background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20, color: C.white, flexShrink: 0 }}>
        {org.name.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <p style={{ fontWeight: 700, fontSize: 15, color: hovered ? C.teal : C.ink, transition: "color 250ms", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {org.name}
          </p>
          {isJoined && (
            <span style={{ fontSize: 10, fontWeight: 700, color: C.teal, background: "rgba(13,148,136,0.08)", padding: "2px 8px", borderRadius: 999, flexShrink: 0 }}>
              Joined
            </span>
          )}
        </div>
        {org.address && (
          <div className="flex items-center gap-1">
            <MapPin size={11} color={C.coolGrey} />
            <p style={{ fontSize: 12, color: C.coolGrey, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {org.address}
            </p>
          </div>
        )}
        {!org.address && (
          <p style={{ fontSize: 12, color: C.coolGrey }}>{org.email}</p>
        )}
      </div>
      <ArrowRight size={16} color={hovered ? C.teal : C.coolGrey} style={{ flexShrink: 0, transition: "color 250ms" }} />
    </motion.div>
  );
}

function CommunitySheet({ org, isJoined, onClose }: { org: Organization; isJoined: boolean; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 560, background: C.white, borderRadius: "24px 24px 0 0", padding: "24px 24px 40px", maxHeight: "85vh", overflowY: "auto" }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: "0 auto 20px" }} />
        <div className="flex items-center gap-4 mb-6">
          <div style={{ width: 56, height: 56, borderRadius: 16, background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, color: C.white, flexShrink: 0 }}>
            {org.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 style={{ fontWeight: 800, fontSize: 20, color: C.ink }}>{org.name}</h2>
              {isJoined && (
                <span style={{ fontSize: 10, fontWeight: 700, color: C.teal, background: "rgba(13,148,136,0.08)", padding: "2px 8px", borderRadius: 999 }}>
                  Joined
                </span>
              )}
            </div>
            {org.description && (
              <p style={{ fontSize: 13, color: C.coolGrey, marginTop: 2 }}>{org.description}</p>
            )}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          {[
            { icon: <Mail size={15} />, label: "Email", value: org.email },
            { icon: <Phone size={15} />, label: "Phone", value: org.phone },
            { icon: <MapPin size={15} />, label: "Address", value: org.address },
            { icon: <Globe size={15} />, label: "Website", value: org.website, isLink: true },
          ]
            .filter((item) => item.value)
            .map(({ icon, label, value, isLink }) => (
              <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: 12, background: C.snow, border: `1px solid ${C.border}` }}>
                <div style={{ color: C.teal, marginTop: 1, flexShrink: 0 }}>{icon}</div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 600, color: C.coolGrey, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>{label}</p>
                  {isLink ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 600, color: C.teal, textDecoration: "none" }}>{value}</a>
                  ) : (
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{value}</p>
                  )}
                </div>
              </div>
            ))}
        </div>
        {!isJoined ? (
          <button
            style={{ width: "100%", padding: "14px", borderRadius: 14, background: C.teal, border: "none", color: C.white, fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 15, cursor: "pointer" }}
            onClick={() => {}}
          >
            Join Community
          </button>
        ) : (
          <div style={{ textAlign: "center", padding: "14px", borderRadius: 14, background: "rgba(13,148,136,0.06)", border: "1px solid rgba(13,148,136,0.15)" }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: C.teal }}>You&apos;re already a member of this community</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}