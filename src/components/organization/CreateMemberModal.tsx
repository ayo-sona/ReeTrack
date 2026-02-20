"use client";

import { useState } from "react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateMemberModal({ isOpen, onClose }: CreateMemberModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiClient.post("/auth/custom/register-member", { email });
      toast.success("Invitation sent successfully");
      onClose();
      setEmail("");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating member:", error);
      toast.error(error.response?.data?.message || "Failed to send invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-xl bg-white shadow-xl border border-gray-100"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-bold text-[#1F2937]">Add New Member</h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">
            Send an invitation to their email address
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">
              Email Address <span className="text-[#F06543]">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-[#1F2937] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
              placeholder="member@example.com"
            />
            <p className="text-xs text-[#9CA3AF] mt-1.5">
              They'll receive an email to complete their registration.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
        </form>
      </div>
    </div>
  );
}