"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyPayment } from "@/hooks/usePayments";

const C = {
  teal: "#0D9488", coral: "#F06543", snow: "#F9FAFB",
  white: "#FFFFFF", ink: "#1F2937", coolGrey: "#9CA3AF", border: "#E5E7EB",
};

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Paystack sends either ?reference= or ?trxref=
  const reference = searchParams.get("reference") || searchParams.get("trxref") || "";

  // useVerifyPayment is a mutation — isPending/isSuccess/isError, not isLoading
  const { mutate: verify, isPending, isSuccess, isError, data } = useVerifyPayment();

  // Fire once on mount when we have a reference
  useEffect(() => {
    if (reference) verify(reference);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect to receipt once verified — data is Payment directly, not data.payment
  useEffect(() => {
    if (isSuccess && data?.id) {
      const timer = setTimeout(() => {
        router.replace(`/member/payments/${data.id}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, data, router]);

  return (
    <div style={{
      minHeight: "100vh", background: C.snow, display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: "Nunito, sans-serif", padding: "24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: C.white, borderRadius: "20px", border: `1px solid ${C.border}`,
          padding: "56px 48px", textAlign: "center", maxWidth: "420px", width: "100%",
          boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
        }}
      >
        {/* Loading / verifying */}
        {isPending && (
          <>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "rgba(13,148,136,0.08)", display: "flex",
              alignItems: "center", justifyContent: "center", margin: "0 auto 24px",
            }}>
              <Loader2 size={32} style={{ color: C.teal, animation: "spin 1s linear infinite" }} />
            </div>
            <h2 style={{ fontWeight: 800, fontSize: "22px", color: C.ink, marginBottom: "8px" }}>
              Verifying Payment
            </h2>
            <p style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey, lineHeight: 1.6 }}>
              Please wait while we confirm your payment with Paystack&hellip;
            </p>
          </>
        )}

        {/* Success */}
        {isSuccess && data?.id && (
          <>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: "rgba(13,148,136,0.1)", display: "flex",
                alignItems: "center", justifyContent: "center", margin: "0 auto 24px",
              }}
            >
              <CheckCircle size={36} style={{ color: C.teal }} />
            </motion.div>
            <h2 style={{ fontWeight: 800, fontSize: "22px", color: C.ink, marginBottom: "8px" }}>
              Payment Confirmed!
            </h2>
            <p style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey, lineHeight: 1.6 }}>
              Redirecting you to your receipt&hellip;
            </p>
          </>
        )}

        {/* Error or no reference */}
        {(isError || (!isPending && !isSuccess)) && (
          <>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "rgba(240,101,67,0.1)", display: "flex",
              alignItems: "center", justifyContent: "center", margin: "0 auto 24px",
            }}>
              <XCircle size={36} style={{ color: C.coral }} />
            </div>
            <h2 style={{ fontWeight: 800, fontSize: "22px", color: C.ink, marginBottom: "8px" }}>
              Verification Failed
            </h2>
            <p style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey, lineHeight: 1.6, marginBottom: "28px" }}>
              We couldn&apos;t verify your payment. If money was deducted, please contact support.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Button variant="outline" onClick={() => router.push("/member/subscriptions")}>
                My Subscriptions
              </Button>
              <Button variant="default" onClick={() => router.push("/member/payments")}>
                Payment History
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh", background: "#F9FAFB",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Loader2 size={32} style={{ color: "#0D9488", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}