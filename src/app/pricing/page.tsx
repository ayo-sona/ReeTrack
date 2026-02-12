"use client";

import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Basic",
    price: "Free",
    period: "per month",
    description: "Perfect for small organizations just getting started",
    features: [
      { text: "Basic billing automation", included: true },
      { text: "Email support", included: true },
      { text: "Standard analytics", included: true },
      { text: "Mobile app access", included: true },
      { text: "Advanced reporting", included: false },
      { text: "API access", included: false },
      { text: "Priority support", included: false },
    ],
    popular: false,
  },
  {
    name: "Gold",
    price: "$100",
    period: "per month",
    description: "For growing organizations that need more power",
    features: [
      { text: "Advanced billing automation", included: true },
      { text: "Priority email support", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Mobile app access", included: true },
      { text: "Advanced reporting", included: true },
      { text: "API access", included: true },
      { text: "Priority support", included: false },
    ],
    popular: true,
  },
  {
    name: "Platinum",
    price: "$200",
    period: "per month",
    description: "For large organizations with heavy requirements",
    features: [
      { text: "Custom billing automation", included: true },
      { text: "24/7 phone & email support", included: true },
      { text: "Custom analytics", included: true },
      { text: "Mobile app access", included: true },
      { text: "Advanced reporting", included: true },
      { text: "API access", included: true },
      { text: "Dedicated account manager", included: true },
    ],
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Choose the perfect plan for your organization. No hidden fees,
              cancel anytime.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={plan.popular ? "lg:scale-105" : ""}
              >
                <Card
                  className={`h-full ${
                    plan.popular
                      ? "border-2 border-primary bg-content1"
                      : "border border-divider bg-content1/50"
                  } backdrop-blur-md`}
                >
                  <CardHeader className="flex flex-col items-start p-6 pb-0">
                    <div className="flex items-center justify-between w-full mb-4">
                      <h3 className="text-2xl font-bold text-foreground">
                        {plan.name}
                      </h3>
                      {plan.popular && (
                        <Chip size="sm" color="primary" variant="flat">
                          Popular
                        </Chip>
                      )}
                    </div>
                    <p className="text-foreground/60 text-sm mb-6">
                      {plan.description}
                    </p>
                    <div className="mb-6">
                      <span className="text-5xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-foreground/60 ml-2">
                        / {plan.period}
                      </span>
                    </div>
                  </CardHeader>

                  <CardBody className="p-6 pt-0">
                    <Button
                      as={Link}
                      href={
                        plan.name === "Enterprise"
                          ? "#contact"
                          : "/auth/register"
                      }
                      color={plan.popular ? "primary" : "default"}
                      variant={plan.popular ? "solid" : "bordered"}
                      size="lg"
                      className="w-full mb-6"
                    >
                      {plan.name === "Enterprise"
                        ? "Contact Sales"
                        : "Get Started"}
                    </Button>

                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-foreground/30 mt-0.5 flex-shrink-0" />
                          )}
                          <span
                            className={
                              feature.included
                                ? "text-foreground"
                                : "text-foreground/40 line-through"
                            }
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-24 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              <Card className="bg-content1/80 backdrop-blur-md border border-divider">
                <CardBody className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Can I change plans later?
                  </h3>
                  <p className="text-foreground/70">
                    Yes! You can upgrade or downgrade your plan at any time.
                    Changes take effect immediately, and we'll prorate the
                    difference.
                  </p>
                </CardBody>
              </Card>
              <Card className="bg-content1/80 backdrop-blur-md border border-divider">
                <CardBody className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-foreground/70">
                    We accept all major cards (Visa, Mastercard, American
                    Express) and can arrange invoicing for Enterprise customers.
                  </p>
                </CardBody>
              </Card>
              <Card className="bg-content1/80 backdrop-blur-md border border-divider">
                <CardBody className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Does the free plan work?
                  </h3>
                  <p className="text-foreground/70">
                    Yes! The free plan is a great way to get started with
                    ReeTrack. It has limitations on the number of members and
                    features you can use.
                  </p>
                </CardBody>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
