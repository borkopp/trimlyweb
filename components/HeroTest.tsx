import React from "react";
import WordPullUp from "./ui/word-pull-up";
import Link from "next/link";

export function BackgroundBeamsDemo() {
  return (
    <div className="h-[35rem] w-full rounded-md bg-background relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto relative z-10">
        <WordPullUp
          className="relative text-5xl md:text-7xl bg-clip-text mt text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-inter font-extrabold"
          words="The upgrade for your barbershop"
        />
        <p
          data-aos="fade-up"
          data-aos-delay="300"
          data-aos-duration="1000"
          className="text-neutral-500 text-[1.4rem] max-w-xl mx-auto mt-10 text-center font-lato relative">
          Branded app for your business, without paying thousands. Stand out from the competition. Gain loyal customers.
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
          <Link href="#solution">
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
          </Link>
        </div>
      </div>
    </div>
  );
}
