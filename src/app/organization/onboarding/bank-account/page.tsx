"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { Landmark } from "lucide-react";
import AddSubaccountModal from "@/components/organization/AddSubaccountModal";

export default function OnboardingBankAccountPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [orgData, setOrgData] = useState<any>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await apiClient.get("/auth/profile");
        const d = data.data;
        setProfile({
          firstName: d.first_name,
          lastName: d.last_name,
          email: d.email,
        });

        const org = d.organizations?.[0];
        setOrgData({
          name: org?.name ?? "",
          email: org?.email ?? "",
        });
      } catch {
        toast.error("Failed to load profile. Please refresh.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSuccess = () => {
    setDone(true);
    setIsModalOpen(false);
    toast.success("Bank account added!");
    setTimeout(() => router.push("/organization/onboarding/create-plan"), 1200);
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
            Step 1 of 4
          </p>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
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
              Bank Account
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] leading-snug mb-3">
              Set up where your money lands
            </h1>
            <p className="text-sm text-[#1F2937]/70 leading-relaxed">
              Before members can subscribe, you need to link a bank account. This is where
              your subscription revenue gets paid out directly — no manual transfers, no delays.
            </p>

            <div className="mt-5 rounded-xl bg-[#0D9488]/5 border border-[#0D9488]/10 px-4 py-3">
              <p className="text-xs text-[#0D9488] leading-relaxed">
                💡 You'll need your account number and bank name. This takes less than a minute.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-8 flex flex-col items-center text-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#0D9488]/10 flex items-center justify-center">
              <Landmark className="w-8 h-8 text-[#0D9488]" />
            </div>

            {done ? (
              <div className="bg-[#0D9488]/5 border border-[#0D9488]/20 text-[#0D9488] px-4 py-3 rounded-xl text-sm font-bold w-full flex items-center justify-center gap-2">
                ✓ Bank account added — moving on...
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(true)}
                disabled={isLoading || done}
              >
                <Landmark className="w-4 h-4" />
                {isLoading ? "Loading..." : "Add Bank Account"}
              </Button>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-100 bg-[#F9FAFB] flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.push("/organization/onboarding/create-plan")}
              disabled={done}
            >
              Skip for now
            </Button>

            {done && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push("/organization/onboarding/create-plan")}
              >
                Continue →
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal — always mounted, guarded internally */}
      <AddSubaccountModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleSuccess}
        organization={orgData ?? { name: "", email: "" }}
        profile={profile ?? { firstName: "", lastName: "", email: "" }}
      />
    </div>
  );
}