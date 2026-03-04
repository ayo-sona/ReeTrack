"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Clock,
  CheckCircle,
  Calendar,
  QrCode,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MemberQRCodeModal from "../memberQRCodeModal";
import { addHours } from "date-fns";
import { useMemberStore } from "@/store/memberStore";
import { useParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useMemberById } from "@/hooks/useMembers";
import { Member } from "@/types/memberTypes/member";

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

interface CheckInCode {
  id: string;
  checkInCode: string;
  createdAt: string;
  expiresAt: string;
}

interface CheckInRecord {
  id: string;
  date: string;
  time: string;
  location: string;
  status: "approved" | "pending" | "denied";
}

export default function CheckInPage() {
  const params = useParams();
  const [checkInCode, setCheckInCode] = useState<CheckInCode | null>(null);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getMember } = useMemberStore();
  const orgId = params.id as string | null;
  const memberData = getMember(orgId as string);
  const [memberDetails, setMemberDetails] = useState<Member | undefined>(
    undefined,
  );

  const {
    data: member,
    isLoading,
    error,
  } = useMemberById(memberData?.id || null, orgId || null);

  // Member is gotten from the API call
  console.log("member", memberDetails);

  // MemberData is gotten from zustand
  console.log("memberData", memberData);

  // Placeholder recent check-in records (replace with real data from API)
  const recentCheckIns: CheckInRecord[] = [];

  const filteredCheckIns = useMemo(() => {
    if (!searchQuery.trim()) return recentCheckIns;
    const q = searchQuery.toLowerCase();
    return recentCheckIns.filter(
      (r) =>
        r.date.toLowerCase().includes(q) ||
        r.time.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q),
    );
  }, [searchQuery, recentCheckIns]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setMemberDetails(member);
  }, [member]);

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

  if (!isHydrated || !memberData || isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.snow,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Nunito, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: `3px solid ${C.border}`,
              borderTopColor: C.teal,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ fontWeight: 600, fontSize: "16px", color: C.ink }}>
            {!isHydrated ? "Loading..." : "Loading member data..."}
          </p>
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
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        .checkin-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 24px;
          align-items: start;
        }

        .code-display {
          padding: 56px 48px;
        }

        .code-number {
          font-size: 72px;
          letter-spacing: 8px;
        }

        .action-buttons {
          flex-direction: row;
        }

        .empty-state {
          padding: 80px 48px;
        }

        .search-input {
          width: 100%;
          border: 1px solid ${C.border};
          border-radius: 10px;
          padding: 10px 40px 10px 38px;
          font-size: 14px;
          font-family: Nunito, sans-serif;
          color: ${C.ink};
          background: ${C.snow};
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input::placeholder { color: ${C.coolGrey}; }
        .search-input:focus {
          border-color: ${C.teal};
          box-shadow: 0 0 0 3px rgba(13,148,136,0.12);
          background: ${C.white};
        }

        @media (max-width: 900px) {
          .checkin-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .code-display {
            padding: 40px 24px;
          }
          .code-number {
            font-size: 52px;
            letter-spacing: 5px;
          }
          .action-buttons {
            flex-direction: column;
            align-items: stretch;
          }
          .action-buttons > * {
            width: 100%;
            justify-content: center;
          }
          .empty-state {
            padding: 48px 24px;
          }
        }

        @media (max-width: 400px) {
          .code-number {
            font-size: 40px;
            letter-spacing: 4px;
          }
        }
      `}</style>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "32px 24px 96px",
        }}
      >
        {/* Page header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          style={{ marginBottom: "40px" }}
        >
          <h1
            style={{
              fontWeight: 800,
              fontSize: "clamp(24px, 4vw, 32px)",
              color: C.ink,
              letterSpacing: "-0.4px",
              marginBottom: "4px",
            }}
          >
            Check In
          </h1>
          <p style={{ fontWeight: 400, fontSize: "15px", color: C.coolGrey }}>
            Generate your check-in code or show your QR
          </p>
        </motion.div>

        {/* Main content grid */}
        <div className="checkin-grid">
          {/* LEFT COLUMN - Code Display */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            {checkInCode ? (
              /* Active code card */
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  background: C.teal,
                  borderRadius: "24px",
                }}
                className="code-display"
              >
                {/* Decorative circles */}
                <div
                  style={{
                    position: "absolute",
                    top: "-80px",
                    right: "-80px",
                    width: "280px",
                    height: "280px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "-60px",
                    left: "20%",
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.04)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    backgroundSize: "200% auto",
                    animation: "pulse-slow 3s ease-in-out infinite",
                  }}
                />

                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    textAlign: "center",
                  }}
                >
                  {/* Timer pill */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 20px",
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      marginBottom: "32px",
                    }}
                  >
                    <Clock size={16} style={{ color: C.white }} />
                    <span
                      style={{
                        fontFamily: "Nunito, sans-serif",
                        fontWeight: 700,
                        fontSize: "14px",
                        color: C.white,
                      }}
                    >
                      Expires in {timeLeft}
                    </span>
                  </div>

                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.7)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "16px",
                    }}
                  >
                    Your Check-In Code
                  </p>

                  {/* The code */}
                  <div
                    style={{
                      display: "inline-block",
                      padding: "clamp(20px,4vw,32px) clamp(24px,6vw,64px)",
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(12px)",
                      borderRadius: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      marginBottom: "24px",
                    }}
                  >
                    <div
                      className="code-number"
                      style={{
                        fontFamily: "monospace",
                        fontWeight: 700,
                        color: C.white,
                        lineHeight: 1,
                      }}
                    >
                      {checkInCode.checkInCode}
                    </div>
                  </div>

                  <p
                    style={{
                      fontWeight: 400,
                      fontSize: "15px",
                      color: "rgba(255,255,255,0.8)",
                      maxWidth: "400px",
                      margin: "0 auto",
                    }}
                  >
                    Show this code to staff at the entrance
                  </p>

                  <div
                    className="action-buttons"
                    style={{
                      display: "flex",
                      gap: "12px",
                      justifyContent: "center",
                      marginTop: "40px",
                    }}
                  >
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
              /* Empty state */
              <div
                className="empty-state"
                style={{
                  background: C.white,
                  borderRadius: "24px",
                  border: `2px dashed ${C.border}`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "96px",
                    height: "96px",
                    borderRadius: "24px",
                    background: C.snow,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    color: C.coolGrey,
                  }}
                >
                  <QrCode size={44} />
                </div>

                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: "22px",
                    color: C.ink,
                    marginBottom: "12px",
                  }}
                >
                  Ready to Check In?
                </h2>
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "15px",
                    color: C.coolGrey,
                    lineHeight: 1.6,
                    marginBottom: "32px",
                    maxWidth: "380px",
                    margin: "0 auto 32px",
                  }}
                >
                  Generate a secure check-in code or show your QR to get started
                </p>

                <div
                  className="action-buttons"
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        inset: "-4px",
                        borderRadius: "12px",
                        background: `linear-gradient(to right, rgba(240,101,67,0.4), rgba(240,101,67,0.2), rgba(240,101,67,0.4))`,
                        filter: "blur(14px)",
                        opacity: 0.7,
                        zIndex: 0,
                      }}
                    />
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
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* How It Works */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              style={{
                background: C.white,
                borderRadius: "16px",
                border: `1px solid ${C.border}`,
                padding: "28px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                <CheckCircle size={18} style={{ color: C.teal }} />
                <h3
                  style={{ fontWeight: 700, fontSize: "16px", color: C.teal }}
                >
                  How It Works
                </h3>
              </div>
              <ol
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  paddingLeft: "20px",
                  margin: 0,
                }}
              >
                {[
                  "Generate or show your code",
                  "Present to staff at entrance",
                  "Staff verifies and logs entry",
                ].map((step, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontWeight: 400,
                      fontSize: "14px",
                      color: C.ink,
                      lineHeight: 1.6,
                      paddingLeft: "8px",
                    }}
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </motion.div>

            {/* Code details (if active) */}
            {checkInCode && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
                style={{
                  background: C.white,
                  borderRadius: "16px",
                  border: `1px solid ${C.border}`,
                  padding: "24px",
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "13px",
                    color: C.coolGrey,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    marginBottom: "16px",
                  }}
                >
                  Code Details
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {[
                    {
                      label: "Generated",
                      value: new Date(checkInCode.createdAt).toLocaleString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          month: "short",
                          day: "numeric",
                        },
                      ),
                    },
                    {
                      label: "Valid Until",
                      value: new Date(checkInCode.expiresAt).toLocaleString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          month: "short",
                          day: "numeric",
                        },
                      ),
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <p
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: C.coolGrey,
                          marginBottom: "4px",
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        style={{
                          fontWeight: 600,
                          fontSize: "14px",
                          color: C.ink,
                        }}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Check-ins with search */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              style={{
                background: C.white,
                borderRadius: "16px",
                border: `1px solid ${C.border}`,
                padding: "28px",
              }}
            >
              {/* Section header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                <Calendar size={18} style={{ color: C.teal }} />
                <h3
                  style={{ fontWeight: 700, fontSize: "16px", color: C.teal }}
                >
                  Recent Check-ins
                </h3>
              </div>

              {/* Search bar */}
              <div style={{ position: "relative", marginBottom: "16px" }}>
                <Search
                  size={15}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: C.coolGrey,
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by date, location, status…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: C.coolGrey,
                      display: "flex",
                      alignItems: "center",
                      padding: "2px",
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Results */}
              {filteredCheckIns.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {filteredCheckIns.map((record) => (
                    <div
                      key={record.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        background: C.snow,
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: "13px",
                            color: C.ink,
                          }}
                        >
                          {record.date}
                        </p>
                        <p
                          style={{
                            fontWeight: 400,
                            fontSize: "12px",
                            color: C.coolGrey,
                          }}
                        >
                          {record.time} · {record.location}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: "999px",
                          background:
                            record.status === "approved"
                              ? "rgba(13,148,136,0.1)"
                              : record.status === "denied"
                                ? "rgba(240,101,67,0.1)"
                                : "rgba(156,163,175,0.15)",
                          color:
                            record.status === "approved"
                              ? C.teal
                              : record.status === "denied"
                                ? C.coral
                                : C.coolGrey,
                          textTransform: "capitalize",
                        }}
                      >
                        {record.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "12px",
                      background: C.snow,
                      border: `1px solid ${C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                      color: C.coolGrey,
                    }}
                  >
                    {searchQuery ? (
                      <Search size={22} />
                    ) : (
                      <Calendar size={24} />
                    )}
                  </div>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: C.ink,
                      marginBottom: "4px",
                    }}
                  >
                    {searchQuery ? "No results found" : "Coming Soon"}
                  </p>
                  <p
                    style={{
                      fontWeight: 400,
                      fontSize: "13px",
                      color: C.coolGrey,
                      lineHeight: 1.5,
                    }}
                  >
                    {searchQuery
                      ? `No check-ins match "${searchQuery}"`
                      : "Your history will appear here"}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

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
