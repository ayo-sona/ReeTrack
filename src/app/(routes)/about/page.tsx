"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CreditCard, BarChart3, Users, Zap, Shield, Bell } from "lucide-react";

type ContentKey = "who-we-are" | "what-we-do" | "the-problem" | "our-solution";

const aboutTabs = [
  { id: "who-we-are" as const, label: "Who We Are", color: "#0D9488" },
  { id: "what-we-do" as const, label: "What We Do", color: "#F06543" },
  { id: "the-problem" as const, label: "The Problem", color: "#0D9488" },
  { id: "our-solution" as const, label: "Our Solution", color: "#F06543" },
];

const aboutContent: Record<
  ContentKey,
  {
    title: string;
    description: string;
    image: string;
    imagePosition: "left" | "right";
  }
> = {
  "who-we-are": {
    title: "Built by Community Builders",
    description:
      "We're a team of community builders who got tired of juggling multiple tools and fighting with spreadsheets. We've been in the trenches, managing memberships manually, dealing with failed payments at 2 AM, and wishing for better infrastructure. So we built it.",
    image: "/about/who_we_are.webp",
    imagePosition: "right",
  },
  "what-we-do": {
    title: "Subscription Management Made Effortless",
    description:
      "We automate subscription management for communities, turning billing chaos into effortless revenue. From payment processing to member notifications, we handle the infrastructure so you can focus on building relationships, not spreadsheets.",
    image: "/about/what_we_do.webp",
    imagePosition: "left",
  },
  "the-problem": {
    title: "The Manual Membership Nightmare",
    description:
      "Communities waste countless hours on manual billing, chasing failed payments, and tracking members across scattered tools. Instead of building meaningful connections and growing their impact, founders are stuck playing accountant, dealing with payment processors, and managing spreadsheets.",
    image: "/about/the_problem.webp",
    imagePosition: "left",
  },
  "our-solution": {
    title: "Infrastructure That Just Works",
    description:
      "Automated billing cycles, intelligent payment retries, and real-time analytics that actually help you grow. We give you the infrastructure of a Fortune 500 company with the simplicity your community deserves.",
    image: "/about/the_solution.webp",
    imagePosition: "right",
  },
};

