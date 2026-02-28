"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Mail, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

const contactOptions = [
  {
    icon: <Mail className="w-5 h-5" />,
    title: "Email us",
    description: "For general enquiries, support, or partnerships.",
    value: "reetrack.inc@gmail.com",
    href: "mailto:reetrack.inc@gmail.com",
    accent: "#0D9488",
  },
  {
    icon: <Instagram className="w-5 h-5" />,
    title: "Instagram",
    description: "Follow us for updates, tips, and announcements.",
    value: "@reetrack.hq",
    href: "https://instagram.com/reetrack.hq",
    accent: "#F06543",
  },
  {
    icon: <Twitter className="w-5 h-5" />,
    title: "X (Twitter)",
    description: "Catch our latest news and join the conversation.",
    value: "@ReeTrack",
    href: "https://x.com/ReeTrack/",
    accent: "#6366F1",
  },
];

const faqs = [
  {
    question: "How quickly do you respond to emails?",
    answer: "We aim to respond to all emails within 24 hours on business days. For urgent issues, please include 'URGENT' in your subject line.",
  },
  {
    question: "I have a technical issue — who do I contact?",
    answer: "Email us at reetrack.inc@gmail.com with a description of the issue and your account details. Our team will investigate and get back to you as soon as possible.",
  },
  {
    question: "Can I request a demo?",
    answer: "Absolutely. Reach out via email or social media and we'll set up a walkthrough of the platform for you and your team.",
  },
  {
    question: "Are you open to partnerships?",
    answer: "Yes! We're always open to conversations about integrations, reseller partnerships, and collaborations. Get in touch via email.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-10" style={{ fontFamily: "Nunito, sans-serif" }}>
      <Navigation />

      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-4xl mx-auto relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold tracking-widest uppercase text-[#0D9488] mb-4">
              Contact
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] leading-tight mb-6">
              We&apos;d love to{" "}
              <span className="relative inline-block">
                <span className="relative z-10">hear from you</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                  className="absolute bottom-1 left-0 right-0 h-3 bg-[#F06543]/25 -z-0 origin-left"
                />
              </span>
            </h1>
            <p className="text-lg text-[#1F2937]/60 max-w-xl mx-auto leading-relaxed">
              Whether you have a question, need support, or just want to say hi — reach out on any of the channels below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6 mb-20">
            {contactOptions.map((option, i) => (
              <motion.a
                key={i}
                href={option.href}
                target={option.href.startsWith("http") ? "_blank" : undefined}
                rel={option.href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4, x: -2 }}
                className="bg-white rounded-2xl border-2 border-[#1F2937] shadow-[4px_4px_0px_#1F2937] hover:shadow-[6px_6px_0px_#1F2937] p-6 relative overflow-hidden transition-shadow duration-200 block"
              >
                <div
                  className="absolute top-0 left-6 right-6 h-1 rounded-full"
                  style={{ background: option.accent }}
                />
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 mt-2 text-white"
                  style={{ background: option.accent }}
                >
                  {option.icon}
                </div>
                <h3 className="text-sm font-bold text-[#1F2937] mb-1">{option.title}</h3>
                <p className="text-xs text-[#1F2937]/50 leading-relaxed mb-3">{option.description}</p>
                <p className="text-sm font-bold" style={{ color: option.accent }}>
                  {option.value}
                </p>
              </motion.a>
            ))}
          </div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <p className="text-xs font-bold tracking-widest uppercase text-[#0D9488] mb-3">FAQ</p>
              <h2 className="text-3xl font-bold text-[#1F2937]">Common questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-white rounded-2xl border-2 border-[#1F2937] shadow-[3px_3px_0px_#1F2937] p-6"
                >
                  <h3 className="font-bold text-[#1F2937] mb-2 text-sm">{faq.question}</h3>
                  <p className="text-xs text-[#1F2937]/55 leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}