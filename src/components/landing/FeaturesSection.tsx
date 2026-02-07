"use client";

import { Card, CardBody } from "@heroui/react";
import { CreditCard, BarChart3, Users, Zap, Shield, Bell } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: CreditCard,
    title: "Automated Billing",
    description: "Set up recurring payments and let our system handle the rest. Never miss a payment cycle again.",
    gradient: "from-primary/20 to-secondary/10",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Real-time insights into your revenue, member growth, and payment trends with beautiful visualizations.",
    gradient: "from-secondary/20 to-primary/10",
  },
  {
    icon: Users,
    title: "Member Management",
    description: "Effortlessly manage your member database, track subscriptions, and handle renewals in one place.",
    gradient: "from-success/20 to-primary/10",
  },
  {
    icon: Zap,
    title: "Payment Tracking",
    description: "Monitor all transactions in real-time with detailed payment history and automatic reconciliation.",
    gradient: "from-primary/20 to-success/10",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Bank-level encryption and PCI DSS compliance to keep your data and payments secure.",
    gradient: "from-warning/20 to-primary/10",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Automated reminders for upcoming payments, renewals, and important account updates.",
    gradient: "from-primary/20 to-warning/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-content1/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Everything you need to manage subscriptions
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Powerful features designed to streamline your membership organization's billing and payment processes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className="bg-content1/80 backdrop-blur-md border border-divider hover:border-primary/50 transition-all duration-300 group hover:scale-105"
                  isPressable
                >
                  <CardBody className="p-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/70">
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
