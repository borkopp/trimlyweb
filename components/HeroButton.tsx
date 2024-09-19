"use client";
import React from "react";
import {HoverBorderGradient} from "@/components/ui/hover-border-gradient";
import Link from "next/link";

export function HeroButton({text, href}: {text: string; href: string}) {
  return (
    <Link href={href}>
      <div className="flex justify-center text-center">
        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2">
          <span>{text}</span>
        </HoverBorderGradient>
      </div>
    </Link>
  );
}
