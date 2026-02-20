"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import apiClient from "@/lib/apiClient";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface Bank {
  name: string;
  code: string;
}

interface AddSubaccountModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
  organization: any;
  profile: any;
}

export default function AddSubaccountModal({
  isOpen,
  onOpenChange,
  onSuccess,
  organization,
  profile,
}: AddSubaccountModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [formData, setFormData] = useState({
    businessName: organization.name,
    accountNumber: "",
    bankCode: "",
  });
  const [error, setError] = useState("");
  const [subaccountData, setSubaccountData] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetchBanks();
      setFormData({ businessName: organization.name, accountNumber: "", bankCode: "" });
      setError("");
      setSubaccountData(null);
    }
  }, [isOpen]);

  const fetchBanks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://api.paystack.co/bank");
      setBanks(response.data.data);
    } catch {
      setError("Failed to load banks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.businessName || !formData.accountNumber || !formData.bankCode) {
      setError("All fields are required");
      return;
    }
    try {
      setIsLoading(true);
      const response = await apiClient.post("/payments/paystack/subaccount", {
        business_name: formData.businessName,
        account_number: formData.accountNumber,
        bank_code: formData.bankCode,
        percentage_charge: 8.5,
        primary_contact_name: `${profile.firstName} ${profile.lastName}`,
        primary_contact_email: profile.email,
      });
      setSubaccountData(response.data.data);
      onSuccess();
      setTimeout(() => onOpenChange(false), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to create subaccount");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488] transition-all disabled:opacity-50";

  const labelClass =
    "block text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1.5";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-[#1F2937]">
              Add Bank Account
            </h2>
            <p className="text-sm text-[#9CA3AF] mt-0.5">
              Link a bank account to receive payouts
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className={labelClass}>
                Business Name <span className="text-[#F06543]">*</span>
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                required
                placeholder="Your business name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Account Number <span className="text-[#F06543]">*</span>
              </label>
              <input
                type="number"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                required
                placeholder="0000000000"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Bank <span className="text-[#F06543]">*</span>
              </label>
              <select
                value={formData.bankCode}
                onChange={(e) => setFormData({ ...formData, bankCode: e.target.value })}
                required
                disabled={isLoading && banks.length === 0}
                className={inputClass}
              >
                <option value="">
                  {isLoading && banks.length === 0 ? "Loading banks..." : "Select your bank"}
                </option>
                {banks.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            {subaccountData && (
              <div className="bg-[#F0FDF9] border border-[#0D9488]/20 rounded-lg px-4 py-3">
                <p className="text-xs font-bold text-[#0D9488] uppercase tracking-wide mb-1">
                  Account Verified
                </p>
                <p className="text-sm font-semibold text-[#1F2937]">
                  {subaccountData.account_name}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-[#F9FAFB]">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Add Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}