"use client";

import Link from "next/link";
import { Twitter, Linkedin, Mail } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    // { label: "Security", href: "#security" },
    // { label: "Roadmap", href: "#roadmap" },
  ],
  company: [
    { label: "About", href: "#about" },
    // { label: "Blog", href: "#blog" },
    // { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
  ],
  // resources: [
  //   { label: "Documentation", href: "#docs" },
  //   { label: "API Reference", href: "#api" },
  //   // { label: "Support", href: "#support" },
  //   // { label: "Status", href: "#status" },
  // ],
  legal: [
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
    // { label: "Cookie Policy", href: "#cookies" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://x.com/ReeTrack", label: "Twitter" },
  // {
  //   icon: Github,
  //   href: "https://github.com/ayo-sona/ReeTrack",
  //   label: "GitHub",
  // },
  { icon: Linkedin, href: "https://linkedin.com/ReeTrack", label: "LinkedIn" },
  { icon: Mail, href: "mailto:support@reetrack.com", label: "Email" },
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-2xl font-bold text-[#1F2937] block mb-4 hover:text-[#0D9488] transition-colors"
            >
              ReeTrack
            </Link>
            <p className="text-sm text-[#1F2937]/60 mb-6 leading-relaxed">
              Modern subscription management for membership organizations.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[#1F2937]/60 hover:text-white hover:bg-gradient-to-br hover:from-[#0D9488] hover:to-[#0B7A70] transition-all duration-300 hover:scale-110 hover:shadow-md"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-bold text-[#1F2937] mb-4 text-sm uppercase tracking-wide">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#1F2937]/60 hover:text-[#0D9488] transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[#1F2937] mb-4 text-sm uppercase tracking-wide">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#1F2937]/60 hover:text-[#0D9488] transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* <div>
            <h3 className="font-bold text-[#1F2937] mb-4 text-sm uppercase tracking-wide">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#1F2937]/60 hover:text-[#0D9488] transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          <div>
            <h3 className="font-bold text-[#1F2937] mb-4 text-sm uppercase tracking-wide">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#1F2937]/60 hover:text-[#0D9488] transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#1F2937]/50">
              © {new Date().getFullYear()} ReeTrack Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}