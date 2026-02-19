"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, Calendar, QrCode, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import MemberQRCodeModal from "../memberQRCodeModal";
import { addHours } from "date-fns";
import { useMemberStore } from "@/store/memberStore";
import { useParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { motion } from "framer-motion";

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

interface CheckInCode {
  id: string;
  checkInCode: string;
  createdAt: string;
  expiresAt: string;
}

export default function CheckInPage() {
  const [checkInCode, setCheckInCode] = useState<CheckInCode | null>(null);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { getMember } = useMemberStore();
  const params = useParams();

  const orgId = params.id;
  const memberData = getMember(orgId as string);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!checkInCode) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(checkInCode.expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [checkInCode]);

  const handleGenerateCode = async () => {
    const generateCode = async (): Promise<CheckInCode> => {
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      const now = new Date();
      const expiry = addHours(now, 1);

      try {
        setGeneratingCode(true);
        const response = await apiClient.post(`members/check-in/`, {
          memberId: memberData.id,
          checkInCode: randomCode,
          expiresAt: expiry.toISOString(),
        });
        if (response.data.statusCode === 201) {
          toast.success("Check-in code generated successfully");
        }
      } catch (error) {
        console.error("Failed to generate check-in code:", error);
        toast.error("Failed to generate code");
      } finally {
        setGeneratingCode(false);
      }

      return {
        id: `checkin-${Date.now()}`,
        checkInCode: randomCode,
        createdAt: now.toISOString(),
        expiresAt: expiry.toISOString(),
      };
    };

    const codeData = await generateCode();
    setCheckInCode(codeData);
  };

  if (!isHydrated || !memberData) {
    return (
      <div style={{ minHeight: "100vh", background: C.snow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Nunito, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", border: `3px solid ${C.border}`, borderTopColor: C.teal, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ fontWeight: 600, fontSize: "16px", color: C.ink }}>
            {!isHydrated ? "Loading..." : "Loading member data..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px 96px" }}>

        {/* Page header - top left */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          style={{ marginBottom: "40px" }}
        >
          <h1 style={{ fontWeight: 800, fontSize: "32px", color: C.ink, letterSpacing: "-0.4px", marginBottom: "4px" }}>
            Check In
          </h1>
          <p style={{ fontWeight: 400, fontSize: "15px", color: C.coolGrey }}>
            Generate your check-in code or show your QR
          </p>
        </motion.div>

        {/* Main content - 2 column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px", alignItems: "start" }}>

          {/* LEFT COLUMN - Code Display */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
          >
            {checkInCode ? (
              /* Active code card */
              <div style={{
                position: "relative", overflow: "hidden",
                background: C.teal, borderRadius: "24px", padding: "56px 48px",
              }}>
                {/* Decorative elements */}
                <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                <div style={{ position: "absolute", bottom: "-60px", left: "20%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  backgroundSize: "200% auto",
                  animation: "pulse-slow 3s ease-in-out infinite",
                }} />

                <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                  {/* Timer */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "10px 20px", borderRadius: "999px",
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    marginBottom: "32px",
                  }}>
                    <Clock size={16} style={{ color: C.white }} />
                    <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "14px", color: C.white }}>
                      Expires in {timeLeft}
                    </span>
                  </div>

                  <p style={{ fontWeight: 600, fontSize: "14px", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>
                    Your Check-In Code
                  </p>

                  {/* The code */}
                  <div style={{
                    display: "inline-block",
                    padding: "32px 64px",
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "16px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    marginBottom: "24px",
                  }}>
                    <div style={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      fontSize: "72px",
                      color: C.white,
                      letterSpacing: "8px",
                      lineHeight: 1,
                    }}>
                      {checkInCode.checkInCode}
                    </div>
                  </div>

                  <p style={{ fontWeight: 400, fontSize: "15px", color: "rgba(255,255,255,0.8)", maxWidth: "400px", margin: "0 auto" }}>
                    Show this code to staff at the entrance
                  </p>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "40px" }}>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setCheckInCode(null);
                        handleGenerateCode();
                      }}
                      disabled={generatingCode}
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                    >
                      <RefreshCw size={16} />
                      {generatingCode ? "Generating..." : "New Code"}
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsOpen(true)}
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                    >
                      <QrCode size={16} />
                      Show QR
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state - Generate code */
              <div style={{
                background: C.white, borderRadius: "24px",
                border: `2px dashed ${C.border}`,
                padding: "80px 48px",
                textAlign: "center",
              }}>
                <div style={{
                  width: "96px", height: "96px", borderRadius: "24px",
                  background: C.snow, border: `1px solid ${C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 24px", color: C.coolGrey,
                }}>
                  <QrCode size={44} />
                </div>

                <h2 style={{ fontWeight: 700, fontSize: "22px", color: C.ink, marginBottom: "12px" }}>
                  Ready to Check In?
                </h2>
                <p style={{ fontWeight: 400, fontSize: "15px", color: C.coolGrey, lineHeight: 1.6, marginBottom: "32px", maxWidth: "380px", margin: "0 auto 32px" }}>
                  Generate a secure check-in code or show your QR to get started
                </p>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  {/* Coral CTA with glow */}
                  <div style={{ position: "relative" }}>
                    <div style={{
                      position: "absolute", inset: "-4px", borderRadius: "12px",
                      background: `linear-gradient(to right, rgba(240,101,67,0.4), rgba(240,101,67,0.2), rgba(240,101,67,0.4))`,
                      filter: "blur(14px)", opacity: 0.7, zIndex: 0,
                    }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <Button
                        variant="default"
                        size="lg"
                        onClick={handleGenerateCode}
                        disabled={generatingCode}
                      >
                        {generatingCode ? "Generating..." : "Generate Code"}
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setIsOpen(true)}
                  >
                    <QrCode size={16} />
                    Show QR
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          {/* RIGHT COLUMN - Info & History */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Instructions */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={2}
              style={{ background: C.white, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "28px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <CheckCircle size={18} style={{ color: C.teal }} />
                <h3 style={{ fontWeight: 700, fontSize: "16px", color: C.teal }}>
                  How It Works
                </h3>
              </div>
              <ol style={{ display: "flex", flexDirection: "column", gap: "12px", paddingLeft: "20px", margin: 0 }}>
                {[
                  "Generate or show your code",
                  "Present to staff at entrance",
                  "Staff verifies and logs entry",
                ].map((step, idx) => (
                  <li key={idx} style={{
                    fontWeight: 400, fontSize: "14px", color: C.ink, lineHeight: 1.6,
                    paddingLeft: "8px",
                  }}>
                    {step}
                  </li>
                ))}
              </ol>
            </motion.div>

            {/* Code details (if active) */}
            {checkInCode && (
              <motion.div
                variants={fadeUp} initial="hidden" animate="visible" custom={3}
                style={{ background: C.white, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "24px" }}
              >
                <p style={{ fontWeight: 700, fontSize: "13px", color: C.coolGrey, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "16px" }}>
                  Code Details
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { label: "Generated", value: new Date(checkInCode.createdAt).toLocaleString("en-US", { 
                      hour: "2-digit", minute: "2-digit", month: "short", day: "numeric"
                    })},
                    { label: "Valid Until", value: new Date(checkInCode.expiresAt).toLocaleString("en-US", { 
                      hour: "2-digit", minute: "2-digit", month: "short", day: "numeric"
                    })},
                  ].map((item) => (
                    <div key={item.label}>
                      <p style={{ fontWeight: 400, fontSize: "12px", color: C.coolGrey, marginBottom: "4px" }}>
                        {item.label}
                      </p>
                      <p style={{ fontWeight: 600, fontSize: "14px", color: C.ink }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent check-ins */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={4}
              style={{ background: C.white, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "28px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <Calendar size={18} style={{ color: C.teal }} />
                <h3 style={{ fontWeight: 700, fontSize: "16px", color: C.teal }}>
                  Recent Check-ins
                </h3>
              </div>
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "12px",
                  background: C.snow, border: `1px solid ${C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 12px", color: C.coolGrey,
                }}>
                  <Calendar size={24} />
                </div>
                <p style={{ fontWeight: 600, fontSize: "14px", color: C.ink, marginBottom: "4px" }}>
                  Coming Soon
                </p>
                <p style={{ fontWeight: 400, fontSize: "13px", color: C.coolGrey, lineHeight: 1.5 }}>
                  Your history will appear here
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {isOpen && (
        <MemberQRCodeModal
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          memberId={memberData?.id}
        />
      )}
    </div>
  );
}