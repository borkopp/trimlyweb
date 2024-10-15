"use client";
import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import HeroMockup from "@/components/HeroMockup";
import {BackgroundBeamsDemo} from "@/components/HeroTest";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import Features from "@/components/features";
import {FeaturesSection} from "@/components/features-new";
import Pricing from "@/components/pricing";
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
      <BackgroundBeamsDemo />
      <HeroMockup />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <Faq />
      <Pricing />
    </main>
  );
}
