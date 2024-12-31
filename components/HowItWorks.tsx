"use client";

import React, {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import {cn} from "@/lib/utils";
import Image from "next/image";

const steps = [
  {
    title: "Book Appointment",
    description: "Your customers can easily book appointments through your branded mobile app in just a few taps.",
    image: "/illustrations/app.svg",
  },
  {
    title: "Have everything at glance",
    description: "Take control of your barbershop with our easy-to-use dashboard that syncs with your mobile app.",
    image: "/illustrations/sync.svg",
  },
  {
    title: "Get notified",
    description: "Automated notifications keep both barbers and clients reminded of their appointments.",
    image: "/illustrations/notifications.svg",
  },
  {
    title: "Attract new customers",
    description: "Stand out from the competition with a dedicated mobile app that showcases your unique brand.",
    image: "/illustrations/newcustomers.svg",
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const sectionRect = section.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, -sectionRect.top / (sectionRect.height - window.innerHeight)));
      const stepProgress = scrollProgress * (steps.length - 0.5);
      const stepIndex = Math.min(Math.floor(stepProgress), steps.length - 1);
      setActiveStep(Math.max(0, stepIndex));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[400vh] mt-20">
      <div className="sticky top-0 h-screen flex flex-col items-center">
        <div className="space-y-4 items-center text-center">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">HOW IT WORKS</h3>
          <h2 className="text-4xl font-semibold tracking-tighter font-montserrat sm:text-5xl">How your business will run</h2>
          <p className="text-neutral-500 text-[1.2rem] max-w-2xl font-lato mx-auto my-4 text-center relative">
            Our goal is to make your business run smoothly and efficiently. Leaving you more time to focus on what really matters - your customers.
          </p>
        </div>
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-20 px-4 md:px-20">
          {/* Left side - Illustration */}
          <div className="w-full md:w-1/2 h-full flex items-center justify-center relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  opacity: activeStep === index ? 1 : 0,
                  scale: activeStep === index ? 1 : 0.8,
                }}
                transition={{duration: 0.5}}
                className="absolute">
                <Image src={step.image} alt={step.title} className="w-full max-w-md" width={1000} height={1000} />
              </motion.div>
            ))}
          </div>

          {/* Right side - Steps */}
          <div className="w-full md:w-1/2 space-y-16 py-20">
            {steps.map((step, index) => (
              <div key={index} className="relative flex gap-4 items-start group">
                <motion.div
                  animate={{
                    y: activeStep === index ? -4 : -4,
                  }}
                  transition={{duration: 0.5}}
                  className={cn(
                    "w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-xl font-extrabold font-inter transition-all duration-500",
                    activeStep === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                  {index + 1}
                </motion.div>
                <div className="flex-1">
                  <motion.h3
                    animate={{
                      y: activeStep === index ? 0 : 0,
                    }}
                    transition={{duration: 0.5}}
                    className={cn("text-2xl font-semibold transition-all duration-500 font-montserrat", activeStep === index ? "mb-4" : "mb-0")}>
                    {step.title}
                  </motion.h3>
                  <motion.p
                    initial={{opacity: 0, y: 10}}
                    animate={{
                      opacity: activeStep === index ? 1 : 0,
                      y: activeStep === index ? 0 : 10,
                    }}
                    transition={{duration: 0.5, delay: activeStep === index ? 0.2 : 0}}
                    className="font-montserrat max-w-md text-md">
                    {step.description}
                  </motion.p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
