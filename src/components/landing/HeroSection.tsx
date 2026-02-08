"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Mesh Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 0%, #333333, #333333 50%, #eeeeee 75%, #333333 75%)`,
          }}
        />
        {/* <div className="absolute inset-0 mesh-background" /> */}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground/80">
                Trusted by 500+ organizations
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Subscription Management
              <span className="block text-primary mt-2">Made Simple</span>
            </h1>

            <p className="text-xl text-foreground/70 mb-8 max-w-2xl">
              Cloud-based platform for membership organizations with automated
              billing, payment tracking, and powerful analytics. Streamline your
              subscription management today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                as={Link}
                href="/auth/register"
                size="lg"
                color="primary"
                className="bg-primary text-primary-foreground text-lg px-8 py-6"
                endContent={<ArrowRight className="w-5 h-5" />}
              >
                Start free plan
              </Button>
              <Button
                as={Link}
                href="/features"
                size="lg"
                variant="bordered"
                className="border-foreground/20 text-foreground text-lg px-8 py-6"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-3xl font-bold text-foreground">99.9%</div>
                <div className="text-sm text-foreground/60">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">$2M+</div>
                <div className="text-sm text-foreground/60">Processed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">24/7</div>
                <div className="text-sm text-foreground/60">Support</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[600px]">
              {/* Main Dashboard Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-0 left-0 w-full bg-content1/80 backdrop-blur-md rounded-2xl p-6 border border-divider shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Revenue Dashboard
                  </h3>
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-primary rounded-full" />
                  </div>
                  <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-secondary rounded-full" />
                  </div>
                  <div className="h-2 bg-success/20 rounded-full overflow-hidden">
                    <div className="h-full w-5/6 bg-success rounded-full" />
                  </div>
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-foreground/60">Monthly Growth</span>
                  <span className="text-success font-semibold">+24%</span>
                </div>
              </motion.div>

              {/* Members Card */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute top-40 -right-8 w-64 bg-content1/80 backdrop-blur-md rounded-2xl p-5 border border-divider shadow-xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-foreground/60">
                      Active Members
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      1,247
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Success Card */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-20 -left-8 w-56 bg-success/10 backdrop-blur-md rounded-2xl p-4 border border-success/20 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-sm font-semibold text-success">
                    Payment Received
                  </span>
                </div>
                <p className="text-xs text-foreground/60">
                  Subscription renewed for John Doe
                </p>
                <p className="text-lg font-bold text-foreground mt-1">$99.00</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
