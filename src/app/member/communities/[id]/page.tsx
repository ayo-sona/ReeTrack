"use client";

import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Check,
  Globe,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useAvailablePlans } from "@/hooks/memberHook/useCommunity";
import { memberApi } from "@/lib/memberAPI/memberAPI";
import { useQuery } from "@tanstack/react-query";
import { addDays, addWeeks, addMonths, addYears, format } from "date-fns";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const C = {
  teal:     "#0D9488",
  coral:    "#F06543",
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
      border: `1px solid ${C.border}`, height: "400px",
      animation: "pulse 1.5s ease-in-out infinite",
    }} />
  );
}

interface PlanCardProps {
  plan: any;
  isSubscribed: boolean;
  index: number;
}

function PlanCard({ plan, isSubscribed, index }: PlanCardProps) {
  const [hovered, setHovered] = useState(false);

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "Free";
    return `₦${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getNextBillingDate = (interval: string | null) => {
    if (!interval) return null;
    const today = new Date();
    switch (interval.toLowerCase()) {
      case "daily": return addDays(today, 1);
      case "weekly": return addWeeks(today, 1);
      case "monthly": return addMonths(today, 1);
      case "quarterly": return addMonths(today, 3);
      case "yearly": return addYears(today, 1);
      default: return null;
    }
  };

  const nextBillingDate = getNextBillingDate(plan.interval);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={index}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        background: C.white,
        borderRadius: "16px",
        border: isSubscribed ? `2px solid ${C.teal}` : `1px solid ${hovered ? C.teal : C.border}`,
        padding: "28px",
        boxShadow: isSubscribed 
          ? "0 12px 32px rgba(13,148,136,0.15)" 
          : hovered ? "0 8px 24px rgba(13,148,136,0.1)" : "0 1px 4px rgba(0,0,0,0.05)",
        transition: "all 300ms",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Subscribed badge */}
      {isSubscribed && (
        <div style={{ marginBottom: "16px" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            padding: "6px 12px", borderRadius: "999px",
            background: "rgba(13,148,136,0.1)", color: C.teal,
            fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "12px",
          }}>
            <Check size={12} />
            Currently Subscribed
          </span>
        </div>
      )}

      {/* Plan name */}
      <h3 style={{ fontWeight: 700, fontSize: "18px", color: C.ink, marginBottom: "8px" }}>
        {plan.name}
      </h3>

      {/* Description */}
      <p style={{ fontWeight: 400, fontSize: "13px", color: C.coolGrey, marginBottom: "16px", lineHeight: 1.6 }}>
        {plan.description}
      </p>

      {/* Price */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
          <span style={{ fontWeight: 800, fontSize: "32px", color: C.teal, letterSpacing: "-0.5px" }}>
            {formatCurrency(plan.price)}
          </span>
          {plan.interval && (
            <span style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey }}>
              /{plan.interval}
            </span>
          )}
        </div>
      </div>

      {/* Billing info */}
      {nextBillingDate && (
        <div style={{
          marginBottom: "20px", padding: "14px", borderRadius: "8px",
          background: C.snow, border: `1px solid ${C.border}`,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Calendar size={14} style={{ color: C.coolGrey }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 400, fontSize: "11px", color: C.coolGrey, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Next billing date
                </p>
                <p style={{ fontWeight: 600, fontSize: "13px", color: C.ink }}>
                  {format(nextBillingDate, "MMMM dd, yyyy")}
                </p>
              </div>
            </div>
            <div style={{ paddingTop: "10px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={14} style={{ color: C.coolGrey }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 400, fontSize: "11px", color: C.coolGrey, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Billing time
                </p>
                <p style={{ fontWeight: 600, fontSize: "13px", color: C.ink }}>
                  {format(nextBillingDate, "hh:mm a")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      {plan.features && plan.features.length > 0 && (
        <div style={{ marginBottom: "24px", flex: 1 }}>
          <p style={{ fontWeight: 600, fontSize: "11px", color: C.coolGrey, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Features
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {plan.features.map((feature: string, idx: number) => (
              <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <Check size={14} style={{ color: C.teal, flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontWeight: 400, fontSize: "13px", color: C.ink, lineHeight: 1.5 }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA button */}
      {isSubscribed ? (
        <Button variant="secondary" size="lg" className="w-full" asChild>
          <Link href="/member/subscriptions">Manage Subscription</Link>
        </Button>
      ) : (
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute", inset: "-4px", borderRadius: "12px",
            background: `linear-gradient(to right, rgba(240,101,67,0.4), rgba(240,101,67,0.2), rgba(240,101,67,0.4))`,
            filter: "blur(14px)", opacity: 0.7, zIndex: 0,
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <Button variant="default" size="lg" className="w-full" asChild>
              <Link href={`/member/checkout/${plan.id}`}>Subscribe Now</Link>
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function OrganizationPlansPage() {
  const params = useParams();
  const organizationId = params.id as string;

  const { data: allPlans, isLoading: plansLoading } = useAvailablePlans();

  const { data: subscriptionsData } = useQuery({
    queryKey: ["member", "subscriptions"],
    queryFn: async () => {
      const response = await memberApi.getMySubscription().catch(() => ({ data: [] }));
      return Array.isArray(response.data) ? response.data : response.data ? [response.data] : [];
    },
  });

  // Loading state
  if (plansLoading) {
    return (
      <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "32px 24px" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        `}</style>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ height: "32px", width: "200px", background: C.white, borderRadius: "8px", border: `1px solid ${C.border}`, animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: "240px", background: C.white, borderRadius: "16px", border: `1px solid ${C.border}`, animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  const organizationPlans = allPlans?.filter(
    (plan) => plan.organization_id === organizationId && plan.is_active
  ) || [];

  // Empty state
  if (organizationPlans.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "32px 24px" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');`}</style>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ background: C.white, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "64px 32px", textAlign: "center" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "18px", background: C.snow, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: C.coolGrey }}>
              <Building2 size={32} />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: "20px", color: C.ink, marginBottom: "8px" }}>No Plans Available</h3>
            <p style={{ fontWeight: 400, fontSize: "15px", color: C.coolGrey, marginBottom: "24px", lineHeight: 1.6 }}>
              This organization doesn&apos;t have any active plans.
            </p>
            <Button variant="secondary" asChild>
              <Link href="/member/communities">Back to My Community</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const organization = organizationPlans[0].organization;
  const subscriptions = subscriptionsData || [];

  return (
    <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "32px 24px 96px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Back button */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} style={{ marginBottom: "24px" }}>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/member/communities">
              <ArrowLeft size={16} />
              Back to My Community
            </Link>
          </Button>
        </motion.div>

        {/* Organization header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
          style={{ background: C.white, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "32px", marginBottom: "32px" }}
        >
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "16px", background: C.teal,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.white, fontWeight: 800, fontSize: "28px", flexShrink: 0,
            }}>
              {organization.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: "0" }}>
              <h1 style={{ fontWeight: 800, fontSize: "28px", color: C.ink, marginBottom: "8px", letterSpacing: "-0.4px" }}>
                {organization.name}
              </h1>
              <p style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey, marginBottom: "16px", lineHeight: 1.6 }}>
                {organization.description}
              </p>
              <div style={{ display: "grid", gap: "10px", fontSize: "13px" }} className="md:grid-cols-2">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: C.coolGrey }}>
                  <MapPin size={14} style={{ flexShrink: 0 }} />
                  <span>{organization.address}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: C.coolGrey }}>
                  <Mail size={14} style={{ flexShrink: 0 }} />
                  <span>{organization.email}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: C.coolGrey }}>
                  <Phone size={14} style={{ flexShrink: 0 }} />
                  <span>{organization.phone}</span>
                </div>
                {organization.website && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Globe size={14} style={{ color: C.coolGrey, flexShrink: 0 }} />
                    <a
                      href={`https://${organization.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontWeight: 600, color: C.teal, textDecoration: "none" }}
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} style={{ marginBottom: "24px" }}>
          <h2 style={{ fontWeight: 700, fontSize: "20px", color: C.ink }}>
            Available Plans ({organizationPlans.length})
          </h2>
        </motion.div>

        {/* Plans grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
          {organizationPlans.map((plan, i) => {
            const isSubscribed = subscriptions.some(
              (sub: any) => sub.plan_id === plan.id && sub.status === "active"
            );
            return (
              <PlanCard key={plan.id} plan={plan} isSubscribed={isSubscribed} index={i + 3} />
            );
          })}
        </div>
      </div>
    </div>
  );
}