"use client";

import {motion, Variants} from "framer-motion";
import {cn} from "@/lib/utils";

interface WordPullUpProps {
  words: string;
  delayMultiple?: number;
  wrapperFramerProps?: Variants;
  framerProps?: Variants;
  className?: string;
}

export default function WordPullUp({
  words,
  wrapperFramerProps = {
    hidden: {opacity: 0},
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  },
  framerProps = {
    hidden: {y: 20, opacity: 0},
    show: {y: 0, opacity: 1},
  },
  className,
}: WordPullUpProps) {
  return (
    <motion.h1
      variants={wrapperFramerProps}
      initial="hidden"
      animate="show"
      className={cn("font-display text-center text-4xl font-bold tracking-[-0.02em] drop-shadow-sm", className)}>
      {words.split(" ").map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: {y: 20, opacity: 0, filter: "blur(10px)"},
            show: {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                y: {...framerProps.show},
                opacity: {...framerProps.show},
                filter: {duration: 0.2},
              },
            },
          }}
          className="inline-block dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-b dark:from-neutral-200 dark:to-neutral-600 text-neutral-800 px-[0.05em] leading-[1.2]">
          {word === "" ? <span>&nbsp;</span> : word}
        </motion.span>
      ))}
    </motion.h1>
  );
}
