"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  X,
  Check,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import {
  useSubscription,
  useCancelSubscription,
  useReactivateSubscription,
} from "@/hooks/memberHook/useMember";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

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

const isExpiringSoon = (expiresAt: string) => {
  const days = Math.ceil(
    (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  return days <= 7 && days > 0;
};

const STATUS_CONFIG: Record<string, { label: string }> = {
  active: { label: "Active" },
  expired: { label: "Expired" },
  cancelled: { label: "Cancelled" },
  pending: { label: "Pending" },
};

export default function SubscriptionDetailsPage() {
  const params = useParams();
  const subscriptionId = params.id as string;
  const { data: subscription, isLoading } = useSubscription(subscriptionId);
  const cancelSub = useCancelSubscription();
  const reactivateSub = useReactivateSubscription();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancel = async () => {
    try {
      const data = await cancelSub.mutateAsync(subscriptionId);
      if (data.statusCode === 200) {
        toast.success("Subscription cancelled successfully");
        window.location.reload();
      }
    } catch {
      toast.error("Failed to cancel subscription");
    } finally {
      setShowCancelConfirm(false);
    }
  };

  const handleRenew = async () => {
    try {
      const data = await reactivateSub.mutateAsync(subscriptionId);
      if (data.statusCode === 201) {
        toast.success("Subscription reactivated successfully");
        window.location.reload();
      }
    } catch {
      toast.error("Failed to reactivate subscription");
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.snow,
          padding: "32px 24px",
          fontFamily: "Nunito, sans-serif",
        }}
      >
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {[80, 300, 200].map((h, i) => (
            <div
              key={i}
              style={{
                height: `${h}px`,
                borderRadius: "16px",
                background: C.white,
                border: `1px solid ${C.border}`,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!subscription) {
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
          <p style={{ color: C.coolGrey, marginBottom: "16px" }}>
            Subscription not found
          </p>
          <Link href="/member/subscriptions">
            <Button variant="secondary">Back to Subscriptions</Button>
          </Link>
        </div>
      </div>
    );
  }

  const status = subscription.status;
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.cancelled;
  const expiring = status === "active" && isExpiringSoon(subscription.expires_at);

  // API returns features as a plain string array e.g. ["Cold water"]
  const rawFeatures = subscription.plan.features;
  const features: string[] = Array.isArray(rawFeatures)
    ? rawFeatures
    : (rawFeatures as any)?.features ?? [];

  const canRenew = status === "cancelled";
  const canCancel = status === "active" || status === "pending";
  const hasExpired = status !== "pending" && subscription.expires_at < new Date().toISOString();

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
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        {/* Back */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          style={{ marginBottom: "24px" }}
        >
          <Link href="/member/subscriptions" style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} /> Back to Subscriptions
            </Button>
          </Link>
        </motion.div>

        {/* Hero card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          style={{ marginBottom: "20px" }}
        >
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              background: C.teal,
              borderRadius: "20px",
              padding: "40px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)",
                borderRadius: "20px",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "-60px",
                right: "-60px",
                width: "240px",
                height: "240px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-40px",
                left: "30%",
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                zIndex: 0,
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
                animation: "shimmer 3s linear infinite",
                zIndex: 1,
              }}
            />

            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "28px",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(8px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "26px",
                      color: C.white,
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    {subscription.plan.name.charAt(0)}
                  </div>
                  <div>
                    <h1
                      style={{
                        fontWeight: 800,
                        fontSize: "24px",
                        color: C.white,
                        letterSpacing: "-0.3px",
                        marginBottom: "4px",
                      }}
                    >
                      {subscription.plan.name}
                    </h1>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      {subscription.plan.description}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: 700,
                    fontSize: "13px",
                    color: C.white,
                  }}
                >
                  {status === "active" && <ShieldCheck size={14} />}
                  {status === "cancelled" && <X size={14} />}
                  {statusCfg.label}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "6px",
                  marginBottom: "28px",
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: "48px",
                    color: C.white,
                    letterSpacing: "-2px",
                    lineHeight: 1,
                  }}
                >
                  ₦{subscription.plan.price.toLocaleString()}
                </span>
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "18px",
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  /{subscription.plan.interval}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "10px",
                }}
              >
                {[
                  {
                    label: "Started",
                    value: new Date(subscription.started_at).toLocaleDateString(),
                    warn: false,
                  },
                  {
                    label: subscription.auto_renew ? "Renews" : "Expires",
                    value: new Date(subscription.expires_at).toLocaleDateString(),
                    warn: expiring,
                  },
                  {
                    label: "Auto-Renew",
                    value: subscription.auto_renew ? "Enabled" : "Disabled",
                    warn: false,
                  },
                ].map(({ label, value, warn }) => (
                  <div
                    key={label}
                    style={{
                      background: warn
                        ? "rgba(240,101,67,0.2)"
                        : "rgba(255,255,255,0.12)",
                      backdropFilter: "blur(6px)",
                      borderRadius: "10px",
                      padding: "14px 16px",
                      border: `1px solid ${warn ? "rgba(240,101,67,0.3)" : "rgba(255,255,255,0.15)"}`,
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.6)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "4px",
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "14px",
                        color: warn ? "#FED7AA" : C.white,
                      }}
                    >
                      {warn && "⚠️ "}
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Expiring alert */}
        {expiring && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            style={{ marginBottom: "20px" }}
          >
            <div
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
                background: "rgba(240,101,67,0.06)",
                border: `1px solid rgba(240,101,67,0.3)`,
                borderRadius: "12px",
                padding: "18px 20px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "rgba(240,101,67,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.coral,
                  flexShrink: 0,
                }}
              >
                <Calendar size={18} />
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "14px",
                    color: C.coral,
                    marginBottom: "4px",
                  }}
                >
                  Expiring Soon
                </p>
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "13px",
                    color: C.ink,
                    lineHeight: 1.6,
                  }}
                >
                  Your subscription expires on{" "}
                  <strong>
                    {new Date(subscription.expires_at).toLocaleDateString()}
                  </strong>
                  .
                  {!subscription.auto_renew &&
                    " Reactivate now to keep your access uninterrupted."}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cancelled alert */}
        {status === "cancelled" && subscription.cancelled_at && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            style={{ marginBottom: "20px" }}
          >
            <div
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
                background: C.snow,
                border: `1px solid ${C.border}`,
                borderRadius: "12px",
                padding: "18px 20px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.coolGrey,
                  flexShrink: 0,
                }}
              >
                <X size={18} />
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "14px",
                    color: C.ink,
                    marginBottom: "4px",
                  }}
                >
                  Subscription Cancelled
                </p>
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "13px",
                    color: C.coolGrey,
                    lineHeight: 1.6,
                  }}
                >
                  Cancelled on{" "}
                  <strong style={{ color: C.ink }}>
                    {new Date(subscription.cancelled_at).toLocaleDateString()}
                  </strong>
                  . You can reactivate anytime.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Features */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          style={{ marginBottom: "20px" }}
        >
          <div
            style={{
              background: C.white,
              borderRadius: "16px",
              border: `1px solid ${C.border}`,
              padding: "28px 32px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <Sparkles size={18} style={{ color: C.teal }} />
              <h2 style={{ fontWeight: 700, fontSize: "18px", color: C.teal }}>
                What&apos;s Included
              </h2>
            </div>
            {features.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.3 + idx * 0.05,
                      duration: 0.35,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      background: C.snow,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "rgba(13,148,136,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: "1px",
                      }}
                    >
                      <Check size={11} style={{ color: C.teal }} />
                    </div>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "13px",
                        color: C.ink,
                        lineHeight: 1.5,
                      }}
                    >
                      {feature}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p
                style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey }}
              >
                No features listed.
              </p>
            )}
          </div>
        </motion.div>

        {/* Actions */}
        {!hasExpired && (canRenew || canCancel) && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <div
              style={{
                background: C.white,
                borderRadius: "16px",
                border: `1px solid ${C.border}`,
                padding: "28px 32px",
              }}
            >
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: "18px",
                  color: C.teal,
                  marginBottom: "20px",
                }}
              >
                Manage Subscription
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    canRenew && canCancel ? "1fr 1fr" : "1fr",
                  gap: "12px",
                }}
              >
                {canRenew && (
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        inset: "-4px",
                        borderRadius: "12px",
                        background: `linear-gradient(to right, rgba(13,148,136,0.35), rgba(13,148,136,0.15), rgba(13,148,136,0.35))`,
                        filter: "blur(12px)",
                        opacity: 0.6,
                        zIndex: 0,
                      }}
                    />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <Button
                        variant="secondary"
                        className="w-full"
                        disabled={reactivateSub.isPending}
                        onClick={handleRenew}
                      >
                        {reactivateSub.isPending ? (
                          <>
                            <RefreshCw
                              size={14}
                              style={{ animation: "spin 1s linear infinite" }}
                            />{" "}
                            Processing...
                          </>
                        ) : (
                          <>
                            <RefreshCw size={14} /> Reactivate Subscription
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
                {canCancel && (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowCancelConfirm(true)}
                  >
                    <X size={14} /> Cancel Subscription
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Cancel modal */}
      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(31,41,55,0.45)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              zIndex: 50,
            }}
            onClick={(e) =>
              e.target === e.currentTarget && setShowCancelConfirm(false)
            }
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: C.white,
                borderRadius: "16px",
                padding: "36px",
                maxWidth: "420px",
                width: "100%",
                boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "rgba(240,101,67,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.coral,
                  marginBottom: "16px",
                }}
              >
                <X size={24} />
              </div>
              <h3
                style={{
                  fontWeight: 800,
                  fontSize: "20px",
                  color: C.ink,
                  marginBottom: "8px",
                }}
              >
                Cancel Subscription?
              </h3>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: "14px",
                  color: C.coolGrey,
                  lineHeight: 1.6,
                  marginBottom: "28px",
                }}
              >
                Are you sure you want to cancel{" "}
                <strong style={{ color: C.ink }}>
                  {subscription.plan.name}
                </strong>
                ? You&apos;ll lose access at the end of your billing period.
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCancelConfirm(false)}
                >
                  Keep It
                </Button>
                <div style={{ position: "relative", flex: 1 }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: "-4px",
                      borderRadius: "12px",
                      background: `linear-gradient(to right, rgba(240,101,67,0.4), rgba(240,101,67,0.2), rgba(240,101,67,0.4))`,
                      filter: "blur(12px)",
                      opacity: 0.7,
                      zIndex: 0,
                    }}
                  />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <Button
                      variant="default"
                      className="w-full"
                      disabled={cancelSub.isPending}
                      onClick={handleCancel}
                    >
                      {cancelSub.isPending ? (
                        <>
                          <RefreshCw
                            size={14}
                            style={{ animation: "spin 1s linear infinite" }}
                          />{" "}
                          Canceling...
                        </>
                      ) : (
                        "Yes, Cancel"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}