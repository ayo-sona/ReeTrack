"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/apiClient";
import axios from "axios";
import { toast } from "sonner";

interface Bank {
  name: string;
  code: string;
}

export default function OnboardingBankAccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingBanks, setIsFetchingBanks] = useState(true);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "" });
  const [orgName, setOrgName] = useState("");
  const [formData, setFormData] = useState({
    businessName: "",
    accountNumber: "",
    bankCode: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [banksRes, profileRes] = await Promise.all([
          axios.get("https://api.paystack.co/bank"),
          apiClient.get("/auth/profile"),
        ]);
        setBanks(banksRes.data.data);
        const d = profileRes.data.data;
        setProfile({ firstName: d.first_name, lastName: d.last_name, email: d.email });
        setOrgName(d.organizations?.[0]?.name ?? "");
        setFormData((prev) => ({ ...prev, businessName: d.organizations?.[0]?.name ?? "" }));
      } catch {
        toast.error("Failed to load data. Please refresh.");
      } finally {
        setIsFetchingBanks(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.businessName || !formData.accountNumber || !formData.bankCode) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post("/payments/paystack/subaccount", {
        business_name: formData.businessName,
        account_number: formData.accountNumber,
        bank_code: formData.bankCode,
        percentage_charge: 8.5,
        primary_contact_name: `${profile.firstName} ${profile.lastName}`,
        primary_contact_email: profile.email,
      });
      setSuccess(true);
      toast.success("Bank account added!");
      setTimeout(() => router.push("/onboarding/create-plan"), 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add bank account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all disabled:opacity-50";
  const labelClass = "block text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1.5";

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

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-8 py-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-[#0D9488]/5 border border-[#0D9488]/20 text-[#0D9488] px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <span>✓</span> Bank account added successfully — moving on...
                </div>
              )}

              <div>
                <label className={labelClass}>Business Name *</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                  disabled={isLoading || success}
                  placeholder="Your business name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Account Number *</label>
                <input
                  type="number"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  required
                  disabled={isLoading || success}
                  placeholder="0000000000"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Bank *</label>
                <select
                  value={formData.bankCode}
                  onChange={(e) => setFormData({ ...formData, bankCode: e.target.value })}
                  required
                  disabled={isLoading || isFetchingBanks || success}
                  className={inputClass}
                >
                  <option value="">
                    {isFetchingBanks ? "Loading banks..." : "Select your bank"}
                  </option>
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-gray-100 bg-[#F9FAFB] flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => router.push("/onboarding/create-plan")}
                disabled={isLoading}
              >
                Skip for now
              </Button>

              <Button
                type="submit"
                variant="secondary"
                size="sm"
                disabled={isLoading || isFetchingBanks || success}
              >
                {isLoading ? "Adding account..." : "Add Bank Account"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}