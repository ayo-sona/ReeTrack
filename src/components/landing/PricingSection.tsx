"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      price: "49",
      description: "For growing communities",
      features: [
        { text: "Up to 100 members", included: true },
        { text: "Basic analytics", included: true },
        { text: "Payment processing", included: true },
        { text: "Email support", included: true },
        { text: "Custom branding", included: false },
        { text: "Priority support", included: false },
      ],
      accent: "#F06543",
      popular: false,
    },
    {
      name: "Pro Engine",
      price: "149",
      description: "For serious communities",
      features: [
        { text: "Unlimited members", included: true },
        { text: "Advanced analytics & CRM", included: true },
        { text: "Global payment methods", included: true },
        { text: "Priority support", included: true },
        { text: "Custom branding", included: true },
        { text: "Telegram & WhatsApp integration", included: true },
      ],
      accent: "#0D9488",
      popular: true,
    },
    {
      name: "Custom",
      price: "Let's talk",
      description: "For organizations at scale",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "Custom integrations", included: true },
        { text: "White-label options", included: true },
        { text: "Custom SLA", included: true },
        { text: "On-site training", included: true },
      ],
      accent: "#1F2937",
      popular: false,
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

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-4 leading-tight">
            Simple pricing
            <br />{" "}
            <span className="relative inline-block">
              <span className="relative z-10">great value</span>
              {/* Soft underline accent */}
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                className="absolute bottom-1 left-0 right-0 h-3 bg-[#F06543]/20 -z-0 origin-left"
              />
            </span>
          </h2>
          <p className="text-lg text-[#1F2937]/60 max-w-2xl mx-auto leading-relaxed">
            No hidden fees. No riddles. Just the infrastructure you need to
            scale.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: 0.5,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="bg-gradient-to-r from-[#0D9488] to-[#0D9488]/90 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg"
                  >
                    Most Popular
                  </motion.div>
                </div>
              )}

              {/* Card */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className={`relative h-full bg-white rounded-2xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? "border-2 border-[#0D9488] shadow-xl shadow-[#0D9488]/10"
                    : "border border-gray-200 shadow-lg hover:shadow-xl"
                }`}
              >
                {/* Accent line at top */}
                <div
                  className="absolute top-0 left-8 right-8 h-1 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${plan.accent}, ${plan.accent}80)`,
                  }}
                />

                {/* Plan Name */}
                <div className="mb-6 mt-2">
                  <h3 className="text-2xl font-bold text-[#1F2937] mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-[#1F2937]/60 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8 pb-8 border-b border-gray-100">
                  {typeof plan.price === "string" &&
                  plan.price.includes("talk") ? (
                    <div className="text-3xl font-bold text-[#1F2937]">
                      {plan.price}
                    </div>
                  ) : (
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold text-[#1F2937]">
                        ${plan.price}
                      </span>
                      <span className="text-lg text-[#1F2937]/50 ml-2">
                        /month
                      </span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      {feature.included ? (
                        <div
                          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                          style={{
                            background: `linear-gradient(135deg, ${plan.accent}, ${plan.accent}dd)`,
                          }}
                        >
                          <Check
                            className="w-3 h-3 text-white"
                            strokeWidth={3}
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                          <div className="w-2 h-0.5 bg-gray-300 rounded-full" />
                        </div>
                      )}
                      <span
                        className={`text-sm leading-relaxed ${
                          feature.included
                            ? "text-[#1F2937]"
                            : "text-[#1F2937]/40"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  variant={
                    plan.popular
                      ? "secondary"
                      : plan.name === "Custom"
                        ? "outline"
                        : "default"
                  }
                  size="lg"
                  className="w-full"
                >
                  {plan.name === "Custom" ? "Contact Sales" : "Get Started"}
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Optional: Trust indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12 text-sm text-[#1F2937]/50"
        >
          All plans include secure payment processing and 99.9% uptime SLA
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
