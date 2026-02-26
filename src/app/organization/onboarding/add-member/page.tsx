"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

interface EmailEntry {
  id: string;
  value: string;
  status: "idle" | "success" | "error";
  error?: string;
}

export default function OnboardingAddMemberPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emails, setEmails] = useState<EmailEntry[]>([
    { id: crypto.randomUUID(), value: "", status: "idle" },
  ]);

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

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const validEmails = emails.filter((e) => e.value.trim() !== "");
    if (validEmails.length === 0) {
      toast.error("Please enter at least one email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send all emails in a single request
      const response = await apiClient.post("/auth/custom/register-member", {
        email: validEmails.map((entry) => entry.value.trim()),
      });

      console.log(response);
      // Handle the response structure
      if (response.data.statusCode === 201) {
        const resultMap: Record<
          string,
          { success: boolean; error?: string; userExists?: boolean }
        > = {};

        // Map results back to email entries
        response.data.data.results.forEach((result: any) => {
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
            if (!result) return entry; // wasn't submitted (empty)
            return {
              ...entry,
              status: result.success ? "success" : "error",
              error: result.error,
              userExists: result.userExists,
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
        } else if (successCount > 0 && failCount > 0) {
          toast.warning(
            `${successCount} sent, ${failCount} failed — check the highlighted emails`,
          );
        } else {
          toast.error("All invitations failed — check the highlighted emails");
        }
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to send invitations",
      );
      console.error("Error sending invitations:", error);
    } finally {
      router.push("/organization/onboarding/invite-admin");
    }

    setIsSubmitting(false);
  };

  const inputBase =
    "w-full rounded-lg border bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 transition-all disabled:opacity-50";

  const filledCount = emails.filter((e) => e.value.trim()).length;

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
            Step 3 of 4
          </p>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  s < 3
                    ? "bg-[#0D9488] w-6"
                    : s === 3
                      ? "bg-[#0D9488]/50 w-6"
                      : "bg-gray-200 w-4"
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
              Add Members
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] leading-snug mb-3">
              Bring your community in
            </h1>
            <p className="text-sm text-[#1F2937]/70 leading-relaxed">
              To add a member, all you need is their email address. If they're
              new to ReeTrack, they'll be asked to create an account. If they
              already have one, they'll simply confirm they want to join your
              organization.
            </p>

            {/* Tip */}
            <div className="mt-5 rounded-xl bg-[#0D9488]/5 border border-[#0D9488]/10 px-4 py-3">
              <p className="text-xs text-[#0D9488] leading-relaxed">
                💡 You can add multiple members at once — just enter their
                emails below.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-8 py-6 space-y-3 max-h-[300px] overflow-y-auto">
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
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0D9488] text-xs font-bold">
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
                className="flex items-center gap-1.5 text-xs font-bold text-[#0D9488] hover:text-[#0B7A70] transition-colors disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                Add another email
              </button>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-gray-100 bg-[#F9FAFB] flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  router.push("/organization/onboarding/invite-admin")
                }
                disabled={isSubmitting}
              >
                Skip for now
              </Button>

              <Button
                type="submit"
                variant="secondary"
                size="sm"
                disabled={isSubmitting || filledCount === 0}
              >
                {isSubmitting
                  ? "Sending..."
                  : filledCount > 1
                    ? `Send ${filledCount} Invitations`
                    : "Send Invitation"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
