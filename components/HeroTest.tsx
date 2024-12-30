import React from "react";
import WordPullUp from "./ui/word-pull-up";
import Link from "next/link";
import {Button} from "./ui/button";
import {CalendarScript} from "./CalendarScript";
export function Hero() {
  return (
    <div className="h-[35rem] w-full rounded-md bg-background p-10 lg:p-20 relative flex flex-col items-center justify-center antialiased">
      {/* <div data-aos="fade-up" data-aos-delay="400" className="bg-slate-800 no-underline group relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block mb-8">
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(249,100,22,0.6)_0%,rgba(249,100,22,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        </span>
        <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 text-neutral-400 ">
          <span>{`Brand your barbershop with fadely`}</span>
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-primary/0 via-primary/90 to-primary/0 transition-opacity duration-500 group-hover:opacity-40"></span>
      </div> */}
      <div className="max-w-4xl mx-auto relative z-10">
        <WordPullUp
          className="relative text-5xl md:text-6xl tracking-normal lg:text-7xl text-center font-inter font-bold"
          words="The upgrade your barbershop needs"
        />
        <p data-aos="fade-up" data-aos-delay="300" className="text-neutral-500 text-[1.2rem] max-w-xl mx-auto mt-10 text-center font-inter relative">
          Empowering Barbershops to Shine with Their Own Branded App <br /> Simplify Scheduling and Attract More Clients!
        </p>
        <div className="flex flex-row gap-4 justify-center mt-12">
          {/* <button data-aos="fade-up" data-aos-delay="300" data-aos-duration="1000" className="herobutton font-inter font-semibold">
            Learn more
          </button> */}
          {/* <Button
            data-aos="fade-up"
            data-aos-delay="400"
            data-aos-duration="1000"
            variant={"outline"}
            className="flex flex-row items-center gap-2 group ml-4">
            <Link href="#pricing">Check pricing</Link>
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Button> */}
          {/* <Link href="#solution">
            <button
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="1000"
              className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none ">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f96416_0%,#fec7aa_50%,#f96416_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background px-5 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                Learn more
              </span>
            </button>
          </Link>
          <Link href="#pricing">
            <button
              data-aos="fade-up"
              data-aos-delay="400"
              data-aos-duration="1000"
              className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none ">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f96416_0%,#fec7aa_50%,#f96416_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background px-5 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                Check pricing
              </span>
            </button>
          </Link> */}

          <Link href="#solution">
            <Button data-aos="fade-up" data-aos-delay="300" className="px-8">
              Learn more
            </Button>
          </Link>
          <Button
            data-aos="fade-up"
            data-aos-delay="400"
            variant="outline"
            className="px-8 bg-secondary hover:bg-secondary/80"
            data-cal-link="fadely/30min"
            data-cal-namespace="30min"
            data-cal-config='{"layout":"month_view"}'>
            Book a call
          </Button>
        </div>
      </div>
      <CalendarScript />
    </div>
  );
}
