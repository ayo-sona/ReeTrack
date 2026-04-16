"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Fingerprint, Eye, EyeOff, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyBvn } from "@/lib/organizationAPI/verifybvn";
// import { useKycStatus } from "@/hooks/useKYC";
import { toast } from "sonner";
import clsx from "clsx";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all disabled:opacity-50";
const labelClass =
  "block text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1.5";

export default function OnboardingVerifyIdentityPage() {
  const router = useRouter();
  // const { markVerified } = useKycStatus();

  const [bvn, setBvn] = useState("");
  const [showBvn, setShowBvn] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verifiedName, setVerifiedName] = useState("");
  const [error, setError] = useState("");

  const isValid =
    bvn.length === 11 &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    dateOfBirth.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValid) return;

    setIsLoading(true);
    try {
      const result = await verifyBvn({
        bvn,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        date_of_birth: dateOfBirth,
      });

      const first = result.firstName || "";
      const last = result.lastName || "";
      if (first || last) {
        setVerifiedName(
          `${first} ${last}`
            .trim()
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase()),
        );
      }

      // markVerified();
      setSuccess(true);
      toast.success("Identity verified!");
      setTimeout(
        () => router.push("/organization/onboarding/bank-account"),
        1500,
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Verification failed. Please check your details and try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center px-4 py-12"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="w-full max-w-lg">
        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#0D9488]">
            Step 1 of 5
          </p>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  s === 1 ? "bg-[#0D9488]/50 w-6" : "bg-gray-200 w-4"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#0D9488] mb-3">
              Identity Verification
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] leading-snug mb-3">
              Let's confirm it's you
            </h1>
            <p className="text-sm text-[#1F2937]/70 leading-relaxed">
              We use your BVN to verify you're a real person — this keeps
              ReeTrack safe for everyone and unlocks payments and member
              management.
            </p>
            <div className="mt-5 rounded-xl bg-[#0D9488]/5 border border-[#0D9488]/10 px-4 py-3">
              <p className="text-xs text-[#0D9488] leading-relaxed">
                Your BVN is encrypted and used only for identity verification.
                We never store or share it.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-8 py-6 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-[#0D9488]/5 border border-[#0D9488]/20 text-[#0D9488] px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <span>✓</span> Identity verified
                  {verifiedName ? ` — ${verifiedName}` : ""} — moving on...
                </div>
              )}

              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setError("");
                      }}
                      placeholder="As on BVN"
                      disabled={isLoading || success}
                      className={clsx(inputClass, "pl-10")}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setError("");
                      }}
                      placeholder="As on BVN"
                      disabled={isLoading || success}
                      className={clsx(inputClass, "pl-10")}
                    />
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className={labelClass}>Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => {
                      setDateOfBirth(e.target.value);
                      setError("");
                    }}
                    disabled={isLoading || success}
                    className={clsx(inputClass, "pl-10")}
                  />
                </div>
              </div>

              {/* BVN */}
              <div>
                <label className={labelClass}>
                  BVN (Bank Verification Number)
                </label>
                <div className="relative">
                  <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type={showBvn ? "text" : "password"}
                    inputMode="numeric"
                    value={bvn}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 11);
                      setBvn(val);
                      setError("");
                    }}
                    placeholder="Enter your 11-digit BVN"
                    disabled={isLoading || success}
                    className={clsx(
                      inputClass,
                      "pl-10 pr-12 tracking-widest font-mono",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowBvn(!showBvn)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2937] transition-colors"
                  >
                    {showBvn ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="flex justify-between mt-1.5">
                  <p className="text-xs text-[#9CA3AF]">
                    Dial *565*0# to find your BVN
                  </p>
                  <p
                    className={clsx(
                      "text-xs font-semibold",
                      bvn.length === 11 ? "text-[#0D9488]" : "text-[#9CA3AF]",
                    )}
                  >
                    {bvn.length}/11
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-gray-100 bg-[#F9FAFB] flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  router.push("/organization/onboarding/bank-account")
                }
                disabled={isLoading || success}
              >
                Skip for now
              </Button>
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                disabled={isLoading || success || !isValid}
              >
                {isLoading ? "Verifying..." : "Verify Identity"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
