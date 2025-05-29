"use client";
import Faq from "@/components/Faq";
import HeroMockup from "@/components/HeroMockup";
import { Hero } from "@/components/HeroTest";
import { HowItWorks } from "@/components/HowItWorks";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import { CTAWithDashedGridLines } from "@/components/cta";
import { SimpleFaqsWithBackground } from "@/components/faq-new";
import { FeaturesSection } from "@/components/features-new";
import { HeroSectionWithBeamsAndGrid } from "@/components/hero-new";
import HeroSection from "@/components/hero-section";
import { PricingWithSwitchAndAddOn } from "@/components/pricing";
import { BackgroundBeams } from "@/components/ui/background-beams";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: "ease-in-out",
    });
  }, []);
  return (
    <main>
      {/* <div className="relative">
        <div className="space-y-10 py-20">
          <Hero />
          <HeroMockup />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-background via-background/90 to-transparent z-30"></div>
        <BackgroundBeams />
      </div> */}
      <HeroSectionWithBeamsAndGrid />

      <ProblemSection />
      <SolutionSection />
      <HowItWorks />
      <div className="relative">
        <FeaturesSection />
        <CTAWithDashedGridLines />
        <PricingWithSwitchAndAddOn />
        <BackgroundBeams />
      </div>
      {/* <Faq /> */}
      <SimpleFaqsWithBackground />
    </main>
  );
}
