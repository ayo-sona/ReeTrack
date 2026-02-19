"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
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
    }
  }, [isOpen]);

  const fetchBanks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://api.paystack.co/bank");
      setBanks(response.data.data);
    } catch (error) {
      console.error("Failed to fetch banks:", error);
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
      setTimeout(() => {
        onOpenChange(false);
      }, 5000);
    } catch (error: any) {
      console.error("Failed to create subaccount:", error);
      setError(error.response?.data?.message || "Failed to create subaccount");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: "rounded-xl border border-gray-100 shadow-lg",
        header: "border-b border-gray-100 px-6 py-5",
        body: "px-6 py-5",
        footer: "border-t border-gray-100 px-6 py-4",
      }}
    >
      <ModalContent>
        <ModalHeader>
          <div>
            <h2 className="text-lg font-bold text-[#1F2937]" style={{ fontFamily: "Nunito, sans-serif" }}>
              Add Bank Account
            </h2>
            <p className="text-sm font-normal text-[#9CA3AF] mt-0.5">
              Link a bank account to receive payouts
            </p>
          </div>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm mb-2">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5" style={{ fontFamily: "Nunito, sans-serif" }}>
                  Business Name <span className="text-[#F06543]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-[#1F2937] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                  placeholder="Your business name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5" style={{ fontFamily: "Nunito, sans-serif" }}>
                  Account Number <span className="text-[#F06543]">*</span>
                </label>
                <input
                  type="number"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-[#1F2937] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                  placeholder="0000000000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5" style={{ fontFamily: "Nunito, sans-serif" }}>
                  Bank <span className="text-[#F06543]">*</span>
                </label>
                <select
                  value={formData.bankCode}
                  onChange={(e) => setFormData({ ...formData, bankCode: e.target.value })}
                  required
                  disabled={isLoading && banks.length === 0}
                  className="w-full rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-[#1F2937] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all disabled:opacity-50"
                  style={{ fontFamily: "Nunito, sans-serif" }}
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
                  <p className="text-xs font-semibold text-[#0D9488] uppercase tracking-wide mb-1">
                    Account Verified
                  </p>
                  <p className="text-sm font-semibold text-[#1F2937]">
                    {subaccountData.account_name}
                  </p>
                </div>
              )}
            </div>
          </ModalBody>

          <ModalFooter>
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
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}