"use client";

import { useState } from "react";
import { Users, Gift, Share2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

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
    transition: { duration: 0.5, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] },
  }),
};

function StepCard({ icon, title, description, step, index }: { icon: React.ReactNode; title: string; description: string; step: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible" custom={index}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        position: "relative", background: C.white, borderRadius: "12px", padding: "28px 24px",
        border: `1px solid ${hovered ? C.teal : C.border}`,
        boxShadow: hovered ? "0 8px 24px rgba(13,148,136,0.1)" : "0 1px 4px rgba(0,0,0,0.05)",
        transition: "border-color 300ms, box-shadow 300ms", overflow: "hidden",
      }}
    >
      <span style={{
        position: "absolute", top: "14px", right: "18px",
        fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "56px", lineHeight: 1, userSelect: "none",
        color: hovered ? "rgba(13,148,136,0.07)" : "rgba(31,41,55,0.04)", transition: "color 300ms",
      }}>
        {step}
      </span>
      <div style={{ color: hovered ? C.teal : C.coolGrey, marginBottom: "14px", transition: "color 300ms" }}>
        {icon}
      </div>
      <p style={{ fontWeight: 700, fontSize: "15px", color: C.ink, marginBottom: "6px" }}>{title}</p>
      <p style={{ fontWeight: 400, fontSize: "13px", color: C.coolGrey, lineHeight: 1.6 }}>{description}</p>
    </motion.div>
  );
}

export default function ReferralsPage() {
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const handleSubmit = () => {
    if (!email.includes("@")) return;
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "32px 24px 96px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        input::placeholder { color: #9CA3AF; }
      `}</style>

      <div style={{ maxWidth: "860px", margin: "0 auto" }}>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} style={{ marginBottom: "32px" }}>
          <h1 style={{ fontWeight: 800, fontSize: "32px", color: C.ink, letterSpacing: "-0.4px" }}>Referrals</h1>
          <p style={{ fontWeight: 400, fontSize: "15px", color: C.coolGrey, marginTop: "4px" }}>Invite friends and earn rewards</p>
        </motion.div>

        {/* Hero */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} style={{ marginBottom: "20px" }}>
          <div style={{ position: "relative", overflow: "hidden", background: C.teal, borderRadius: "20px", padding: "56px 48px" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)", backgroundSize: "200% auto", animation: "shimmer 3s linear infinite" }} />
            <div style={{ position: "absolute", top: "-80px", right: "-60px", width: "260px", height: "260px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ position: "absolute", bottom: "-50px", left: "20%", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
            <div style={{ position: "relative", zIndex: 1, maxWidth: "520px" }}>
              <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: "999px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", fontWeight: 600, fontSize: "11px", color: "rgba(255,255,255,0.85)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "20px" }}>
                Coming Soon
              </div>
              <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 4vw, 38px)", color: C.white, letterSpacing: "-0.5px", lineHeight: 1.2, marginBottom: "14px" }}>
                Share ReeTrack.<br />Get rewarded.
              </h2>
              <p style={{ fontWeight: 400, fontSize: "16px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: "400px" }}>
                We&apos;re building a referral program that rewards you every time a friend joins through your link — free months, cash rewards, and more.
              </p>
            </div>
          </div>
        </motion.div>

        {/* How it works label */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} style={{ marginBottom: "14px" }}>
          <p style={{ fontWeight: 700, fontSize: "12px", color: C.coolGrey, textTransform: "uppercase", letterSpacing: "1px" }}>
            How It&apos;ll Work
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "24px" }}>
          {[
            { icon: <Share2 size={20} />, title: "Get your link",  description: "A unique referral link tied to your account.",         step: "1" },
            { icon: <Users size={20} />, title: "Invite friends", description: "Share it with anyone — friends, family, your network.", step: "2" },
            { icon: <Gift size={20} />,  title: "Earn rewards",   description: "When they subscribe, you both get rewarded.",           step: "3" },
          ].map((s, i) => <StepCard key={s.step} {...s} index={i + 3} />)}
        </div>

        {/* Waitlist */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
          <div style={{ background: C.white, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "36px 40px" }}>
            <h3 style={{ fontWeight: 700, fontSize: "18px", color: C.teal, marginBottom: "6px" }}>Be the first to know</h3>
            <p style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey, lineHeight: 1.6, marginBottom: "24px", maxWidth: "440px" }}>
              Enter your email and we&apos;ll notify you the moment the referral program launches.
            </p>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }}
                  style={{ display: "flex", gap: "10px", maxWidth: "460px" }}
                >
                  <input
                    type="email" placeholder="your@email.com" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    style={{
                      flex: 1, padding: "12px 16px", borderRadius: "8px",
                      border: `1px solid ${inputFocused ? C.teal : C.border}`,
                      boxShadow: inputFocused ? "0 0 0 3px rgba(13,148,136,0.12)" : "none",
                      fontFamily: "Nunito, sans-serif", fontWeight: 400, fontSize: "14px",
                      color: C.ink, background: C.white, outline: "none",
                      transition: "border-color 300ms, box-shadow 300ms",
                    }}
                  />
                  {/* Coral CTA with glow */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{
                      position: "absolute", inset: "-4px", borderRadius: "12px",
                      background: `linear-gradient(to right, rgba(240,101,67,0.4), rgba(240,101,67,0.2), rgba(240,101,67,0.4))`,
                      filter: "blur(12px)", opacity: 0.65, zIndex: 0,
                    }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <Button variant="default" onClick={handleSubmit}>
                        Notify Me <ArrowRight size={14} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="success"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "12px 20px", borderRadius: "8px", background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.2)" }}
                >
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: C.teal, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p style={{ fontWeight: 600, fontSize: "14px", color: C.teal }}>You&apos;re on the list — we&apos;ll be in touch soon.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}