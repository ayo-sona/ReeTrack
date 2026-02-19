"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Is my money safe?",
      answer:
        "100%. We use bank-grade encryption and next-day settlements so your cash flow never stops. Your funds are processed through secure payment gateways with industry-leading security standards.",
    },
    {
      question: "Can I add members manually?",
      answer:
        "Yes, you control the gate!. Manual member management gives you complete flexibility over who joins your community and how.",
    },
    {
      question: "Does Reetrack handle failed payments?",
      answer:
        "Automatically. We retry cards and notify members so you don't have to play debt collector. Smart retry logic and automated notifications keep your revenue flowing smoothly.",
    },
    {
      question: "What platforms do you integrate with?",
      answer:
        "Reetrack is working on integrating seamlessly with Telegram and WhatsApp, bringing professional community management directly into the apps your members already use every day. No new platform to learn.",
    },
    {
      question: "Can I export my data?",
      answer:
        "Absolutely. Your data is yours. Export member lists, payment history, and analytics anytime. We believe in data portability and transparency—no lock-in, no hidden exports fees.",
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "Email support for all plans, priority support for Pro subscribers. Real people who actually understand community management.",
    },
  ];

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft gradient accents */}
      <div className="absolute top-20 left-[10%] w-64 h-64 bg-[#F06543]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-[#0D9488]/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-4 leading-tight">
            Frequently Asked{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Questions</span>
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
            Common questions, straight answers
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              <div
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openIndex === index
                    ? "border-[#0D9488] shadow-xl shadow-[#0D9488]/10"
                    : "border-gray-200 shadow-md hover:shadow-lg"
                }`}
              >
                {/* Question Bar */}
                <button
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  className="w-full flex items-center justify-between p-6 text-left transition-colors"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-[#1F2937] pr-4 leading-snug">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-shrink-0"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        openIndex === index
                          ? "bg-gradient-to-br from-[#0D9488] to-[#0D9488]/80"
                          : "bg-gray-100 group-hover:bg-gray-200"
                      }`}
                    >
                      {openIndex === index ? (
                        <Minus
                          className="w-5 h-5 text-white"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <Plus
                          className="w-5 h-5 text-[#1F2937]/60"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                  </motion.div>
                </button>

                {/* Answer - Smooth expansion */}
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0">
                        {/* Subtle divider */}
                        <div className="w-full h-px bg-gradient-to-r from-[#0D9488]/20 via-[#0D9488]/10 to-transparent mb-4" />
                        <p className="text-base text-[#1F2937]/70 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gray-50 to-white border border-gray-200 shadow-sm">
            <p className="text-sm text-[#1F2937]/60">
              Still have questions?{" "}
              <a
                href="#contact"
                className="font-semibold text-[#0D9488] hover:text-[#F06543] transition-colors ml-1"
              >
                Get in touch →
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
