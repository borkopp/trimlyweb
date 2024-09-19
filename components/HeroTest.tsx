"use client";
import React from "react";
import {BackgroundBeams} from "@/components/ui/background-beams";
import {HeroButton} from "./HeroButton";

export function BackgroundBeamsDemo() {
  return (
    <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          The solution for your barbershop
        </h1>
        <p className="text-neutral-500 text-[1.2rem] max-w-lg mx-auto my-2 text-center relative z-10">
          Own an app for your business, without paying thousands. Stand out from the competition. Gain loyal customers.
        </p>
        <div className="flex flex-row gap-4 justify-center mt-10">
          <HeroButton href="#pricing" text="Check pricing" />
          <HeroButton href="#features" text="Learn more" />
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
