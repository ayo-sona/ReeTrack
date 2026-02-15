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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <ContactSection />
      <Footer />
    </div>
  );
}
