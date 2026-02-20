"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Basic",
    price: "Free",
    period: "per month",
    description: "Perfect for small organizations just getting started",
    features: [
      { text: "Basic billing automation", included: true },
      { text: "Email support", included: true },
      { text: "Standard analytics", included: true },
      { text: "Mobile app access", included: true },
      { text: "Advanced reporting", included: false },
      { text: "API access", included: false },
      { text: "Priority support", included: false },
    ],
    popular: false,
  },
  {
    name: "Gold",
    price: "$100",
    period: "per month",
    description: "For growing organizations that need more power",
    features: [
      { text: "Advanced billing automation", included: true },
      { text: "Priority email support", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Mobile app access", included: true },
      { text: "Advanced reporting", included: true },
      { text: "API access", included: true },
      { text: "Priority support", included: false },
    ],
    popular: true,
  },
  {
    name: "Platinum",
    price: "$200",
    period: "per month",
    description: "For large organizations with heavy requirements",
    features: [
      { text: "Custom billing automation", included: true },
      { text: "24/7 phone & email support", included: true },
      { text: "Custom analytics", included: true },
      { text: "Mobile app access", included: true },
      { text: "Advanced reporting", included: true },
      { text: "API access", included: true },
      { text: "Dedicated account manager", included: true },
    ],
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I change plans later?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the difference.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major cards (Visa, Mastercard, American Express) and can arrange invoicing for Enterprise customers.",
  },
  {
    question: "Does the free plan work?",
    answer:
      "Yes! The free plan is a great way to get started with ReeTrack. It has limitations on the number of members and features you can use.",
  },
];

export default function PricingPage() {
  return (
    <div
      className="min-h-screen bg-[#F9FAFB]"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <Navigation />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1F2937] mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Choose the perfect plan for your organization. No hidden fees,
              cancel anytime.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl bg-white p-8 flex flex-col ${
                  plan.popular
                    ? "border-2 border-[#0D9488] shadow-lg lg:scale-105"
                    : "border border-gray-200"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0D9488] text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                )}

                {/* Plan Info */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#1F2937] mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-[#1F2937]">
                    {plan.price}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">
                    / {plan.period}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  href="/auth/register"
                  className={`w-full text-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors mb-8 ${
                    plan.popular
                      ? "bg-[#0D9488] text-white hover:bg-[#0B7A70]"
                      : "border border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488] hover:text-white"
                  }`}
                >
                  Get Started
                </Link>

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-[#0D9488] mt-0.5 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included
                            ? "text-[#1F2937]"
                            : "text-gray-400 line-through"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-24 max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-[#1F2937] mb-8 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <h3 className="font-semibold text-[#1F2937] mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
