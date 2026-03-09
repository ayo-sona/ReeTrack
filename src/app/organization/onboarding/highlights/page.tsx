"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const HIGHLIGHTS = [
  {
    title: "Live Analytics",
    description:
      "Track revenue, active subscriptions, churn, and member activity in real time — all from your dashboard.",
  },
  {
    title: "Reports & Exports",
    description:
      "Download detailed reports in Excel format — members, payments, revenue, and plans whenever you need them.",
  },
  {
    title: "Member Messaging",
    description:
      "Send messages directly to your members from the dashboard. Keep them informed, engaged, and coming back.",
  },
  {
    title: "Complete Your Profile",
    description:
      "Head to Settings to add your organization's website, address, social media links, and other details your members will see.",
  },
];

export default function OnboardingHighlightsPage() {
  const router = useRouter();

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
            All done
          </p>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className="h-1.5 w-6 rounded-full bg-[#0D9488] transition-all duration-500"
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
              What's waiting for you
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] leading-snug mb-3">
              You're all set 🎉
            </h1>
            <p className="text-sm text-[#1F2937]/70 leading-relaxed">
              Your organization is ready. Here's a quick look at what's available
              on your dashboard as your community grows.
            </p>
          </div>

          {/* Highlights */}
          <div className="px-8 py-6 space-y-3">
            {HIGHLIGHTS.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + i * 0.08 }}
                className="rounded-xl border border-gray-100 bg-[#F9FAFB] px-5 py-4"
              >
                <p className="text-sm font-bold text-[#1F2937] mb-1">{h.title}</p>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">{h.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-100 bg-[#F9FAFB] flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.push("/organization/onboarding/invite-admin")}
            >
              ← Back
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => router.push("/organization/dashboard")}
            >
              Go to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}