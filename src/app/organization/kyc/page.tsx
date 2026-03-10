"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Fingerprint, Eye, EyeOff, ArrowLeft, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyBvn } from "@/lib/organizationAPI/verifybvn";
import { useKycStatus } from "@/hooks/useKYC";
import { toast } from "sonner";
import clsx from "clsx";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all disabled:opacity-50";
const labelClass =
  "block text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1.5";

export default function KycPage() {
  const router = useRouter();
  const { markVerified } = useKycStatus();

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
            .replace(/\b\w/g, (c) => c.toUpperCase())
        );
      }

      markVerified();
      setSuccess(true);
      toast.success("Identity verified!");
      setTimeout(() => router.push("/organization/dashboard"), 1500);
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
    <div className="min-h-screen bg-[#F9FAFB] font-[Nunito,sans-serif]">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Back link */}
        <button
          onClick={() => router.push("/organization/dashboard")}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#9CA3AF] hover:text-[#1F2937] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Page header */}
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#0D9488] mb-1">
            Account
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2937]">
            Identity Verification
          </h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">
            Verify your identity to add members and collect payments
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Header */}
          <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#0D9488]" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#1F2937]">BVN Verification</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  One-time verification — takes less than a minute
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-[#0D9488]/5 border border-[#0D9488]/10 px-4 py-3">
              <p className="text-xs text-[#0D9488] leading-relaxed">
                Your BVN is encrypted and used only for identity verification. We never store or share it.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 sm:px-8 py-6 space-y-5">

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-[#0D9488]/5 border border-[#0D9488]/20 text-[#0D9488] px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <span>✓</span> Identity verified{verifiedName ? ` — ${verifiedName}` : ""} — redirecting...
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
                      onChange={(e) => { setFirstName(e.target.value); setError(""); }}
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
                      onChange={(e) => { setLastName(e.target.value); setError(""); }}
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
                    onChange={(e) => { setDateOfBirth(e.target.value); setError(""); }}
                    disabled={isLoading || success}
                    className={clsx(inputClass, "pl-10")}
                  />
                </div>
              </div>

              {/* BVN */}
              <div>
                <label className={labelClass}>BVN (Bank Verification Number)</label>
                <div className="relative">
                  <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type={showBvn ? "text" : "password"}
                    inputMode="numeric"
                    value={bvn}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 11);
                      setBvn(val);
                      setError("");
                    }}
                    placeholder="Enter your 11-digit BVN"
                    disabled={isLoading || success}
                    className={clsx(inputClass, "pl-10 pr-12 tracking-widest font-mono")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowBvn(!showBvn)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2937] transition-colors"
                  >
                    {showBvn ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-between mt-1.5">
                  <p className="text-xs text-[#9CA3AF]">Dial *565*0# to find your BVN</p>
                  <p className={clsx(
                    "text-xs font-semibold",
                    bvn.length === 11 ? "text-[#0D9488]" : "text-[#9CA3AF]"
                  )}>
                    {bvn.length}/11
                  </p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 sm:px-8 py-5 border-t border-gray-100 bg-[#F9FAFB] flex justify-end">
              <Button
                type="submit"
                variant="secondary"
                disabled={isLoading || success || !isValid}
              >
                {isLoading ? "Verifying..." : "Verify Identity"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}