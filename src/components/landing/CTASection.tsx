"use client";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import InfiniteMenu from "@/components/effects/infiniteMenu";
import { useRouter } from "next/navigation";

const EnhancedCTASection = () => {
  const router = useRouter();

  const sphereItems = [
    { image: "/CTA/CTA1.jpg", link: "#", title: "Unite & Grow", description: "Build authentic connections that last" },
    { image: "/CTA/CTA2.jpg", link: "#", title: "Team Power", description: "Collaborate like never before" },
    { image: "/CTA/CTA3.jpg", link: "#", title: "Scale Smart", description: "From startup to enterprise seamlessly" },
    { image: "/CTA/CTA4.jpg", link: "#", title: "Win Together", description: "Celebrate every milestone achieved" },
    { image: "/CTA/CTA5.jpg", link: "#", title: "Stay Active", description: "Keep your community buzzing daily" },
    { image: "/CTA/CTA6.jpg", link: "#", title: "Track Growth", description: "See your impact in real-time" },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-[#F9FAFB] overflow-hidden">
      {/* Soft background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0D9488]/6 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F06543]/6 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — 3D Sphere */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative h-[480px] lg:h-[560px] order-2 lg:order-1"
          >
            <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#0D9488] to-[#0a6e63] shadow-xl">
              <InfiniteMenu items={sphereItems} scale={1.2} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Hint pill */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-100"
            >
              <p className="text-[#1F2937] text-xs font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#0D9488] rounded-full animate-pulse" />
                Drag to explore
              </p>
            </motion.div>
          </motion.div>

          {/* Right — Content */}
          <div className="order-1 lg:order-2">
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[#0D9488] text-sm font-semibold uppercase tracking-widest mb-4"
            >
              Community management, simplified
            </motion.p>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-5 leading-tight"
            >
              Ready to build a community{" "}
              <span className="text-[#0D9488]">that thrives?</span>
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#1F2937]/60 text-lg mb-8 leading-relaxed"
            >
              ReeTrack helps communities manage members, track payments, and
              reward consistency — all in one place.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-4 mb-10"
            >
              <Button
                onClick={() => router.push("/auth/login")}
                size="lg"
                className="bg-[#F06543] hover:bg-[#e05535] text-white text-base font-semibold px-8 py-5 h-auto rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                Get started free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <span className="text-[#1F2937]/40 text-sm">No credit card required</span>
            </motion.div>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              {[
                { icon: Shield, label: "Bank-grade security" },
                { icon: Zap, label: "Quick setup" },
                { icon: Users, label: "Scales with you" },
              ].map(({ icon: Icon, label }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-[#0D9488]" strokeWidth={2.5} />
                  <span className="text-[#1F2937]/70 text-sm font-medium">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EnhancedCTASection;