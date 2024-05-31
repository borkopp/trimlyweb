import { Button } from "@/components/ui/button";
import Image from "next/image";
import WordRotate from "./ui/word-rotate";
import { FlipWords } from "./ui/word-flip";

const HeroImage = require("../../public/images/hero1.png");

export default function Hero() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden py-24 lg:py-32">
        {/* Gradients */}
        <div
          aria-hidden="true"
          className="flex absolute -top-96 start-1/2 transform -translate-x-1/2"
        >
          <div className="bg-gradient-to-r from-background/50 to-background blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem]" />
          <div className="bg-gradient-to-tl blur-3xl w-[90rem] h-[50rem] rounded-full origin-top-left -rotate-12 -translate-x-[15rem] from-primary-foreground via-primary-foreground to-background" />
        </div>
        {/* End Gradients */}
        <div className="relative z-10">
          <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center pt-32 px-72">
            <div>
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
                <div className="flex items-center">
                  <div className="mr-2">The</div>
                  {
                    <FlipWords
                      className="flex"
                      words={[
                        "affordable ",
                        "modern",
                        "professional",
                        "simple",
                      ]}
                    />
                  }
                </div>

                <div className="mt-1">solution that your</div>
                <div className="mt-1">barbershop needs</div>
              </h1>
              <p className="mt-3 text-xl text-muted-foreground">
                Own an app for your business, without paying <br />
                thousands. Stand out from the competition.
                <br /> Gain loyal customers.
              </p>
              {/* Buttons */}
              <div className="mt-7 grid gap-3 w-full sm:inline-flex">
                <Button size={"lg"}>Check pricing</Button>
                <Button variant={"outline"} size={"lg"}>
                  Learn more
                </Button>
              </div>
              {/* End Buttons */}
              <div className="mt-6 lg:mt-10 grid grid-cols-2 gap-x-5"></div>
            </div>
            {/* Col */}
            <div className="relative ms-4">
              {/* <Image
                alt="Hero Image"
                quality={100}
                src={HeroImage}
                layout="fill"
              /> */}
            </div>
            {/* End Col */}
          </div>
        </div>
      </div>
      {/* End Hero */}
    </>
  );
}
