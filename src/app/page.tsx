"use client";

import { Navigation } from "@/components/ui/Navigation";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import { Footer } from "@/components/ui/Footer";
import FAQSection from "@/components/landing/FAQSection";
import ContactSection from "@/components/landing/contact";
import AboutSection from "@/components/landing/AboutSection";
import { ScrollReveal } from "@/components/effects/scrollReveal";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero shows immediately - no animation needed */}
      <HeroSection />
      
      {/* Sections reveal as you scroll */}
      <ScrollReveal>
        <AboutSection />
      </ScrollReveal>
      
      <ScrollReveal delay={0.1}>
        <FeaturesSection />
      </ScrollReveal>
      
      <ScrollReveal delay={0.1}>
        <HowItWorksSection />
      </ScrollReveal>
      
      <ScrollReveal delay={0.1}>
        <PricingSection />
      </ScrollReveal>
      
      <ScrollReveal delay={0.1}>
        <FAQSection />
      </ScrollReveal>
      
      <ScrollReveal delay={0.1}>
        <CTASection />
      </ScrollReveal>
      
      <ScrollReveal delay={0.1}>
        <ContactSection />
      </ScrollReveal>
      
      <Footer />
    </div>
  );
}