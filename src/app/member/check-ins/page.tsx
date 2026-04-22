"use client";

import { Building2, MapPin } from "lucide-react";
import { useMemberOrgs } from "@/hooks/memberHook/useMember";
import { useRouter } from "next/navigation";
import { useMemberStore } from "@/store/memberStore";
import { Member } from "@/types/organization";
import React, { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const C = {
  teal: "#0D9488",
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
    <div
      style={{
        background: C.white,
        borderRadius: "16px",
        border: `1px solid ${C.border}`,
        height: "240px",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

interface OrgCardProps {
  org: {
    id: string;
    name?: string;
    description?: string;
    address?: string;
    email?: string;
    phone?: string;
    logo?: string | null;
  };
  onClick: () => void;
  index: number;
}

const OrganizationCard = React.memo<OrgCardProps>(({ org, onClick, index }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={index}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        background: C.white,
        borderRadius: "16px",
        border: `1px solid ${hovered ? C.teal : C.border}`,
        padding: "28px",
        cursor: "pointer",
        boxShadow: hovered
          ? "0 12px 32px rgba(13,148,136,0.12)"
          : "0 1px 4px rgba(0,0,0,0.05)",
        transition: "all 300ms",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: C.teal,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Nunito, sans-serif",
            fontWeight: 800,
            fontSize: "22px",
            color: C.white,
            transition: "transform 300ms",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            overflow: "hidden", 
            position: "relative", 
          }}
        >
          {org.logo ? (
            <Image
              src={org.logo}
              alt={org.name ?? ""}
              fill
              className="object-cover"
            />
          ) : (
            org.name?.charAt(0).toUpperCase()
          )}
        </div>
      </div>

      {/* Org info */}
      <h3
        style={{
          fontWeight: 700,
          fontSize: "18px",
          color: hovered ? C.teal : C.ink,
          marginBottom: "8px",
          transition: "color 300ms",
        }}
      >
        {org.name}
      </h3>

      <p
        style={{
          fontWeight: 400,
          fontSize: "13px",
          color: C.coolGrey,
          marginBottom: "16px",
          lineHeight: 1.6,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {org.description}
      </p>

      {/* Contact info */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "16px",
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {org.address && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MapPin size={12} style={{ color: C.teal, flexShrink: 0 }} />
            <span
              style={{
                fontWeight: 400,
                fontSize: "12px",
                color: C.coolGrey,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {org.address}
            </span>
          </div>
        )}
        {org.email && (
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
            {org.email}
          </p>
        )}
        {org.phone && (
          <p
            style={{
              fontWeight: 400,
              fontSize: "12px",
              color: C.coolGrey,
            }}
          >
            {org.phone}
          </p>
        )}
      </div>
    </motion.div>
  );
});

OrganizationCard.displayName = "OrganizationCard";

export default function MyCommunityPage() {
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

      return {
        id: orgId,
        name: org?.name,
        description: org?.description,
        address: org?.address,
        email: org?.email,
        phone: org?.phone,
        website: org?.website,
        logo: org?.logo_url ?? null,
        member,
      };
    });
  }, [memberDetails]);

  const handleOrgClick = useCallback(
    (orgId: string, member: Member) => {
      setMember(orgId, member);
      router.replace(`/member/check-ins/${orgId}`);
    },
    [router, setMember],
  );

  // Loading state
  if (isLoading) {
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
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
          * { box-sizing: border-box; }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        `}</style>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                height: "40px",
                width: "200px",
                background: C.white,
                borderRadius: "8px",
                border: `1px solid ${C.border}`,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!memberDetails || memberDetails.length === 0) {
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
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
          * { box-sizing: border-box; }
        `}</style>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                background: C.white,
                borderRadius: "16px",
                border: `1px solid ${C.border}`,
                padding: "64px 32px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "18px",
                  background: C.snow,
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  color: C.coolGrey,
                }}
              >
                <Building2 size={32} />
              </div>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: "20px",
                  color: C.ink,
                  marginBottom: "8px",
                }}
              >
                No Organizations Available
              </h3>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: "15px",
                  color: C.coolGrey,
                  lineHeight: 1.6,
                  maxWidth: "340px",
                  margin: "0 auto",
                }}
              >
                You don&apos;t have access to any organizations yet.
              </p>
            </div>
          </motion.div>
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
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Page header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          style={{ marginBottom: "32px" }}
        >
          <h1
            style={{
              fontWeight: 800,
              fontSize: "32px",
              color: C.ink,
              letterSpacing: "-0.4px",
            }}
          >
            Check-ins
          </h1>
          <p
            style={{
              fontWeight: 400,
              fontSize: "15px",
              color: C.coolGrey,
              marginTop: "4px",
            }}
          >
            Organizations you have access to
          </p>
        </motion.div>

        {/* Organizations grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {organizations.map((org, i) => (
            <OrganizationCard
              key={org.id}
              org={org}
              index={i + 1}
              onClick={() => handleOrgClick(org.id, org.member)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
