"use client";
import ParallaxBackground from "../ui/parallaxBackground";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const HeroSection = () => {
  const [tab, setTab] = useState<"partner" | "member">("partner");

  return (
    <section className="relative min-h-screen bg-[#F9FAFB] flex items-center justify-center overflow-hidden">
      <ParallaxBackground
        imageSrc="/connect_background.png"
        opacity={0.03}
        parallaxStrength={5}
        smoothing={0.08}
      />

      {/* Subtle decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(13,148,136,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center"
        style={{ paddingTop: "96px" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Tab Switcher */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "9999px",
              padding: "4px",
              marginBottom: "48px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            {(["partner", "member"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  position: "relative",
                  padding: "8px 20px",
                  fontSize: "14px",
                  fontWeight: 500,
                  borderRadius: "9999px",
                  border: "none",
                  cursor: "pointer",
                  background: tab === t ? "#0D9488" : "transparent",
                  color: tab === t ? "#fff" : "#6B7280",
                  transition: "all 0.25s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {t === "partner" ? "For Organizations" : "For Members"}
              </button>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {tab === "partner" ? (
              <motion.div
                key="partner"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <h1
                  style={{
                    fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
                    fontWeight: 800,
                    color: "#1F2937",
                    lineHeight: 1.1,
                    marginBottom: "24px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Build a community
                  <br />
                  your members never want
                  <br />
                  to <span style={{ color: "#0D9488" }}>leave.</span>
                </h1>

                <p
                  style={{
                    fontSize: "clamp(1rem, 2vw, 1.25rem)",
                    color: "rgba(31,41,55,0.65)",
                    maxWidth: "600px",
                    margin: "0 auto 40px",
                    lineHeight: 1.7,
                    fontWeight: 400,
                  }}
                >
                  When members feel like they belong, they stay. Reetrack keeps
                  your community engaged, rewarded, and coming back every time.
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "12px",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Button asChild size="lg" className="group">
                    <Link
                      href="/auth/register"
                      className="flex items-center gap-2"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/about">See How It Works</Link>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="member"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <h1
                  style={{
                    fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
                    fontWeight: 800,
                    color: "#1F2937",
                    lineHeight: 1.1,
                    marginBottom: "24px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Get rewarded for 
                  <br />
                  <span style={{ color: "#0D9488" }}>showing up.</span>
                  <br />
                </h1>

                <p
                  style={{
                    fontSize: "clamp(1rem, 2vw, 1.25rem)",
                    color: "rgba(31,41,55,0.65)",
                    maxWidth: "600px",
                    margin: "0 auto 48px",
                    lineHeight: 1.7,
                    fontWeight: 400,
                  }}
                >
                  Every check-in builds your streak. Every streak earns you
                  rewards. Reetrack makes showing up worth it, not just for
                  your goals, but for recognition within your community.
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "12px",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Button asChild size="lg" className="group">
                    <Link
                      href="/auth/register"
                      className="flex items-center gap-2"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;