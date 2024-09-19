"use client";
import Hero from "@/components/Hero";
import HeroMockup from "@/components/HeroMockup";
import {BackgroundBeamsDemo} from "@/components/HeroTest";
import Features from "@/components/features";
import Pricing from "@/components/pricing";
import AOS from "aos";
import "aos/dist/aos.css";
import {useEffect} from "react";

export default function Home() {
  useEffect(() => {
    AOS.init({
      disable: "phone",
      duration: 500,
      easing: "ease-out-cubic",
    });
  });
  return (
    <main>
      {/* Hero */}
      {/* <Hero /> */}
      <BackgroundBeamsDemo />
      <HeroMockup />
      {/* Features */}
      <Features />
      {/* Pricing */}
      <Pricing />
    </main>
  );
}
