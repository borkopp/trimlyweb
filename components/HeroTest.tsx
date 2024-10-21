"use client";
import React from "react";
import {BackgroundBeams} from "@/components/ui/background-beams";
import {HeroButton} from "./HeroButton";
import WordPullUp from "./ui/word-pull-up";
import {Button} from "./ui/button";
import {ArrowRightIcon} from "lucide-react";
import router from "next/router";
import Link from "next/link";

export function BackgroundBeamsDemo() {
  return (
    <div className="h-[35rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4 relative z-10">
        <WordPullUp
          className="relative text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-inter font-extrabold"
          words="The upgrade for your barbershop"
        />
        <p
          data-aos="fade-up"
          data-aos-delay="300"
          data-aos-duration="1000"
          className="text-neutral-500 text-[1.4rem] max-w-xl mx-auto my-4 text-center font-lato relative">
          Branded app for your business, without paying thousands. Stand out from the competition. Gain loyal customers.
        </p>
        <div className="flex flex-row gap-4 justify-center mt-10">
          <button className="herobutton font-inter font-semibold">Learn more</button>
          <Button variant={"outline"} className="flex flex-row items-center gap-2 group ml-4">
            <Link href="#pricing">Check pricing</Link>
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Button>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
