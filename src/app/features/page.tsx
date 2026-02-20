"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { CreditCard, BarChart3, Users, Zap, Shield, Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    title: "Automated Billing",
    subtitle: "Set it once, collect forever",
    description:
      "Stop chasing payments manually. Set up flexible billing cycles and let ReeTrack handle the rest — retries, receipts, and reconciliation included.",
    benefits: [
      "Customizable billing schedules",
      "Automatic payment retries",
      "Failed payment recovery",
      "Multiple payment gateways",
    ],
    accent: "#0D9488",
    stat: { value: "98%", label: "payment success rate" },
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    title: "Analytics & Reporting",
    subtitle: "Know your numbers, grow your community",
    description:
      "Real-time dashboards that tell you what's working and what isn't. Track revenue, monitor churn, and make decisions backed by data.",
    benefits: [
      "Real-time revenue tracking",
      "Member growth analytics",
      "Churn prediction",
      "Custom report builder",
    ],
    accent: "#F06543",
    stat: { value: "3×", label: "faster reporting" },
  },
  {
    id: "members",
    label: "Members",
    icon: Users,
    title: "Member Management",
    subtitle: "Your entire community, one place",
    description:
      "A powerful member database with filtering, segmentation, and bulk actions. Spend less time managing spreadsheets and more time building community.",
    benefits: [
      "Advanced member search",
      "Custom member fields",
      "Bulk member operations",
      "Member activity tracking",
    ],
    accent: "#0D9488",
    stat: { value: "10×", label: "faster than spreadsheets" },
  },
  {
    id: "payments",
    label: "Payments",
    icon: Zap,
    title: "Payment Tracking",
    subtitle: "Every naira accounted for",
    description:
      "Monitor every transaction in real time. Full payment history, automatic reconciliation, and one-click exports for your accountant.",
    benefits: [
      "Real-time payment updates",
      "Full transaction history",
      "Reconciliation tools",
      "Export to CSV/Excel",
    ],
    accent: "#F06543",
    stat: { value: "100%", label: "transaction visibility" },
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    title: "Security & Compliance",
    subtitle: "Bank-grade protection, always on",
    description:
      "Your members trust you with their data. We make sure that trust is never broken — with encryption, compliance, and proactive monitoring.",
    benefits: [
      "256-bit SSL encryption",
      "PCI DSS Level 1",
      "SOC 2 Type II certified",
      "GDPR compliant",
    ],
    accent: "#0D9488",
    stat: { value: "0", label: "breaches to date" },
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    title: "Smart Notifications",
    subtitle: "Right message, right time",
    description:
      "Automated emails and SMS that keep your members informed — payment confirmations, renewal reminders, and everything in between.",
    benefits: [
      "Customizable email templates",
      "SMS notifications",
      "Payment reminders",
      "Renewal alerts",
    ],
    accent: "#F06543",
    stat: { value: "40%", label: "fewer missed renewals" },
  },
];

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const active = tabs.find((t) => t.id === activeTab)!;
  const Icon = active.icon;

  return (
    <div
      className="min-h-screen bg-[#F9FAFB]"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <Navigation />

      {/* Hero */}
      <section className="pt-32 sm:pt-44 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2937] leading-tight"
          >
            Everything your community
            <span className="block text-[#0D9488] mt-1">needs to thrive</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-base sm:text-lg text-gray-500 max-w-xl mx-auto"
          >
            Six powerful features. One platform. No spreadsheets.
          </motion.p>
        </div>
      </section>

      {/* Tab Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">
        <div className="max-w-6xl mx-auto">

          {/* Tab Bar */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold border-2 transition-all duration-300 ${
                    isActive
                      ? "text-white scale-105 border-transparent"
                      : "bg-white text-[#1F2937] border-gray-200 hover:border-gray-300"
                  }`}
                  style={{
                    backgroundColor: isActive ? tab.accent : undefined,
                    boxShadow: isActive ? `0 8px 24px ${tab.accent}30` : undefined,
                  }}
                >
                  <TabIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 overflow-hidden"
            >
              <div className="grid lg:grid-cols-2">

                {/* Left — Content */}
                <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-between">
                  <div>
                    <div
                      className="w-10 h-1 rounded-full mb-5"
                      style={{ backgroundColor: active.accent }}
                    />
                    <p
                      className="text-xs sm:text-sm font-semibold mb-1"
                      style={{ color: active.accent }}
                    >
                      {active.subtitle}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mb-3 sm:mb-4">
                      {active.title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-6 sm:mb-8">
                      {active.description}
                    </p>

                    {/* Benefits */}
                    <ul className="space-y-2 sm:space-y-2.5">
                      {active.benefits.map((benefit, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-3 text-sm text-[#1F2937]"
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${active.accent}15` }}
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: active.accent }}
                            />
                          </div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="mt-8 sm:mt-10">
                    <Button asChild variant="secondary" size="default">
                      <Link href="/auth/register">Get started free</Link>
                    </Button>
                  </div>
                </div>

                {/* Right — Visual (hidden on mobile, shown on lg+) */}
                <div
                  className="hidden lg:flex flex-col items-center justify-center p-12 relative overflow-hidden"
                  style={{ backgroundColor: `${active.accent}08` }}
                >
                  <div
                    className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-10"
                    style={{ backgroundColor: active.accent }}
                  />
                  <div
                    className="absolute -top-8 -left-8 w-40 h-40 rounded-full opacity-5"
                    style={{ backgroundColor: active.accent }}
                  />

                  <div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8 relative z-10"
                    style={{ backgroundColor: `${active.accent}15` }}
                  >
                    <Icon className="w-12 h-12" style={{ color: active.accent }} />
                  </div>

                  <div className="text-center relative z-10">
                    <p
                      className="text-6xl font-extrabold"
                      style={{ color: active.accent }}
                    >
                      {active.stat.value}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                      {active.stat.label}
                    </p>
                  </div>
                </div>

                {/* Mobile stat strip — shown only on small screens */}
                <div
                  className="lg:hidden flex items-center gap-4 px-6 py-4 border-t border-gray-100"
                  style={{ backgroundColor: `${active.accent}08` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${active.accent}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: active.accent }} />
                  </div>
                  <div>
                    <p className="text-xl font-extrabold" style={{ color: active.accent }}>
                      {active.stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{active.stat.label}</p>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 sm:mt-8 rounded-2xl bg-[#0D9488] px-6 sm:px-8 py-10 sm:py-14 text-center"
          >
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
              Ready to simplify your community management?
            </h2>
            <p className="text-white/70 text-sm mb-6 sm:mb-8 max-w-lg mx-auto">
              Join hundreds of organizations using ReeTrack to automate billing and grow faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="default" size="lg">
                <Link href="/auth/register">Start for free</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/pricing">See pricing</Link>
              </Button>
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  );
}