const featureTabs = [
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

export default function AboutPage() {
  const [activeAboutTab, setActiveAboutTab] = useState<ContentKey>("who-we-are");
  const [activeFeatureTab, setActiveFeatureTab] = useState(featureTabs[0].id);

  const activeAboutContent = aboutContent[activeAboutTab];
  const activeAboutColor = aboutTabs.find((t) => t.id === activeAboutTab)?.color ?? "#0D9488";
  const activeFeature = featureTabs.find((t) => t.id === activeFeatureTab)!;
  const FeatureIcon = activeFeature.icon;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-10" style={{ fontFamily: "Nunito, sans-serif" }}>
      <Navigation />

      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-4xl mx-auto relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold tracking-widest uppercase text-[#0D9488] mb-4">
              About ReeTrack
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] leading-tight mb-6">
              Built by community builders,{" "}
              <span className="relative inline-block">
                <span className="relative z-10">for communities</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                  className="absolute bottom-1 left-0 right-0 h-3 bg-[#F06543]/25 -z-0 origin-left"
                />
              </span>
            </h1>
            <p className="text-lg text-[#1F2937]/60 max-w-2xl mx-auto leading-relaxed">
              We got tired of juggling multiple tools and fighting with spreadsheets. So we built the platform we always needed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Tabs Section */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {aboutTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAboutTab(tab.id)}
                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 border-2 ${
                  activeAboutTab === tab.id
                    ? "scale-105 text-white border-transparent"
                    : "bg-white border-[#E5E7EB] text-[#1F2937] hover:border-[#1F2937]/30"
                }`}
                style={{
                  backgroundColor: activeAboutTab === tab.id ? tab.color : undefined,
                  boxShadow:
                    activeAboutTab === tab.id
                      ? `4px 4px 0px rgba(31,41,55,0.15)`
                      : undefined,
                }}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeAboutTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={`grid md:grid-cols-2 gap-12 lg:gap-16 items-center ${
                activeAboutContent.imagePosition === "right" ? "md:grid-flow-dense" : ""
              }`}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`relative ${
                  activeAboutContent.imagePosition === "right" ? "md:col-start-2" : ""
                }`}
              >
                <div
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#1F2937]"
                  style={{ boxShadow: "6px 6px 0px rgba(31,41,55,1)" }}
                >
                  <Image
                    src={activeAboutContent.image}
                    alt={activeAboutContent.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{
                  opacity: 0,
                  x: activeAboutContent.imagePosition === "left" ? -20 : 20,
                }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className={activeAboutContent.imagePosition === "right" ? "md:col-start-1" : ""}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "3rem" }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="h-1 rounded-full mb-6"
                  style={{ backgroundColor: activeAboutColor }}
                />
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2937] mb-5 leading-tight">
                  {activeAboutContent.title}
                </h3>
                <p className="text-base text-[#1F2937]/65 leading-relaxed">
                  {activeAboutContent.description}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Features Tab Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold tracking-widest uppercase text-[#0D9488] mb-4">
              What we offer
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2937] leading-tight">
              Everything your community
              <span className="block text-[#0D9488] mt-1">needs to thrive</span>
            </h2>
            <p className="mt-4 text-base text-gray-500 max-w-xl mx-auto">
              Six powerful features. One platform. No spreadsheets.
            </p>
          </motion.div>

          {/* Feature Tab Bar */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10">
            {featureTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeFeatureTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFeatureTab(tab.id)}
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

          {/* Feature Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeatureTab}
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
                      style={{ backgroundColor: activeFeature.accent }}
                    />
                    <p
                      className="text-xs sm:text-sm font-semibold mb-1"
                      style={{ color: activeFeature.accent }}
                    >
                      {activeFeature.subtitle}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mb-3 sm:mb-4">
                      {activeFeature.title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-6 sm:mb-8">
                      {activeFeature.description}
                    </p>
                    <ul className="space-y-2 sm:space-y-2.5">
                      {activeFeature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-[#1F2937]">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${activeFeature.accent}15` }}
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: activeFeature.accent }}
                            />
                          </div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8 sm:mt-10">
                    <Button asChild variant="secondary" size="default">
                      <Link href="/auth/register">Get started free</Link>
                    </Button>
                  </div>
                </div>

                {/* Right — Visual (desktop) */}
                <div
                  className="hidden lg:flex flex-col items-center justify-center p-12 relative overflow-hidden"
                  style={{ backgroundColor: `${activeFeature.accent}08` }}
                >
                  <div
                    className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-10"
                    style={{ backgroundColor: activeFeature.accent }}
                  />
                  <div
                    className="absolute -top-8 -left-8 w-40 h-40 rounded-full opacity-5"
                    style={{ backgroundColor: activeFeature.accent }}
                  />
                  <div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8 relative z-10"
                    style={{ backgroundColor: `${activeFeature.accent}15` }}
                  >
                    <FeatureIcon className="w-12 h-12" style={{ color: activeFeature.accent }} />
                  </div>
                  <div className="text-center relative z-10">
                    <p className="text-6xl font-extrabold" style={{ color: activeFeature.accent }}>
                      {activeFeature.stat.value}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                      {activeFeature.stat.label}
                    </p>
                  </div>
                </div>

                {/* Mobile stat strip */}
                <div
                  className="lg:hidden flex items-center gap-4 px-6 py-4 border-t border-gray-100"
                  style={{ backgroundColor: `${activeFeature.accent}08` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${activeFeature.accent}15` }}
                  >
                    <FeatureIcon className="w-5 h-5" style={{ color: activeFeature.accent }} />
                  </div>
                  <div>
                    <p className="text-xl font-extrabold" style={{ color: activeFeature.accent }}>
                      {activeFeature.stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{activeFeature.stat.label}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-[#1F2937] border-2 border-[#1F2937] shadow-[4px_4px_0px_#F06543] px-6 sm:px-8 py-10 sm:py-14 text-center"
          >
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
              Ready to simplify your community management?
            </h2>
            <p className="text-white/70 text-sm mb-6 sm:mb-8 max-w-lg mx-auto">
              Join hundreds of organizations using ReeTrack to automate billing and grow faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="border-2 border-white text-[#1F2937] bg-white hover:bg-white/90 rounded-xl shadow-[3px_3px_0px_#F06543] hover:-translate-y-0.5 transition-all duration-150"
              >
                <Link href="/auth/register">Get started free</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-white text-white bg-transparent hover:bg-white/10 hover:text-white rounded-xl transition-all duration-150"
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