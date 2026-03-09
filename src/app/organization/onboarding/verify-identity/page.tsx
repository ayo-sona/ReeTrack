"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Fingerprint, Camera, Upload, X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyBvn } from "@/lib/organizationAPI/verifybvn";
import { useKycStatus } from "@/hooks/useKYC";
import { toast } from "sonner";
import clsx from "clsx";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all disabled:opacity-50";
const labelClass =
  "block text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1.5";

export default function OnboardingVerifyIdentityPage() {
  const router = useRouter();
  const { markVerified } = useKycStatus();

  const [bvn, setBvn] = useState("");
  const [showBvn, setShowBvn] = useState(false);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verifiedName, setVerifiedName] = useState("");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setSelfieFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setSelfiePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFileChange(e.dataTransfer.files[0]);
    },
    [handleFileChange]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (bvn.length !== 11) {
      setError("BVN must be exactly 11 digits.");
      return;
    }
    if (!selfieFile) {
      setError("Please upload a selfie photo.");
      return;
    }

    setIsLoading(true);
    try {
      const base64Selfie = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) =>
          resolve((e.target?.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(selfieFile);
      });

      const result = await verifyBvn({ bvn, selfie: base64Selfie });

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
      setTimeout(() => router.push("/organization/onboarding/bank-account"), 1500);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Verification failed. Please check your BVN and try again.";
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
              We use your BVN to verify you're a real person — this keeps ReeTrack
              safe for everyone and unlocks payments and member management.
            </p>

            <div className="mt-5 rounded-xl bg-[#0D9488]/5 border border-[#0D9488]/10 px-4 py-3">
              <p className="text-xs text-[#0D9488] leading-relaxed">
                🔒 Your BVN is encrypted and used only for identity verification. We never store or share it.
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
                  <span>✓</span> Identity verified{verifiedName ? ` — ${verifiedName}` : ""} — moving on...
                </div>
              )}

              {/* BVN input */}
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

              {/* Selfie upload */}
              <div>
                <label className={labelClass}>Selfie Photo</label>

                {selfiePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-[#0D9488]/20">
                    <img
                      src={selfiePreview}
                      alt="Selfie preview"
                      className="w-full h-44 object-cover object-center"
                    />
                    {!success && (
                      <button
                        type="button"
                        onClick={() => { setSelfieFile(null); setSelfiePreview(null); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-[#1F2937]" />
                      </button>
                    )}
                    <div className="px-4 py-2 bg-[#0D9488]/10 flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#0D9488] truncate">
                        ✓ {selfieFile?.name}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={clsx(
                      "rounded-xl border-2 border-dashed px-6 py-7 flex flex-col items-center gap-3 cursor-pointer transition-all",
                      dragOver
                        ? "border-[#0D9488] bg-[#0D9488]/5"
                        : "border-gray-200 hover:border-[#0D9488]/40 hover:bg-[#F9FAFB]"
                    )}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#0D9488]/10 flex items-center justify-center">
                      <Camera className="w-6 h-6 text-[#0D9488]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1F2937]">Upload a selfie</p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        Drag & drop or tap to choose · JPG, PNG up to 5MB
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#0D9488]">
                      <Upload className="w-3.5 h-3.5" /> Choose file
                    </span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                />

                <p className="text-xs text-[#9CA3AF] mt-1.5">
                  Take a clear photo of your face — it should match your BVN record.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-gray-100 bg-[#F9FAFB] flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => router.push("/organization/onboarding/bank-account")}
                disabled={isLoading || success}
              >
                Skip for now
              </Button>

              <Button
                type="submit"
                variant="secondary"
                size="sm"
                disabled={isLoading || success || bvn.length !== 11 || !selfieFile}
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