// app/member/leaderboard/page.tsx
"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, ChevronRight, Users } from "lucide-react";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemberOrgs } from "@/hooks/memberHook/useMember";
import { useMemberStore } from "@/store/memberStore";
import { Member } from "@/types/organization";
import React, { useCallback } from "react";

const C = {
  teal: "#0D9488",
  coral: "#F06543",
  snow: "#F9FAFB",
  white: "#FFFFFF",
  ink: "#1F2937",
  coolGrey: "#9CA3AF",
  border: "#E5E7EB",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

function SkeletonCard() {
  return (
    <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, height: 100, animation: "pulse 1.5s ease-in-out infinite" }} />
  );
}


export default function LeaderboardIndexPage() {
  const router = useRouter();
  const { data: memberDetails, isLoading } = useMemberOrgs();
  const setMember = useMemberStore((state) => state.setMember);

  const organizations = useMemo(() => {
    if (!memberDetails || memberDetails.length === 0) return [];
    const organizationMap = new Map<string, Member>();
    memberDetails.forEach((member) => {
      const orgId = member.organization_user?.organization_id;
      if (orgId && !organizationMap.has(orgId)) {
        organizationMap.set(orgId, member);
      }
    });
    return Array.from(organizationMap.entries()).map(([orgId, member]) => {
      const org = member.organization_user?.organization;
      return { id: orgId, name: org?.name, description: org?.description, address: org?.address, member };
    });
  }, [memberDetails]);

  const handleOrgClick = useCallback(
    (orgId: string, member: Member) => {
      setMember(orgId, member);
      router.push(`/member/leaderboards/${orgId}`);
    },
    [router, setMember],
  );

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: C.snow, padding: "32px 24px", fontFamily: "Nunito, sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap'); * { box-sizing: border-box; } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ height: 48, width: 260, borderRadius: 10, background: C.white, border: `1px solid ${C.border}`, animation: "pulse 1.5s ease-in-out infinite" }} />
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!memberDetails || memberDetails.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "32px 24px 96px" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap'); * { box-sizing: border-box; }`}</style>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: "64px 32px", textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: 18, background: C.snow, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: C.coolGrey }}>
                <Trophy size={32} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 20, color: C.ink, marginBottom: 8 }}>No communities yet</h3>
              <p style={{ fontWeight: 400, fontSize: 14, color: C.coolGrey, lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>
                Join a community to see its leaderboard rankings
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "32px 24px 96px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap'); * { box-sizing: border-box; }`}</style>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #F59E0B, #D97706)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(245,158,11,0.3)" }}>
              <Trophy size={20} style={{ color: C.white }} />
            </div>
            <h1 style={{ fontWeight: 900, fontSize: "clamp(22px,5vw,30px)", color: C.ink, letterSpacing: "-0.5px" }}>Leaderboards</h1>
          </div>
          <p style={{ fontWeight: 400, fontSize: 15, color: C.coolGrey, marginLeft: 52 }}>
            Select a community to see its rankings
          </p>
        </motion.div>

        {/* Org list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {organizations.map((org, i) => (
            <motion.div key={org.id} variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}>
              <OrgCard org={org} onSelect={() => handleOrgClick(org.id, org.member)} />
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

function OrgCard({ org, onSelect }: { org: any; onSelect: () => void }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <motion.div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      style={{ background: C.white, borderRadius: 16, border: `1px solid ${hovered ? C.teal : C.border}`, padding: "20px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, boxShadow: hovered ? "0 8px 24px rgba(13,148,136,0.12)" : "0 1px 4px rgba(0,0,0,0.04)", transition: "border-color 250ms, box-shadow 250ms" }}
    >
      {/* Avatar */}
      <div style={{ width: 52, height: 52, borderRadius: 14, background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, color: C.white, flexShrink: 0, transition: "transform 250ms", transform: hovered ? "scale(1.05)" : "scale(1)" }}>
        {org.name?.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: 16, color: hovered ? C.teal : C.ink, marginBottom: 4, transition: "color 250ms", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {org.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <TrendingUp size={12} style={{ color: C.coolGrey }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: C.coolGrey }}>View rankings</span>
        </div>
      </div>

      {/* Arrow */}
      <div style={{ width: 32, height: 32, borderRadius: 8, background: hovered ? "rgba(13,148,136,0.08)" : C.snow, border: `1px solid ${hovered ? "rgba(13,148,136,0.2)" : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 250ms" }}>
        <ChevronRight size={16} style={{ color: hovered ? C.teal : C.coolGrey, transition: "color 250ms" }} />
      </div>
    </motion.div>
  );
}