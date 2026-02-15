"use client";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

const FinalCTASection = () => {
  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-br from-[#0D9488] via-[#0D9488] to-[#0B7A70] overflow-hidden">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-20 left-[10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-[15%] w-80 h-80 bg-[#F06543]/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Floating images in different shapes - Bigger & Randomized */}
      
      {/* Large circular image - top left */}
      <motion.div
        className="absolute top-16 left-[6%] w-32 h-32 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img
          src="/CTA/CTA1.jpg"
          alt="Community member"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Medium rounded square - top right */}
      <motion.div
        className="absolute top-24 right-[8%] w-28 h-28 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl"
        animate={{
          y: [0, -20, 0],
          rotate: [8, 15, 8],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <img
          src="/CTA/CTA2.jpg"
          alt="Team collaboration"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Tall tilted rectangle - middle left */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 left-[4%] w-28 h-40 sm:w-36 sm:h-52 lg:w-40 lg:h-60 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl rotate-[-12deg]"
        animate={{
          y: [0, 12, 0],
          rotate: [-12, -8, -12],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <img
          src="/CTA/CTA3.jpg"
          alt="Community growth"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Small circular image - middle right */}
      <motion.div
        className="absolute top-[35%] right-[5%] w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl"
        animate={{
          y: [0, 18, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <img
          src="/CTA/CTA4.jpg"
          alt="Success story"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Large rounded square - bottom left */}
      <motion.div
        className="absolute bottom-28 left-[10%] w-36 h-36 sm:w-48 sm:h-48 lg:w-52 lg:h-52 rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl rotate-[10deg]"
        animate={{
          y: [0, -12, 0],
          rotate: [10, 16, 10],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <img
          src="/CTA/CTA5.jpg"
          alt="Platform feature"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Wide tilted rectangle - bottom right */}
      <motion.div
        className="absolute bottom-20 right-[7%] w-40 h-28 sm:w-52 sm:h-36 lg:w-60 lg:h-40 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl rotate-[15deg]"
        animate={{
          y: [0, -10, 0],
          rotate: [15, 10, 15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5,
        }}
      >
        <img
          src="/CTA/CTA6.jpg"
          alt="Analytics dashboard"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="max-w-5xl mx-auto px-6 relative text-center">
        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Ready to build a{" "}
          <span className="relative inline-block">
            <span className="relative z-10">community</span>
            {/* Soft highlight underline */}
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="absolute bottom-2 left-0 right-0 h-4 bg-[#F06543]/40 -z-0 origin-left blur-sm"
            />
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
              className="absolute bottom-2 left-0 right-0 h-3 bg-[#F06543]/60 -z-0 origin-left"
            />
          </span>{" "}
          that thrives?
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Stop managing spreadsheets. Start building meaningful connections with the infrastructure that scales.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mb-12"
        >
          <Button
            size="lg"
            className="group bg-white text-[#1F2937] hover:bg-white/95 text-lg sm:text-xl font-bold py-7 px-10 sm:px-14 h-auto shadow-2xl hover:shadow-[#F06543]/20 transition-all duration-300"
          >
            Start Your Free Trial
            <motion.div
              className="inline-block ml-2"
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
            </motion.div>
          </Button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 sm:gap-8 text-white/90 mb-16"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
            <span className="text-sm sm:text-base font-semibold">No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
            <span className="text-sm sm:text-base font-semibold">14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
            <span className="text-sm sm:text-base font-semibold">Cancel anytime</span>
          </div>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          {[
            {
              icon: Shield,
              title: "Bank-grade Security",
              description: "Your data is protected with enterprise-level encryption",
            },
            {
              icon: Zap,
              title: "Lightning Setup",
              description: "Get started in minutes, not hours or days",
            },
            {
              icon: Users,
              title: "Scale Effortlessly",
              description: "From 10 to 10,000 members without breaking a sweat",
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 mx-auto">
                  <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-white font-bold text-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;