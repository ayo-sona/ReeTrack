"use client";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="relative py-24 bg-white overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft gradient accents */}
      <div className="absolute top-20 right-[10%] w-64 h-64 bg-[#0D9488]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-[15%] w-80 h-80 bg-[#F06543]/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-4 leading-tight">
            Ready to{" "}
            <span className="relative inline-block">
              <span className="relative z-10">transform</span>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                className="absolute bottom-1 left-0 right-0 h-3 bg-[#F06543]/20 -z-0 origin-left"
              />
            </span>{" "}
            your community?
          </h2>
          <p className="text-lg text-[#1F2937]/60 max-w-2xl mx-auto leading-relaxed">
            Let&apos;s discuss how Reetrack can help you automate billing, grow
            your membership, and focus on what matters most.
          </p>
        </motion.div>

        {/* Contact Options Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: MessageSquare,
              title: "Quick Questions",
              description: "Get answers from our team in minutes",
              color: "#F06543",
            },
            {
              icon: Calendar,
              title: "Schedule a Demo",
              description: "See Reetrack in action with a walkthrough",
              color: "#0D9488",
            },
            {
              icon: Mail,
              title: "Custom Solutions",
              description: "Discuss enterprise plans and integrations",
              color: "#1F2937",
            },
          ].map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 p-6 h-full">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${option.color}15, ${option.color}08)`,
                    }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: option.color }}
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-[#1F2937] mb-2">
                    {option.title}
                  </h3>
                  <p className="text-sm text-[#1F2937]/60 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-[#0D9488] to-[#0B7A70] rounded-3xl p-8 sm:p-12 text-center shadow-2xl border border-[#0D9488]/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#F06543]/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6"
              >
                <MessageSquare className="w-8 h-8 text-white" strokeWidth={2} />
              </motion.div>

              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Let&apos;s Talk
              </h3>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Whether you have questions, need a demo, or want to discuss
                custom solutions.
                <br />
                We&apos;re here to help you succeed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-white text-[#0D9488] hover:bg-white/95 font-bold shadow-xl hover:shadow-2xl transition-all"
                  asChild
                >
                  <a href="/contact">
                    Get in Touch
                    <ArrowRight className="w-5 h-5 ml-2" strokeWidth={2.5} />
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0D9488] font-bold"
                  asChild
                >
                  <a href="mailto:reetrack.inc@gmail.com">Email Us Directly</a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;