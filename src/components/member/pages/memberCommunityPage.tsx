"use client";

import { Building2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCommunity } from "@/hooks/memberHook/useCommunity";

const C = {
  teal:     "#0D9488",
  snow:     "#F9FAFB",
  white:    "#FFFFFF",
  ink:      "#1F2937",
  coolGrey: "#9CA3AF",
  border:   "#E5E7EB",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

function SkeletonCard() {
  return (
    <div style={{
      background: C.white, borderRadius: "16px",
      border: `1px solid ${C.border}`, height: "280px",
      animation: "pulse 1.5s ease-in-out infinite",
    }} />
  );
}

function OrgCard({ item, index }: { item: any; index: number }) {
  const activeCount = item.subscriptions.filter((s: any) => s.status === "active").length;

  return (
    <Link href={`/member/organizations/${item.organization.id}`} style={{ textDecoration: "none" }}>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={index}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          background: C.white,
          borderRadius: "16px",
          border: `1px solid ${C.border}`,
          padding: "28px",
          cursor: "pointer",
          transition: "all 300ms",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = C.teal;
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(13,148,136,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = C.border;
          e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
        }}
      >
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "14px",
            background: C.teal,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "22px",
            color: C.white, flexShrink: 0,
            transition: "transform 300ms",
          }}>
            {item.organization.name.charAt(0).toUpperCase()}
          </div>
          {activeCount > 0 && (
            <span style={{
              padding: "5px 12px", borderRadius: "999px",
              background: "rgba(13,148,136,0.1)", color: C.teal,
              fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "12px",
              flexShrink: 0,
            }}>
              {activeCount} Active
            </span>
          )}
        </div>

        {/* Org info */}
        <h3 style={{
          fontWeight: 700, fontSize: "18px", color: C.ink,
          marginBottom: "8px", transition: "color 300ms",
        }}>
          {item.organization.name}
        </h3>
        <p style={{
          fontWeight: 400, fontSize: "13px", color: C.coolGrey,
          marginBottom: "16px", lineHeight: 1.6,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {item.organization.address}
        </p>

        {/* Contact */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
          <p style={{
            fontWeight: 400, fontSize: "13px", color: C.coolGrey,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {item.organization.email}
          </p>
          <p style={{ fontWeight: 400, fontSize: "13px", color: C.coolGrey }}>
            {item.organization.phone}
          </p>
        </div>

        {/* Subscriptions */}
        {item.subscriptions.length > 0 && (
          <div style={{
            marginTop: "auto",
            paddingTop: "16px",
            borderTop: `1px solid ${C.border}`,
          }}>
            <p style={{
              fontWeight: 600, fontSize: "12px", color: C.coolGrey,
              textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px",
            }}>
              Your Subscriptions
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {item.subscriptions.slice(0, 2).map((sub: any) => (
                <span key={sub.id} style={{
                  padding: "5px 10px", borderRadius: "6px",
                  background: C.snow, border: `1px solid ${C.border}`,
                  fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "12px",
                  color: C.ink,
                }}>
                  {sub.plan.name}
                </span>
              ))}
              {item.subscriptions.length > 2 && (
                <span style={{
                  padding: "5px 10px", borderRadius: "6px",
                  background: C.snow, border: `1px solid ${C.border}`,
                  fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "12px",
                  color: C.coolGrey,
                }}>
                  +{item.subscriptions.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* View details arrow */}
        <div style={{
          marginTop: "20px",
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          gap: "6px",
          fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "14px",
          color: C.teal,
          transition: "gap 300ms",
        }}>
          <span>View Details</span>
          <span style={{ transition: "transform 300ms" }}>→</span>
        </div>
      </motion.div>
    </Link>
  );
}

export default function MyCommunityPage() {
  const { data: communityData, isLoading } = useCommunity();

  // Loading
  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "32px 24px 96px" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
          * { box-sizing: border-box; }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        `}</style>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "32px" }}>
            <div style={{ height: "40px", width: "200px", background: C.white, borderRadius: "8px", border: `1px solid ${C.border}`, animation: "pulse 1.5s ease-in-out infinite" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!communityData || !communityData.organization) {
    return (
      <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "32px 24px 96px" }}>
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
            <div style={{
              background: C.white, borderRadius: "16px",
              border: `1px solid ${C.border}`, padding: "64px 32px",
              textAlign: "center",
            }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "18px",
                background: C.snow, border: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px", color: C.coolGrey,
              }}>
                <Building2 size={32} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "20px", color: C.ink, marginBottom: "8px" }}>
                No Community Yet
              </h3>
              <p style={{ fontWeight: 400, fontSize: "15px", color: C.coolGrey, lineHeight: 1.6, maxWidth: "340px", margin: "0 auto" }}>
                You haven't joined any community yet. Contact an organization to get started!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const { organization, subscriptions } = communityData;
  const organizations = [
    {
      organization,
      subscriptions,
      active_subscription_count: subscriptions.filter((s) => s.status === "active").length,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "32px 24px 96px" }}>
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
          <h1 style={{ fontWeight: 800, fontSize: "32px", color: C.ink, letterSpacing: "-0.4px" }}>
            My Community
          </h1>
          <p style={{ fontWeight: 400, fontSize: "15px", color: C.coolGrey, marginTop: "4px" }}>
            Organizations you're subscribed to
          </p>
        </motion.div>

        {/* Organizations grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {organizations.map((item, i) => (
            <OrgCard key={item.organization.id} item={item} index={i + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}