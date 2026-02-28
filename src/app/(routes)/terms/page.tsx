"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: `By accessing or using ReeTrack's platform, website, or any associated services (collectively, the "Services"), you agree to be bound by these Terms of Service. If you are using the Services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.

If you do not agree to these Terms, you may not use our Services. We reserve the right to update these Terms at any time. Continued use of the Services after any changes constitutes acceptance of the revised Terms.`,
  },
  {
    id: "services",
    title: "Description of Services",
    content: `ReeTrack provides a subscription management platform that enables organizations — including gyms, fitness centers, coworking spaces, and other membership-based businesses — to manage members, subscriptions, payments, notifications, check-ins, and analytics.

ReeTrack operates as a Software-as-a-Service (SaaS) provider. We do not hold, process, or transmit funds directly. All payment processing is handled by our licensed third-party payment partners, including Paystack. By using payment features within ReeTrack, you also agree to the terms of service of those payment providers.`,
  },
  {
    id: "accounts",
    title: "Accounts and Registration",
    content: `To use ReeTrack, you must register for an account by providing accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.

You agree to provide truthful, accurate, and current information during registration, promptly update your information if it changes, notify us immediately of any unauthorized use of your account, and not share your account credentials with third parties.

ReeTrack reserves the right to suspend or terminate accounts that violate these Terms or engage in fraudulent, illegal, or abusive activity.`,
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    content: `You may use ReeTrack only for lawful purposes and in accordance with these Terms. You agree not to use the Services to facilitate money laundering, terrorist financing, fraud, or any other illegal activity; impersonate any person or entity or misrepresent your affiliation; introduce viruses, malware, or other harmful code into the platform; attempt to gain unauthorized access to any part of the Services; use the Services to send unsolicited or spam communications; scrape, crawl, or harvest data from the platform without authorization; or use the Services in any way that could damage, disable, or impair the platform.

We reserve the right to investigate and take appropriate action, including termination of access, for any violation of this section.`,
  },
  {
    id: "payments",
    title: "Payments and Billing",
    content: `Subscription fees are billed monthly or annually depending on your chosen plan. By subscribing to a paid plan, you authorize ReeTrack to charge your selected payment method on a recurring basis.

All prices are displayed in USD unless otherwise stated. Transaction fees apply to payments processed through your ReeTrack account and vary by plan tier.

Refunds: Annual plans may be refunded on a pro-rated basis for unused months if you cancel within the billing period. Monthly plans are not refunded for partial months. We reserve the right to modify pricing with 30 days' notice.`,
  },
  {
    id: "data",
    title: "Data and Privacy",
    content: `Your use of ReeTrack is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our Services, you consent to the collection and use of your data as described in our Privacy Policy.

You retain ownership of all data you input into ReeTrack, including member information and business data. You grant ReeTrack a limited license to use this data solely to provide the Services to you. We do not sell your data to third parties.`,
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: `ReeTrack and its licensors own all intellectual property rights in the platform, including software, designs, logos, and documentation. Nothing in these Terms grants you ownership of any ReeTrack intellectual property.

You may not copy, modify, distribute, sell, or lease any part of our Services without our prior written consent. You may not reverse engineer or attempt to extract the source code of our software.`,
  },
  {
    id: "limitation",
    title: "Limitation of Liability",
    content: `To the maximum extent permitted by applicable law, ReeTrack shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the Services.

ReeTrack's total liability for any claim arising from these Terms or the Services shall not exceed the amount you paid to ReeTrack in the three months preceding the claim.

Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so some of the above may not apply to you.`,
  },
  {
    id: "termination",
    title: "Termination",
    content: `Either party may terminate these Terms at any time. You may cancel your account from your account settings. We may suspend or terminate your access if you violate these Terms, engage in fraudulent activity, or if required by law.

Upon termination, your right to use the Services ceases immediately. We will retain your data for a reasonable period to allow export, after which it may be deleted in accordance with our data retention policies.`,
  },
  {
    id: "governing-law",
    title: "Governing Law",
    content: `These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from these Terms or the Services shall be subject to the exclusive jurisdiction of the courts of Nigeria.`,
  },
  {
    id: "contact",
    title: "Contact",
    content: `If you have any questions about these Terms, please contact us at reetrack.inc@gmail.com. We will respond to all inquiries within a reasonable timeframe.`,
  },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sections.forEach((s) => {
      const el = sectionRefs.current[s.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-10" style={{ fontFamily: "Nunito, sans-serif" }}>
      <Navigation />

      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-[#1F2937]/10 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold tracking-widest uppercase text-[#0D9488] mb-3">Legal</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-4">Terms of Service</h1>
            <div className="flex flex-wrap items-center gap-4">
              <span className="bg-[#0D9488]/10 text-[#0D9488] text-xs font-bold px-3 py-1 rounded-full">
                Version 1.0
              </span>
              <span className="text-xs text-[#1F2937]/40 font-semibold">Effective: January 2025</span>
              <span className="text-xs text-[#1F2937]/40 font-semibold">Next review: January 2026</span>
            </div>
            <p className="text-sm text-[#1F2937]/55 mt-4 max-w-2xl leading-relaxed">
              Please read these Terms carefully before using ReeTrack. They govern your access to and use of our platform and services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex gap-16 items-start">

          {/* Sticky Sidebar TOC */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-8">
            <p className="text-xs font-bold tracking-widest uppercase text-[#1F2937]/35 mb-4">
              Contents
            </p>
            <nav className="space-y-1">
              {sections.map((section, i) => (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className={`w-full text-left text-xs py-1.5 px-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeSection === section.id
                      ? "bg-[#0D9488]/10 text-[#0D9488]"
                      : "text-[#1F2937]/45 hover:text-[#1F2937] hover:bg-[#1F2937]/5"
                  }`}
                >
                  <span className="mr-2 opacity-50">{String(i + 1).padStart(2, "0")}</span>
                  {section.title}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="space-y-16">
              {sections.map((section, i) => (
                <motion.div
                  key={section.id}
                  id={section.id}
                  ref={(el) => { sectionRefs.current[section.id] = el; }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="scroll-mt-8"
                >
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-xs font-bold text-[#0D9488]/60 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-lg font-bold text-[#1F2937]">{section.title}</h2>
                  </div>
                  <div className="pl-9 border-l-2 border-[#1F2937]/8">
                    <p className="text-sm text-[#1F2937]/65 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer note */}
            <div className="mt-16 pt-8 border-t border-[#1F2937]/10">
              <p className="text-xs text-[#1F2937]/40 leading-relaxed">
                Questions about these terms? Email us at{" "}
                <a href="mailto:reetrack.inc@gmail.com" className="text-[#0D9488] font-semibold hover:underline">
                  reetrack.inc@gmail.com
                </a>
              </p>
            </div>
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
}