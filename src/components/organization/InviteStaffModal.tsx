"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface EmailEntry {
  id: string;
  value: string;
  status: "idle" | "loading" | "success" | "error";
  error?: string;
}

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emails, setEmails] = useState<EmailEntry[]>([
    { id: crypto.randomUUID(), value: "", status: "idle" },
  ]);

  useEffect(() => {
    if (!isOpen) {
      setEmails([{ id: crypto.randomUUID(), value: "", status: "idle" }]);
    }
  }, [isOpen]);

  const addEmail = () => {
    setEmails((prev) => [
      ...prev,
      { id: crypto.randomUUID(), value: "", status: "idle" },
    ]);
  };

  const removeEmail = (id: string) => {
    if (emails.length === 1) return;
    setEmails((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEmail = (id: string, value: string) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, value, status: "idle", error: undefined } : e
      )
    );
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validEmails = emails.filter((e) => e.value.trim() !== "");
    if (validEmails.length === 0) {
      toast.error("Please enter at least one email address.");
      return;
    }

    setIsSubmitting(true);

    // Fire all requests in parallel — one per email
    const results = await Promise.allSettled(
      validEmails.map((entry) =>
        apiClient
          .post("/auth/custom/register-staff", { email: entry.value.trim() })
          .then(() => ({ id: entry.id, success: true }))
          .catch((err) => ({
            id: entry.id,
            success: false,
            error: err?.response?.data?.message || "Failed to send invitation",
          }))
      )
    );

    // Map results back to entries
    const resultMap: Record<string, { success: boolean; error?: string }> = {};
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        resultMap[result.value.id] = {
          success: result.value.success,
          error: (result.value as any).error,
        };
      }
    });

    setEmails((prev) =>
      prev.map((entry) => {
        const result = resultMap[entry.id];
        if (!result) return entry;
        return {
          ...entry,
          status: result.success ? "success" : "error",
          error: result.error,
        };
      })
    );

    const successCount = Object.values(resultMap).filter((r) => r.success).length;
    const failCount = Object.values(resultMap).filter((r) => !r.success).length;

    if (successCount > 0 && failCount === 0) {
      toast.success(
        successCount === 1
          ? "Invitation sent successfully"
          : `${successCount} invitations sent successfully`
      );
      onSuccess?.();
      handleClose();
    } else if (successCount > 0 && failCount > 0) {
      toast.warning(
        `${successCount} sent, ${failCount} failed — check the highlighted emails`
      );
      onSuccess?.();
    } else {
      toast.error("All invitations failed — check the highlighted emails");
    }

    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  const inputBase =
    "w-full rounded-lg border bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 transition-all disabled:opacity-50";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-[#1F2937]">
              Invite Staff Members
            </h2>
            <p className="text-sm text-[#9CA3AF] mt-0.5">
              They'll receive an email to complete their setup
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info banner */}
        <div className="mx-6 mt-5 rounded-lg bg-[#0D9488]/5 border border-[#0D9488]/10 px-4 py-3">
          <p className="text-xs text-[#0D9488] leading-relaxed">
            Staff members can log in to manage members, plans, and check-ins on
            your behalf. They'll get full admin access to your organization.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-3 max-h-[340px] overflow-y-auto">
            {emails.map((entry, index) => (
              <div key={entry.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      autoFocus={index === 0}
                      value={entry.value}
                      onChange={(e) => updateEmail(entry.id, e.target.value)}
                      disabled={isSubmitting || entry.status === "success"}
                      placeholder={`staff${index + 1}@example.com`}
                      className={`${inputBase} ${
                        entry.status === "error"
                          ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                          : entry.status === "success"
                          ? "border-[#0D9488] bg-[#0D9488]/5 text-[#0D9488]"
                          : "border-gray-200 focus:ring-[#0D9488]/20 focus:border-[#0D9488]"
                      }`}
                    />
                    {entry.status === "success" && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0D9488] text-xs font-semibold">
                        ✓ Sent
                      </span>
                    )}
                  </div>

                  {emails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmail(entry.id)}
                      disabled={isSubmitting}
                      className="p-2 text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0 disabled:opacity-40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Per-email error */}
                {entry.status === "error" && entry.error && (
                  <p className="text-xs text-red-500 font-semibold pl-1">
                    {entry.error}
                  </p>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addEmail}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#0D9488] hover:text-[#0B7A70] transition-colors disabled:opacity-40 mt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add another email
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-[#F9FAFB]">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
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
              {isSubmitting
                ? "Sending..."
                : emails.filter((e) => e.value.trim()).length > 1
                ? `Send ${emails.filter((e) => e.value.trim()).length} Invitations`
                : "Send Invitation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}