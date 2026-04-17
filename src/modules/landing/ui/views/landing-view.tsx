"use client";

import React from "react";
import { HeroSection } from "../components/hero-section";
import { FeaturesSection } from "../components/features-section";
import { BenefitsSection } from "../components/benefits-section";
import { TestimonialsSection } from "../components/testimonials-section";
import { PricingSection } from "../components/pricing-section";
import { CtaSection } from "../components/cta-section";
import { FooterSection } from "../components/footer-section";
import { NavigationHeader } from "../components/navigation-header";

export const LandingView = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <main className="overflow-x-hidden">
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <TestimonialsSection />
        <PricingSection />
        <CtaSection />
      </main>
      <FooterSection />
    </div>
  );
};
