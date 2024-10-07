"use client";
import React from "react";
import {BackgroundBeams} from "@/components/ui/background-beams";
import {HeroButton} from "./HeroButton";
import WordPullUp from "./ui/word-pull-up";

export function BackgroundBeamsDemo() {
  return (
    <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4 relative z-10">
        <WordPullUp
          className="relative text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold"
          words="The upgrade for your barbershop"
        />
        <p
          data-aos="fade-up"
          data-aos-delay="300"
          data-aos-duration="1000"
          className="text-neutral-500 text-[1.2rem] max-w-lg mx-auto my-4 text-center relative">
          Own an app for your business, without paying thousands. Stand out from the competition. Gain loyal customers.
        </p>
        <div className="flex flex-row gap-4 justify-center mt-10">
          <HeroButton dataAos="fade-up" dataAosDelay="400" dataAosDuration="1000" href="#pricing" text="Check pricing" />
          <HeroButton dataAos="fade-up" dataAosDelay="600" dataAosDuration="1200" href="#solution" text="Learn more" />
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
