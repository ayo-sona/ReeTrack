"use client";

import { Card, CardBody } from "@heroui/react";
import { UserPlus, Settings, Star, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const communitySteps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description:
      "Sign up your organization in minutes. No paperwork, no lengthy setup — just the basics to get you going.",
    time: "5 min",
    color: "#F06543",
  },
  {
    number: "02",
    icon: Settings,
    title: "Set Up Your Plans",
    description:
      "Define your membership plans, billing cycles, and pricing. Exactly how your community is structured, reflected on Reetrack.",
    time: "10 min",
    color: "#0D9488",
  },
  {
    number: "03",
    icon: UserPlus,
    title: "Add Your Members",
    description:
      "Invite existing members or let new ones sign up directly. They're in your dashboard, tracked and managed from day one.",
    time: "Ongoing",
    color: "#1F2937",
  },
];

const memberSteps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Join Your Community",
    description:
      "Sign up through your gym, coworking space, or community. Your Reetrack account is created automatically.",
    time: "2 min",
    color: "#F06543",
  },
  {
    number: "02",
    icon: Star,
    title: "Show Up & Complete Challenges",
    description:
      "Check in regularly, hit milestones, and complete challenges set by your community to earn points.",
    time: "Every visit",
    color: "#0D9488",
  },
  {
    number: "03",
    icon: Trophy,
    title: "Redeem",
    description:
      "Stack up your points and redeem them at your community. The more consistent you are, the more you earn.",
    time: "Ongoing",
    color: "#1F2937",
  },
];

export function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<"communities" | "members">(
    "communities"
  );

  const steps = activeTab === "communities" ? communitySteps : memberSteps;

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-[#0D9488]/30 to-transparent" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-4 leading-tight">
            How it{" "}
            <span className="relative inline-block">
              <span className="relative z-10">works</span>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                className="absolute bottom-1 left-0 right-0 h-3 bg-[#0D9488]/20 -z-0 origin-left"
              />
            </span>
          </h2>
          <p className="text-lg text-[#1F2937]/60 max-w-2xl mx-auto leading-relaxed">
            Reetrack works for both sides — communities grow retention, members
            get rewarded for showing up.
          </p>

          {/* Tab switcher */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "9999px",
              padding: "4px",
              marginBottom: "32px",
              marginTop: "24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            {(["communities", "members"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  position: "relative",
                  padding: "8px 20px",
                  fontSize: "14px",
                  fontWeight: 500,
                  borderRadius: "9999px",
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === t ? "#0D9488" : "transparent",
                  color: activeTab === t ? "#fff" : "#6B7280",
                  transition: "all 0.25s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {t === "communities" ? "For Organizations" : "For Members"}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <div className="relative">
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-20 left-[16.66%] right-[16.66%] h-0.5 opacity-20">
                <div
                  className="h-full w-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #F06543 0%, #0D9488 50%, #1F2937 100%)",
                  }}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-8 lg:gap-6 relative">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Step Number Badge */}
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg relative"
                          style={{
                            background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                          }}
                        >
                          <span className="text-white font-bold text-sm">
                            {step.number}
                          </span>
                          <div
                            className="absolute inset-0 rounded-full opacity-40 blur-md -z-10"
                            style={{ background: step.color }}
                          />
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="bg-white border border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden mt-7">
                          <div
                            className="h-1 w-full"
                            style={{
                              background: `linear-gradient(90deg, ${step.color}, ${step.color}80)`,
                            }}
                          />

                          <CardBody className="p-8 pt-10">
                            <div className="flex flex-col items-center text-center">
                              <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative"
                                style={{
                                  background: `linear-gradient(135deg, ${step.color}15, ${step.color}08)`,
                                }}
                              >
                                <Icon
                                  className="w-7 h-7"
                                  style={{ color: step.color }}
                                />
                              </div>

                              <h3 className="text-xl font-bold text-[#1F2937] mb-3 leading-snug">
                                {step.title}
                              </h3>

                              <p className="text-[#1F2937]/60 mb-5 leading-relaxed text-sm">
                                {step.description}
                              </p>

                              <div
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border"
                                style={{
                                  background: `${step.color}08`,
                                  borderColor: `${step.color}20`,
                                }}
                              >
                                <div
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ background: step.color }}
                                />
                                <span
                                  className="text-xs font-semibold"
                                  style={{ color: step.color }}
                                >
                                  {step.time}
                                </span>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-sm text-[#1F2937]/50">
            {activeTab === "communities"
              ? "Ready to grow retention without lifting a finger?"
              : "Start earning rewards just for showing up."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}