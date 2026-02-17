"use client";

import { Card, CardBody } from "@heroui/react";
import { UserPlus, Settings, LineChart } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Setup Your Organization",
    description: "Create your account and customize your organization's subscription plans in minutes.",
    time: "5 min",
    color: "#F06543",
  },
  {
    number: "02",
    icon: Settings,
    title: "Automate Billing",
    description: "Configure automated billing cycles, payment methods, and member notifications.",
    time: "10 min",
    color: "#0D9488",
  },
  {
    number: "03",
    icon: LineChart,
    title: "Track & Grow",
    description: "Monitor your revenue, analyze member trends, and scale your organization effortlessly.",
    time: "Ongoing",
    color: "#1F2937",
  },
];

export function HowItWorksSection() {
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
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-4 leading-tight">
            Get started in{" "}
            <span className="relative inline-block">
              <span className="relative z-10">3 simple steps</span>
              {/* Soft underline accent */}
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
            From setup to growth, we&apos;ve made the process simple and intuitive.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line - Gradient flow */}
          <div className="hidden lg:block absolute top-20 left-[16.66%] right-[16.66%] h-0.5 opacity-20">
            <div 
              className="h-full w-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #F06543 0%, #0D9488 50%, #1F2937 100%)',
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
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Step Number Badge - Floating above */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.15 + 0.3,
                      type: "spring",
                      stiffness: 200
                    }}
                    className="absolute -top-5 left-1/2 -translate-x-1/2 z-20"
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg relative"
                      style={{
                        background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                      }}
                    >
                      <span className="text-white font-bold text-sm">{step.number}</span>
                      {/* Glow effect */}
                      <div 
                        className="absolute inset-0 rounded-full opacity-40 blur-md -z-10"
                        style={{ background: step.color }}
                      />
                    </div>
                  </motion.div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-white backdrop-blur-sm border border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden mt-7">
                      {/* Top accent bar */}
                      <div 
                        className="h-1 w-full"
                        style={{
                          background: `linear-gradient(90deg, ${step.color}, ${step.color}80)`,
                        }}
                      />
                      
                      <CardBody className="p-8 pt-10">
                        <div className="flex flex-col items-center text-center">
                          {/* Icon container */}
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

                          {/* Title */}
                          <h3 className="text-xl font-bold text-[#1F2937] mb-3 leading-snug">
                            {step.title}
                          </h3>

                          {/* Description */}
                          <p className="text-[#1F2937]/60 mb-5 leading-relaxed text-sm">
                            {step.description}
                          </p>

                          {/* Time badge */}
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

        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-sm text-[#1F2937]/50">
            Ready to transform your organization&apos;s subscription management?
          </p>
        </motion.div>
      </div>
    </section>
  );
}