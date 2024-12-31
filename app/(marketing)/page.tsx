"use client";
import Faq from "@/components/Faq";
import HeroMockup from "@/components/HeroMockup";
import {Hero} from "@/components/HeroTest";
import {HowItWorks} from "@/components/HowItWorks";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import {FeaturesSection} from "@/components/features-new";
import Pricing from "@/components/pricing";
import {BackgroundBeams} from "@/components/ui/background-beams";
import AOS from "aos";
import "aos/dist/aos.css";
import {useEffect} from "react";

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: "ease-in-out",
    });
  }, []);
  return (
    <main>
      <div className="relative">
        <div className="space-y-10 pt-20">
          <Hero />
          <HeroMockup />
        </div>
        <BackgroundBeams />
      </div>
      <ProblemSection />
      <SolutionSection />
      <HowItWorks />
      <div className="relative">
        <FeaturesSection />
        <Pricing />
        <BackgroundBeams />
      </div>
      <Faq />
    </main>
  );
}
