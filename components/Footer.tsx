import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Logo } from "./logo";

export function Footer() {
  const pages = [
    {
      title: "Features",
      href: "/#solution",
    },
    {
      title: "Pricing",
      href: "/#pricing",
    },
    {
      title: "Contact",
      href: "/contact",
    },
    {
      title: "Privacy",
      href: "/legal/art-barbershop/privacy-policy",
    },
    {
      title: "Terms",
      href: "/legal/art-barbershop/terms-of-service",
    },
  ];

  return (
    <footer className="relative w-full overflow-hidden border-t border-border bg-background px-8 py-20">
      <div className="mx-auto max-w-7xl items-start justify-between text-sm text-muted-foreground md:px-8">
        <div className="relative flex w-full flex-col items-center justify-center">
          <div className="mb-4 md:mr-4 md:flex">
            <Logo />
          </div>

          <ul className="flex list-none flex-col gap-4 sm:flex-row">
            {pages.map((page) => (
              <li key={page.title} className="list-none">
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href={page.href}
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>

          <GridLineHorizontal className="max-w-7xl mx-auto mt-8" />
        </div>
        <div className="mt-8 flex w-full flex-col items-center justify-between sm:flex-row">
          <p className="mb-8 text-muted-foreground sm:mb-0">
            &copy; fadely 2026
          </p>
          <p className="text-center text-muted-foreground sm:text-right">
            Custom-built apps for modern barbershops.
          </p>
        </div>
      </div>
    </footer>
  );
}

const GridLineHorizontal = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px", //-100px if you want to keep the line inside
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "w-[calc(100%+var(--offset))] h-[var(--height)]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    ></div>
  );
};
