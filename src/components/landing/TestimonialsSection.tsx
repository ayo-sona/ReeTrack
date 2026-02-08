"use client";

import { Card, CardBody } from "@heroui/react";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Executive Director",
    organization: "Community Alliance",
    content: "ReeTrack has transformed how we manage our 500+ members. The automated billing alone has saved us countless hours every month.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    name: "Michael Chen",
    role: "Finance Manager",
    organization: "Tech Professionals Association",
    content: "The analytics dashboard gives us insights we never had before. We can now make data-driven decisions about our membership programs.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=michael",
  },
  {
    name: "Emily Rodriguez",
    role: "Operations Lead",
    organization: "Creative Guild",
    content: "Best subscription management platform we've used. The payment tracking is flawless and member management is incredibly intuitive.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=emily",
  },
];

const logoPartners = [
  "Community Alliance",
  "Tech Professionals",
  "Creative Guild",
  "Business Network",
];

export function TestimonialsSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-content1/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Trusted by leading organizations
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            See what our customers have to say about transforming their subscription management.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-content1/80 backdrop-blur-md border border-divider h-full">
                <CardBody className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>

                  <div className="relative mb-4">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                    <p className="text-foreground/80 relative z-10 pl-6">
                      {testimonial.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-primary/20"
                      width={48}
                      height={48}
                    />
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-foreground/60">
                        {testimonial.role}, {testimonial.organization}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Logo Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-divider pt-12"
        >
          <p className="text-center text-sm text-foreground/60 mb-8">
            TRUSTED BY ORGANIZATIONS WORLDWIDE
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {logoPartners.map((partner, index) => (
              <div
                key={index}
                className="text-foreground/40 font-semibold text-lg hover:text-foreground/70 transition-colors"
              >
                {partner}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
