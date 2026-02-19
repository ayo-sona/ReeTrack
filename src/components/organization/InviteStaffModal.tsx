"use client";

import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";

interface InviteStaffModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

export function InviteStaffModal({
  isOpen,
  onOpenChange,
  onSuccess,
}: InviteStaffModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await apiClient.post("/auth/custom/register-staff", { email });
      onSuccess?.();
      onOpenChange(false);
      setEmail("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send invitation");
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
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <div style={{ fontFamily: "Nunito, sans-serif" }}>
              <h2 className="text-lg font-bold text-[#1F2937]">Invite Staff Member</h2>
              <p className="text-sm font-normal text-[#9CA3AF] mt-0.5">
                They'll receive an email to complete their setup
              </p>
            </div>
          </ModalHeader>

          <ModalBody>
            <div className="space-y-3" style={{ fontFamily: "Nunito, sans-serif" }}>
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">
                  Email Address <span className="text-[#F06543]">*</span>
                </label>
                <input
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  disabled={isLoading}
                  required
                  placeholder="staff@example.com"
                  className="w-full rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              {error && (
                <p className="text-xs font-semibold text-red-500">{error}</p>
              )}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Invitation"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}