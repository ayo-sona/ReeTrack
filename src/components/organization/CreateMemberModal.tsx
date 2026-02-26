"use client";

import { useState, useMemo } from "react";
import { X, Plus, Trash2, Link2, Copy, Check } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface EmailEntry {
  id: string;
  value: string;
  status: "idle" | "loading" | "success" | "error";
  error?: string;
}

interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Organization {
  id: string;
  slug: string;
}

interface UserData {
  organizations?: Organization[];
}

interface InviteResult {
  email: string;
  status: string;
  userExists?: boolean;
}

type Tab = "email" | "link";

export function CreateMemberModal({ isOpen, onClose }: CreateMemberModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emails, setEmails] = useState<EmailEntry[]>([
    { id: crypto.randomUUID(), value: "", status: "idle" },
  ]);

  // Build the invite link from the org slug stored in userData
  const inviteLink = useMemo(() => {
    if (typeof window === "undefined") return "";
    try {
      const userData: UserData = JSON.parse(
        localStorage.getItem("userData") || "{}",
      );
      const selectedOrgId = localStorage.getItem("selectedOrganizationId");

      const org = selectedOrgId
        ? userData?.organizations?.find((o) => o.id === selectedOrgId)
        : userData?.organizations?.[0];

      const slug = org?.slug ?? null;

      if (slug) {
        return `${window.location.origin}/join/${slug}`;
      }
    } catch {
      // silently ignore parse errors
    }
    return "";
  }, []);

  const handleCopyLink = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Invite link copied!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy link — please copy it manually.");
    }
  };

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
        e.id === id ? { ...e, value, status: "idle", error: undefined } : e,
      ),
    );
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setEmails([{ id: crypto.randomUUID(), value: "", status: "idle" }]);
    setActiveTab("email");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validEmails = emails.filter((e) => e.value.trim() !== "");
    if (validEmails.length === 0) {
      toast.error("Please enter at least one email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.post("/auth/custom/register-member", {
        email: validEmails.map((entry) => entry.value.trim()),
      });

      if (response.data.statusCode === 201) {
        const resultMap: Record<
          string,
          { success: boolean; error?: string; userExists?: boolean }
        > = {};

        response.data.data.results.forEach((result: InviteResult) => {
          const emailEntry = validEmails.find(
            (entry) => entry.value.trim() === result.email,
          );
          if (emailEntry) {
            resultMap[emailEntry.id] = {
              success: result.status === "sent",
              userExists: result.userExists,
              error:
                result.status !== "sent"
                  ? "Failed to send invitation"
                  : undefined,
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
          }),
        );

        const successCount = Object.values(resultMap).filter(
          (r) => r.success,
        ).length;
        const failCount = Object.values(resultMap).filter(
          (r) => !r.success,
        ).length;

        if (successCount > 0 && failCount === 0) {
          toast.success(
            successCount === 1
              ? "Invitation sent successfully"
              : `${successCount} invitations sent successfully`,
          );
          router.refresh();
          handleClose();
        } else if (successCount > 0 && failCount > 0) {
          toast.warning(
            `${successCount} sent, ${failCount} failed — check the highlighted emails`,
          );
          router.refresh();
        } else {
          toast.error("All invitations failed — check the highlighted emails");
        }
      }
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(
        apiError?.response?.data?.message || "Failed to send invitations",
      );
      console.error("Error sending invitations:", error);
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
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-base font-bold text-[#1F2937]">Add Members</h2>
            <p className="text-sm text-[#9CA3AF] mt-0.5">
              Invite by email or share a link
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

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6 pt-4 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("email")}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === "email"
                ? "border-[#0D9488] text-[#0D9488]"
                : "border-transparent text-[#9CA3AF] hover:text-[#1F2937]"
            }`}
          >
            Invite by Email
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("link")}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "link"
                ? "border-[#0D9488] text-[#0D9488]"
                : "border-transparent text-[#9CA3AF] hover:text-[#1F2937]"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            Invite via Link
          </button>
        </div>

        {/* ---------------------------------------- */}
        {/* TAB: Invite by Email                      */}
        {/* ---------------------------------------- */}
        {activeTab === "email" && (
          <form onSubmit={handleSubmit}>
            {/* Info banner */}
            <div className="mx-6 mt-5 rounded-lg bg-[#0D9488]/5 border border-[#0D9488]/10 px-4 py-3">
              <p className="text-xs text-[#0D9488] leading-relaxed">
                If the email is already registered, they&apos;ll be asked to
                confirm joining your organization. If not, they&apos;ll be
                prompted to create an account first.
              </p>
            </div>

            <div className="px-6 py-5 space-y-3 max-h-[340px] overflow-y-auto">
              {emails.map((entry, index) => (
                <div key={entry.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="email"
                        value={entry.value}
                        onChange={(e) => updateEmail(entry.id, e.target.value)}
                        disabled={isSubmitting || entry.status === "success"}
                        placeholder={`member${index + 1}@example.com`}
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
        )}

        {/* ---------------------------------------- */}
        {/* TAB: Invite via Link                      */}
        {/* ---------------------------------------- */}
        {activeTab === "link" && (
          <div className="px-6 py-6 space-y-5">
            {/* Explanation */}
            <div className="rounded-lg bg-[#0D9488]/5 border border-[#0D9488]/10 px-4 py-3">
              <p className="text-xs text-[#0D9488] leading-relaxed">
                Anyone with this link can join your organization. Share it on
                WhatsApp, in emails, or on social media — they&apos;ll be walked
                through signup automatically.
              </p>
            </div>

            {/* Link box */}
            {inviteLink ? (
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#1F2937]">
                  Your invite link
                </p>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-[#F9FAFB] px-3 py-2.5">
                  <span className="flex-1 text-xs text-[#1F2937] truncate font-mono">
                    {inviteLink}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#0D9488] hover:text-[#0B7A70] transition-colors flex-shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#9CA3AF] text-center py-4">
                Could not load your invite link. Please try refreshing.
              </p>
            )}

            {/* Copy button (large) */}
            {inviteLink && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Link Copied!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Copy className="w-4 h-4" /> Copy Invite Link
                  </span>
                )}
              </Button>
            )}

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}