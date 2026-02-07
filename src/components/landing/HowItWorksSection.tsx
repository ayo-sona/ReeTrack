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
  },
  {
    number: "02",
    icon: Settings,
    title: "Automate Billing",
    description: "Configure automated billing cycles, payment methods, and member notifications.",
    time: "10 min",
  },
  {
    number: "03",
    icon: LineChart,
    title: "Track & Grow",
    description: "Monitor your revenue, analyze member trends, and scale your organization effortlessly.",
    time: "Ongoing",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-background">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Get started in 3 simple steps
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            From setup to growth, we've made the process simple and intuitive.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-success opacity-30" />

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center z-10">
                    <span className="text-primary font-bold">{step.number}</span>
                  </div>

                  <Card className="bg-content1/80 backdrop-blur-md border border-divider mt-6 hover:border-primary/50 transition-all">
                    <CardBody className="p-6 pt-10">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-3">
                          {step.title}
                        </h3>
                        <p className="text-foreground/70 mb-4">
                          {step.description}
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20">
                          <span className="text-xs font-medium text-success">{step.time}</span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
