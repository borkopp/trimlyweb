"use client";
import Hero from "@/components/Hero";
import Features from "@/components/features";
import Pricing from "@/components/pricing";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

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
      <Hero />
      {/* Features */}
      <Features />
      {/* Pricing */}
      <Pricing />
    </main>
  );
}
