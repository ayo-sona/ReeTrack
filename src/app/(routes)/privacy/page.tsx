"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: `ReeTrack ("we", "our", or "us") is committed to protecting the privacy of our users and their members. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our subscription management platform and related services.

By using ReeTrack, you consent to the practices described in this Privacy Policy. If you do not agree with this policy, please do not use our Services.

This policy applies to all users of the ReeTrack platform, including organization administrators, staff members, and end members managed through the platform.`,
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: `Account and Registration Information
When you register for ReeTrack, we collect your name, email address, phone number, organization name, and other details necessary to create and manage your account.

Member Data
Organizations using ReeTrack may input member information including names, email addresses, phone numbers, dates of birth, and subscription details. This data is collected on behalf of and under the direction of the organization.

Payment Information
We do not store sensitive payment card data. Payment processing is handled by our third-party partners (Paystack). We receive and store transaction records, subscription histories, and payment statuses.

Usage Data
We automatically collect information about how you use the platform, including pages visited, features used, login times, IP addresses, browser type, and device information.

Communications
If you contact us via email or social media, we retain the content of your communications and our responses.`,
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: `We use the information we collect to provide, operate, and maintain the ReeTrack platform; process subscription payments and manage billing; send transactional emails including receipts, invoices, and account notifications; enable organizations to send member notifications and communications; generate analytics and reports for organizations; respond to support requests and enquiries; improve and develop new features for the platform; comply with legal and regulatory obligations, including AML and CFT requirements; and detect, prevent, and address fraud, security breaches, and violations of our Terms.

We do not use your data to serve third-party advertising.`,
  },
  {
    id: "sharing",
    title: "How We Share Your Information",
    content: `We do not sell your personal information. We may share your information in the following limited circumstances:

Service Providers: We share data with trusted third-party service providers who assist us in operating the platform, including payment processors (Paystack), cloud hosting providers, and email delivery services. These providers are contractually obligated to handle data securely and only as instructed.

Legal Requirements: We may disclose your information when required by law, court order, or government regulation, or when we believe disclosure is necessary to protect the rights, property, or safety of ReeTrack, our users, or others.

Business Transfers: If ReeTrack is acquired or merges with another company, your information may be transferred as part of that transaction. We will notify you before your information becomes subject to a different privacy policy.

With Your Consent: We may share information for any other purpose with your explicit consent.`,
  },
  {
    id: "data-security",
    title: "Data Security",
    content: `We implement industry-standard security measures to protect your information from unauthorized access, disclosure, alteration, or destruction. These include encryption of data in transit using TLS/SSL, encryption of sensitive data at rest, access controls limiting data access to authorized personnel, regular security reviews and assessments, and incident response procedures.

While we take reasonable precautions, no method of transmission or storage is 100% secure. We encourage you to use strong passwords and keep your login credentials confidential.`,
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: `We retain your personal data for as long as your account is active or as needed to provide you with our Services. When you delete your account, we will delete or anonymize your data within a reasonable period, except where retention is required by law.

Transaction records and financial data may be retained for longer periods to comply with Nigerian financial regulations and tax obligations.

Member data uploaded by organizations is retained at the direction of the organization. Upon account termination, organizations may export their data before it is deleted.`,
  },
  {
    id: "your-rights",
    title: "Your Rights",
    content: `Depending on your location and applicable law, you may have the following rights regarding your personal data:

Access: Request a copy of the personal data we hold about you.
Correction: Request that we correct inaccurate or incomplete data.
Deletion: Request that we delete your personal data, subject to legal requirements.
Portability: Request your data in a machine-readable format.
Objection: Object to certain types of processing of your data.
Withdrawal of Consent: Withdraw consent where processing is based on consent.

To exercise any of these rights, contact us at reetrack.inc@gmail.com. We will respond within 30 days.`,
  },
  {
    id: "cookies",
    title: "Cookies and Tracking",
    content: `ReeTrack uses cookies and similar tracking technologies to maintain your login session, remember your preferences, understand how users interact with the platform, and improve the performance and functionality of our Services.

You can control cookie settings through your browser. Note that disabling certain cookies may affect the functionality of the platform. We do not use cookies for third-party advertising.`,
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    content: `ReeTrack integrates with third-party services including Paystack for payment processing. When you use these integrations, your data may also be subject to the privacy policies of those providers. We encourage you to review their policies.

Our platform may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.`,
  },
  {
    id: "children",
    title: "Children's Privacy",
    content: `ReeTrack is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected such information, we will delete it promptly.

Organizations using ReeTrack to manage members who may be minors are responsible for obtaining appropriate parental consent and complying with applicable laws regarding minors' data.`,
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our platform or sending an email to your registered address. The date of the most recent revision will always be indicated at the top of this policy.

Your continued use of ReeTrack after any changes to this policy constitutes your acceptance of the updated terms.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us at reetrack.inc@gmail.com. We take all privacy enquiries seriously and will respond within a reasonable timeframe.`,
  },
];

export default function PrivacyPage() {
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
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-4">Privacy Policy</h1>
            <div className="flex flex-wrap items-center gap-4">
              <span className="bg-[#F06543]/10 text-[#F06543] text-xs font-bold px-3 py-1 rounded-full">
                Version 1.0
              </span>
              <span className="text-xs text-[#1F2937]/40 font-semibold">Effective: January 2025</span>
              <span className="text-xs text-[#1F2937]/40 font-semibold">Next review: January 2026</span>
            </div>
            <p className="text-sm text-[#1F2937]/55 mt-4 max-w-2xl leading-relaxed">
              Your privacy matters to us. This policy explains what data we collect, how we use it, and your rights around it — in plain language.
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
                      ? "bg-[#F06543]/10 text-[#F06543]"
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
                    <span className="text-xs font-bold text-[#F06543]/60 tabular-nums">
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
                Questions about this policy? Email us at{" "}
                <a href="mailto:reetrack.inc@gmail.com" className="text-[#F06543] font-semibold hover:underline">
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