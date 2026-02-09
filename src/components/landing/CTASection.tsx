"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground/80">
            Start your free plan
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Ready to transform your
          <span className="block text-primary mt-2">
            subscription management?
          </span>
        </h2>

        <p className="text-xl text-foreground/70 mb-10 max-w-2xl mx-auto">
          Join hundreds of organizations that trust ReeTrack to manage their
          memberships, billing, and payments efficiently.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            as={Link}
            href="/auth"
            size="lg"
            color="primary"
            className="bg-primary text-primary-foreground text-lg px-10 py-7"
            endContent={<ArrowRight className="w-5 h-5" />}
          >
            Get Started Free
          </Button>
          <Button
            as={Link}
            href="/pricing"
            size="lg"
            variant="bordered"
            className="border-foreground/20 text-foreground text-lg px-10 py-7"
          >
            View Pricing
          </Button>
        </div>

        <p className="text-sm text-foreground/60 mt-6">
          Track subscriptions · Cancel anytime
        </p>
      </motion.div>
    </section>
  );
}
