"use client";
import ParallaxBackground from "../ui/parallaxBackground";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const words = [
    "manage",
    "grow",
    "scale",
    "retain",
    "power",
    "unify",
    "engage",
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2500); // Change word every 2.5 seconds

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section className="relative min-h-screen bg-[#F9FAFB] flex items-center justify-center overflow-hidden">
      {/* Layer 1: Parallax Background (Bottom) */}
      <ParallaxBackground
        imageSrc="/connect_background.png"
        opacity={0.05}
        parallaxStrength={5}
        smoothing={0.08}
      />

      {/* Layer 3: Content Container (Top) */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Optional: Radial gradient overlay for better text readability */}
        <div className="absolute inset-0 -z-10 bg-gradient-radial from-[#F9FAFB] via-transparent to-transparent opacity-60" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Headline with rotating text */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#1F2937] mb-8 leading-[1.1]">
            Infrastructure to{" "}
            <span className="inline-block lg:text-left min-w-[200px] sm:min-w-[280px] sm:text-center text-center  lg:min-w-[260px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWordIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="inline-block text-[#0D9488]"
                >
                  {words[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            your community
            <span className="block text-[#1F2937] mt-2">all in one place</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl lg:text-2xl text-[#1F2937]/70 mb-12 max-w-3xl mx-auto font-light">
            From your first member to global scale everything you need to build,
            engage, and grow flows seamlessly in one space.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="group">
              <Link href="/auth/register" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
