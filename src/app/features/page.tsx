"use client";

import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Card, CardBody, Button } from "@heroui/react";
import {
  CreditCard,
  BarChart3,
  Users,
  Zap,
  Shield,
  Bell,
  Globe,
  FileText,
  Smartphone,
  Clock,
  TrendingUp,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const mainFeatures = [
  {
    icon: CreditCard,
    title: "Automated Billing",
    description:
      "Set up flexible billing cycles with automated recurring payments. Support for multiple payment methods including credit cards, ACH, and digital wallets.",
    benefits: [
      "Customizable billing schedules",
      "Automatic payment retries",
      "Failed payment recovery",
      "Multiple payment gateways",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description:
      "Gain deep insights into your revenue, member growth, and payment trends with real-time analytics and beautiful visualizations.",
    benefits: [
      "Real-time revenue tracking",
      "Member growth analytics",
      "Churn prediction",
      "Custom report builder",
    ],
  },
  {
    icon: Users,
    title: "Member Management",
    description:
      "Comprehensive member database with advanced filtering, segmentation, and bulk actions to manage your community efficiently.",
    benefits: [
      "Advanced member search",
      "Custom member fields",
      "Bulk member operations",
      "Member activity tracking",
    ],
  },
  {
    icon: Zap,
    title: "Payment Tracking",
    description:
      "Monitor every transaction with detailed payment history, automatic reconciliation, and export capabilities for accounting.",
    benefits: [
      "Real-time payment updates",
      "Transaction history",
      "Reconciliation tools",
      "Export to CSV/Excel",
    ],
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description:
      "Bank-level encryption, PCI DSS compliance, and SOC 2 Type II certification to ensure your data and payments are always secure.",
    benefits: [
      "256-bit SSL encryption",
      "PCI DSS Level 1",
      "SOC 2 Type II certified",
      "GDPR compliant",
    ],
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Keep your members informed with automated email and SMS notifications for payments, renewals, and account updates.",
    benefits: [
      "Customizable email templates",
      "SMS notifications",
      "Payment reminders",
      "Renewal alerts",
    ],
  },
];

const additionalFeatures = [
  { icon: Globe, title: "Multi-currency Support" },
  { icon: FileText, title: "Invoice Generation" },
  { icon: Smartphone, title: "Mobile Apps" },
  { icon: Clock, title: "24/7 Support" },
  { icon: TrendingUp, title: "Revenue Forecasting" },
  { icon: Lock, title: "Two-factor Authentication" },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-4">
              Powerful features for
              <span className="block text-primary mt-2">
                subscription management
              </span>
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Everything you need to manage memberships, automate billing, and
              grow your organization.
            </p>
          </motion.div>

          {/* Main Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-content1/80 backdrop-blur-md border border-divider h-full hover:border-primary/50 transition-all">
                    <CardBody className="p-6">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-foreground/70 mb-4">
                        {feature.description}
                      </p>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-foreground/70"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardBody>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              And much more...
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {additionalFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="bg-content1/50 backdrop-blur-md border border-divider hover:border-primary/50 transition-all"
                  >
                    <CardBody className="p-4 flex flex-col items-center text-center gap-2">
                      <Icon className="w-6 h-6 text-primary" />
                      <span className="text-sm text-foreground font-medium">
                        {feature.title}
                      </span>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-md">
              <CardBody className="p-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Ready to get started?
                </h2>
                <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
                  Join hundreds of organizations using ReeTrack to streamline
                  their subscription management.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    as={Link}
                    href="/auth/register"
                    size="lg"
                    color="primary"
                    className="bg-primary text-primary-foreground text-lg px-8"
                  >
                    Start Free Plan
                  </Button>
                  <Button
                    as={Link}
                    href="/pricing"
                    size="lg"
                    variant="bordered"
                    className="border-foreground/20 text-foreground text-lg px-8"
                  >
                    View Pricing
                  </Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
