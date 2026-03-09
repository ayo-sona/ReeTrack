"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Check } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { formatCurrency } from "@/lib/formatters";

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    description: "For individuals or small communities just getting started",
    features: [
      { text: "Unlimited members", included: true },
      { text: "1 staff / admin account", included: true },
      { text: "1 membership plan", included: true },
      { text: "8% transaction fee", included: true },
      { text: "Payment history", included: true },
      { text: "Invoice generation", included: true },
      { text: "Analytics", included: true },
      { text: "Member check-ins", included: false },
      { text: "Reports", included: false },
      { text: "Member notifications", included: false },
      { text: "Priority support", included: false },
    ],
    accent: "#F06543",
    popular: false,
  },
  {
    name: "Starter",
    monthlyPrice: 50000,
    description: "For growing communities ready to unlock professional tools",
    features: [
      { text: "Unlimited members", included: true },
      { text: "3 staff / admin accounts", included: true },
      { text: "3 membership plans", included: true },
      { text: "7% transaction fee", included: true },
      { text: "Payment history", included: true },
      { text: "Invoice generation", included: true },
      { text: "Analytics", included: true },
      { text: "Member check-ins", included: true },
      { text: "10 reports / month", included: true },
      { text: "100 notifications / month", included: true },
      { text: "Priority support", included: false },
    ],
    accent: "#6366F1",
    popular: false,
  },
  {
    name: "Growth",
    monthlyPrice: 80000,
    description: "For established organizations scaling their community",
    features: [
      { text: "Unlimited members", included: true },
      { text: "5 staff / admin accounts", included: true },
      { text: "5 membership plans", included: true },
      { text: "6% transaction fee", included: true },
      { text: "Payment history", included: true },
      { text: "Invoice generation", included: true },
      { text: "Analytics", included: true },
      { text: "Member check-ins", included: true },
      { text: "Unlimited reports", included: true },
      { text: "Unlimited notifications", included: true },
      { text: "Notification scheduling", included: true },
      { text: "Priority support", included: true },
    ],
    accent: "#0D9488",
    popular: true,
  },
  {
    name: "Pro",
    monthlyPrice: 120000,
    description: "For large, high-volume organizations that need full power",
    features: [
      { text: "Unlimited members", included: true },
      { text: "10 staff / admin accounts", included: true },
      { text: "Unlimited membership plans", included: true },
      { text: "5% transaction fee", included: true },
      { text: "Payment history", included: true },
      { text: "Invoice generation", included: true },
      { text: "Analytics", included: true },
      { text: "Member check-ins", included: true },
      { text: "Unlimited reports", included: true },
      { text: "Unlimited broadcasts", included: true },
      { text: "Notification scheduling", included: true },
      { text: "Priority support", included: true },
    ],
    accent: "#1F2937",
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
    question: "Does the free plan work for real communities?",
    answer:
      "Absolutely. The free plan supports unlimited members with core tools included — no credit card required. It's a great way to get started before committing.",
  },
  {
    question: "Is there an Enterprise plan?",
    answer:
      "Yes. For large institutions and networks that need custom member caps, staff accounts, and dedicated support, we offer a fully tailored Enterprise plan with a 4% transaction fee. Contact us to discuss.",
  },
  {
    question: "How does annual billing work?",
    answer:
      "When you choose annual billing, you're charged for 12 months upfront at a 15% discount. You can still cancel at any time and we'll refund any unused months.",
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const getPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return null;
    return isAnnual ? (monthlyPrice * 0.85).toFixed(2) : monthlyPrice;
  };

  return (
    <div
      className="min-h-screen bg-[#F9FAFB] pt-10"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <Navigation />

      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-4 leading-tight">
              Simple pricing,
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">great value</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                  className="absolute bottom-1 left-0 right-0 h-3 bg-[#F06543]/25 -z-0 origin-left"
                />
              </span>
            </h1>
            <p className="text-lg text-[#1F2937]/55 max-w-2xl mx-auto leading-relaxed">
              No hidden fees. No riddles. Just the infrastructure you need to
              scale.
            </p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span
                className={`text-sm font-semibold ${!isAnnual ? "text-[#1F2937]" : "text-[#1F2937]/40"}`}
              >
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-14 h-7 rounded-full border-2 border-[#1F2937] transition-colors duration-200 ${
                  isAnnual ? "bg-[#0D9488]" : "bg-white"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-[#1F2937] rounded-full shadow transition-transform duration-200 ${
                    isAnnual ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-sm font-semibold ${isAnnual ? "text-[#1F2937]" : "text-[#1F2937]/40"}`}
              >
                Annual
                <span className="ml-2 inline-block bg-[#0D9488]/10 text-[#0D9488] text-xs font-bold px-2 py-0.5 rounded-full">
                  Save 15%
                </span>
              </span>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {plans.map((plan, index) => {
              const price = getPrice(plan.monthlyPrice);
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.5,
                          type: "spring",
                          stiffness: 200,
                        }}
                        className="bg-[#0D9488] text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-[2px_2px_0px_#1F2937] whitespace-nowrap"
                      >
                        Most Popular
                      </motion.div>
                    </div>
                  )}

                  <motion.div
                    whileHover={{ y: -4, x: -2 }}
                    transition={{ duration: 0.2 }}
                    className={`relative h-full bg-white rounded-2xl p-6 transition-all duration-300 ${
                      plan.popular
                        ? "border-2 border-[#1F2937] shadow-[4px_4px_0px_#0D9488]"
                        : "border-2 border-[#1F2937] shadow-[4px_4px_0px_#1F2937] hover:shadow-[6px_6px_0px_#1F2937]"
                    }`}
                  >
                    {/* Accent line */}
                    <div
                      className="absolute top-0 left-6 right-6 h-1 rounded-full"
                      style={{ background: plan.accent }}
                    />

                    <div className="mb-5 mt-2">
                      <h3 className="text-xl font-bold text-[#1F2937] mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-[#1F2937]/55 leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    <div className="mb-6 pb-6 border-b-2 border-[#1F2937]/10">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-[#1F2937]">
                          {price === null
                            ? "Free"
                            : formatCurrency(Number(price))}
                        </span>
                        {price !== null && (
                          <span className="text-sm text-[#1F2937]/45">
                            /month
                          </span>
                        )}
                      </div>
                      {isAnnual && price !== null && (
                        <p className="text-xs text-[#0D9488] font-semibold mt-1">
                          Billed annually — save 15%
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-14">
                      {plan.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                          className="flex items-start gap-2.5"
                        >
                          {feature.included ? (
                            <div
                              className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                              style={{ background: plan.accent }}
                            >
                              <Check
                                className="w-2.5 h-2.5 text-white"
                                strokeWidth={3}
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#F9FAFB] border border-[#1F2937]/15 flex items-center justify-center mt-0.5">
                              <div className="w-1.5 h-0.5 bg-[#1F2937]/25 rounded-full" />
                            </div>
                          )}
                          <span
                            className={`text-xs leading-relaxed ${
                              feature.included
                                ? "text-[#1F2937]"
                                : "text-[#1F2937]/35"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      variant={plan.popular ? "secondary" : "default"}
                      size="default"
                      className="absolute bottom-4 left-6 right-6 rounded-xl border-2 border-[#1F2937] shadow-[3px_3px_0px_#1F2937] hover:shadow-[4px_4px_0px_#1F2937] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150"
                      asChild
                    >
                      <Link href="/auth/register">Get Started</Link>
                    </Button>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center mt-12 text-sm text-[#1F2937]/45"
          >
            All plans include secure payment processing, data encryption, and
            99.9% uptime SLA
          </motion.p>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-24 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-[#1F2937] mb-8 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + idx * 0.05 }}
                  className="bg-white rounded-2xl border-2 border-[#1F2937] shadow-[3px_3px_0px_#1F2937] p-6"
                >
                  <h3 className="font-bold text-[#1F2937] mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-[#1F2937]/55 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
