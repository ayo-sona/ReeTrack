"use client";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import InfiniteMenu from "@/components/effects/infiniteMenu";
import { useRouter } from "next/navigation";

const EnhancedCTASection = () => {
  const router = useRouter();
  // Items for the 3D sphere - using CTA images
  const sphereItems = [
    {
      image: "/CTA/CTA1.jpg",
      link: "#",
      title: "Unite & Grow",
      description: "Build authentic connections that last",
    },
    {
      image: "/CTA/CTA2.jpg",
      link: "#",
      title: "Team Power",
      description: "Collaborate like never before",
    },
    {
      image: "/CTA/CTA3.jpg",
      link: "#",
      title: "Scale Smart",
      description: "From startup to enterprise seamlessly",
    },
    {
      image: "/CTA/CTA4.jpg",
      link: "#",
      title: "Win Together",
      description: "Celebrate every milestone achieved",
    },
    {
      image: "/CTA/CTA5.jpg",
      link: "#",
      title: "Stay Active",
      description: "Keep your community buzzing daily",
    },
    {
      image: "/CTA/CTA6.jpg",
      link: "#",
      title: "Track Growth",
      description: "See your impact in real-time",
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-[#0D9488] overflow-hidden">
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

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Interactive 3D Sphere */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] lg:h-[600px] order-2 lg:order-1"
          >
            {/* Glow effect behind sphere */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F06543]/30 to-[#F06543]/10 rounded-3xl blur-3xl" />

            {/* 3D Sphere Menu Container with border and shadow */}
            <div className="relative h-full rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl bg-gradient-to-br from-[#0D9488] to-[#0B7A70]">
              <InfiniteMenu items={sphereItems} scale={1.2} />

              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B7A70]/50 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating hint text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-md px-5 py-3 rounded-full border border-white/30 shadow-lg"
            >
              <p className="text-white text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-[#F06543] rounded-full animate-pulse" />
                Drag to explore
              </p>
            </motion.div>
          </motion.div>

          {/* Right side - Content */}
          <div className="text-left order-1 lg:order-2">
            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
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
              className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed"
            >
              Stop managing spreadsheets. Start building meaningful connections
              with the infrastructure that scales.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex mb-8"
            >
              <Button
                onClick={() => router.push("/auth/login")}
                size="lg"
                className="group bg-white text-[#1F2937] hover:bg-white/95 text-lg font-bold py-6 px-10 h-auto shadow-2xl hover:shadow-[#F06543]/20 transition-all duration-300"
              >
                Start today
                <motion.div
                  className="inline-block ml-2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                </motion.div>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-6 text-white/90 mb-10"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
                <span className="text-sm font-semibold">
                  No credit card required
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
                <span className="text-sm font-semibold">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
                <span className="text-sm font-semibold">Cancel anytime</span>
              </div>
            </motion.div>

            {/* Feature highlights - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                {
                  icon: Shield,
                  title: "Bank-grade Security",
                },
                {
                  icon: Zap,
                  title: "Lightning Setup",
                },
                {
                  icon: Users,
                  title: "Scale Effortlessly",
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
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-white font-bold text-sm">
                      {feature.title}
                    </h3>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedCTASection;
