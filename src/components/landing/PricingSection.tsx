"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PricingSection = () => {
  const router = useRouter();

  const plans = [
    {
      name: "Free",
      price: "",
      description: "For individuals or small communities just getting started",
      features: [
        { text: "Up to 20 members", included: true },
        { text: "1 staff / admin account", included: true },
        { text: "Automated welcome messages", included: true },
        { text: "Member newsletters", included: true },
        { text: "10% transaction fee", included: true },
        { text: "Check-ins & reports", included: false },
        { text: "Event announcements", included: false },
        { text: "Priority support", included: false },
      ],
      accent: "#F06543",
      popular: false,
    },
    {
      name: "Starter",
      price: "75",
      description: "For growing communities ready to unlock professional tools",
      features: [
        { text: "Unlimited members", included: true },
        { text: "3 staff / admin accounts", included: true },
        { text: "Automated welcome messages", included: true },
        { text: "Member newsletters", included: true },
        { text: "Event announcements", included: true },
        { text: "Check-ins & reports", included: true },
        { text: "7.5% transaction fee", included: true },
        { text: "Priority support", included: false },
      ],
      accent: "#6366F1",
      popular: false,
    },
    {
      name: "Growth",
      price: "140",
      description: "For established organizations scaling their community",
      features: [
        { text: "Unlimited members", included: true },
        { text: "5 staff / admin accounts", included: true },
        { text: "Broadcast scheduling", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Audit logs", included: true },
        { text: "Data import assistance", included: true },
        { text: "6% transaction fee", included: true },
        { text: "Priority support", included: true },
      ],
      accent: "#0D9488",
      popular: true,
    },
    {
      name: "Pro",
      price: "250",
      description: "For large, high-volume organizations that need full power",
      features: [
        { text: "Everything in Growth", included: true },
        { text: "10 staff / admin accounts", included: true },
        { text: "Unlimited pings / broadcasts", included: true },
        { text: "Full analytics suite & custom reports", included: true },
        { text: "SSO / Single Sign-On", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "4.5% transaction fee", included: true },
      ],
      accent: "#1F2937",
      popular: false,
    },
  ];

  return (
    <section className="relative py-24 bg-[#F9FAFB] overflow-hidden">
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-4 leading-tight">
            Simple pricing,
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">great value</span>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                className="absolute bottom-1 left-0 right-0 h-3 bg-[#F06543]/25 -z-0 origin-left"
              />
            </span>
          </h2>
          <p className="text-lg text-[#1F2937]/55 max-w-2xl mx-auto leading-relaxed">
            No hidden fees. No riddles. Just the infrastructure you need to scale.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5, type: "spring", stiffness: 200 }}
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
                  <h3 className="text-xl font-bold text-[#1F2937] mb-1">{plan.name}</h3>
                  <p className="text-xs text-[#1F2937]/55 leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-6 pb-6 border-b-2 border-[#1F2937]/10">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-[#1F2937]">
                      {plan.price === "" ? "Free" : `$${plan.price}`}
                    </span>
                    <span className="text-sm text-[#1F2937]/45 ml-2">
                      {plan.price !== "" && "/month"}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-14">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                      className="flex items-start gap-2.5"
                    >
                      {feature.included ? (
                        <div
                          className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 border border-transparent"
                          style={{ background: plan.accent }}
                        >
                          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#F9FAFB] border border-[#1F2937]/15 flex items-center justify-center mt-0.5">
                          <div className="w-1.5 h-0.5 bg-[#1F2937]/25 rounded-full" />
                        </div>
                      )}
                      <span
                        className={`text-xs leading-relaxed ${
                          feature.included ? "text-[#1F2937]" : "text-[#1F2937]/35"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "secondary" : "default"}
                  size="default"
                  className="absolute bottom-4 left-6 right-6 rounded-xl border-2 border-[#1F2937] shadow-[3px_3px_0px_#1F2937] hover:shadow-[4px_4px_0px_#1F2937] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150"
                  asChild
                >
                  <Link href="/auth/login">Get Started</Link>
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 rounded-2xl bg-[#1F2937] p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-[#1F2937] shadow-[4px_4px_0px_#F06543]"
        >
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Enterprise</h3>
            <p className="text-sm text-white/60">
              Need a fully tailored solution? Custom member caps, staff accounts, dedicated support, and a 4% transaction fee.
            </p>
          </div>
          <Button
            variant="outline"
            className="shrink-0 border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#1F2937] rounded-xl shadow-[3px_3px_0px_#F06543] hover:shadow-[4px_4px_0px_#F06543] hover:-translate-y-0.5 transition-all duration-150"
            asChild
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12 text-sm text-[#1F2937]/45"
        >
          All plans include secure payment processing, data encryption, and 99.9% uptime SLA
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;