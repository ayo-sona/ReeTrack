"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

// Define the content keys as a type
type ContentKey = "who-we-are" | "what-we-do" | "the-problem" | "our-solution";

const AboutSection = () => {
  const [activeTab, setActiveTab] = useState<ContentKey>("who-we-are");

  const tabs = [
    {
      id: "who-we-are" as const,
      label: "Who We Are",
      color: "#0D9488",
    },
    {
      id: "what-we-do" as const,
      label: "What We Do",
      color: "#F06543",
    },
    {
      id: "the-problem" as const,
      label: "The Problem",
      color: "#0D9488",
    },
    {
      id: "our-solution" as const,
      label: "Our Solution",
      color: "#F06543",
    },
  ];

  const content: Record<ContentKey, {
    title: string;
    description: string;
    image: string;
    imagePosition: "left" | "right";
  }> = {
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
        "Automated billing cycles, intelligent payment retries, seamless integrations with Telegram and WhatsApp, and real-time analytics that actually help you grow. We give you the infrastructure of a Fortune 500 company with the simplicity your community deserves.",
      image: "/about/the_solution.webp",
      imagePosition: "right",
    },
  };

  const activeContent = content[activeTab];

  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-gray-50/30 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937] mb-3">
            Built by community builders,{" "}
            <span className="relative inline-block">
              <span className="relative z-10">for communities</span>
              {/* Soft underline accent */}
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                className="absolute bottom-0 left-0 right-0 h-2 bg-[#0D9488]/20 -z-0 origin-left"
              />
            </span>
          </h2>
        </motion.div>

        {/* Tab Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {tabs.map((tab) => (
           <button
           key={tab.id}
           onClick={() => setActiveTab(tab.id)}
           className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
             activeTab === tab.id
               ? "text-white shadow-lg scale-105"
               : "text-[#1F2937] bg-white border-2 border-gray-200"
           }`}
           style={{
             backgroundColor: activeTab === tab.id ? tab.color : "white",
             boxShadow:
               activeTab === tab.id
                 ? `0 10px 30px ${tab.color}30`
                 : undefined,
             color: activeTab === tab.id ? "white" : undefined,
           }}
           onMouseEnter={(e) => {
             if (activeTab !== tab.id) {
               e.currentTarget.style.borderColor = tab.color;
               e.currentTarget.style.color = tab.color;
             }
           }}
           onMouseLeave={(e) => {
             if (activeTab !== tab.id) {
               e.currentTarget.style.borderColor = "#e5e7eb";
               e.currentTarget.style.color = "#1F2937";
             }
           }}
         >
           {tab.label}
         </button>
          ))}
        </motion.div>

        {/* Content Area with Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={`grid md:grid-cols-2 gap-8 lg:gap-12 items-center ${
              activeContent.imagePosition === "right"
                ? "md:grid-flow-dense"
                : ""
            }`}
          >
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`relative ${
                activeContent.imagePosition === "right" ? "md:col-start-2" : ""
              }`}
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                <Image
                  src={activeContent.image}
                  alt={activeContent.title}
                  fill
                  className="object-cover"
                />
              </div>

    
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{
                opacity: 0,
                x: activeContent.imagePosition === "left" ? -20 : 20,
              }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={
                activeContent.imagePosition === "right" ? "md:col-start-1" : ""
              }
            >
              <div className="space-y-6">
                <div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "3rem" }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="h-1 rounded-full mb-6"
                    style={{
                      backgroundColor: tabs.find((t) => t.id === activeTab)
                        ?.color,
                    }}
                  />
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2937] mb-4">
                    {activeContent.title}
                  </h3>
                </div>
                <p className="text-base sm:text-lg text-[#1F2937]/70 leading-relaxed">
                  {activeContent.description}
                </p>

                {/* Optional CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="pt-4"
                >
                  <a
                    href="#pricing"
                    className="inline-flex items-center gap-2 text-[#0D9488] font-semibold hover:gap-3 transition-all"
                  >
                    Learn more
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AboutSection;