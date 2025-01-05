"use client";

import React, {useState, useEffect} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {Button} from "./ui/button";
import {createClient} from "@/utils/supabase/client";
import {signOut} from "@/app/(auth)/actions";
import {Menu, X, ArrowRightIcon} from "lucide-react";
import {CalendarScript} from "./CalendarScript";
import InteractiveHoverButton from "./ui/interactive-hover-button";
import {ModeToggle} from "./theme-toggle";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({data}) => {
      setUser(data.user);
    });
  }, []);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => {
        const element = document.querySelector(path);
        element?.scrollIntoView({behavior: "smooth"});
      }, 100);
    } else {
      const element = document.querySelector(path);
      element?.scrollIntoView({behavior: "smooth"});
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    {href: "#solution", label: "Features"},
    {href: "#pricing", label: "Pricing"},
    {href: "/contact", label: "Contact"},
  ];

  return (
    <div
      className={`fixed z-50 transition-all duration-500 ease-in-out transform left-1/2 -translate-x-1/2
      ${
        isScrolled
          ? "h-14 w-[40%]  rounded-full dark:bg-black/70 bg-white backdrop-blur-lg border border-black/10 shadow-lg dark:border-white/10 top-5 px-6"
          : "h-16 w-full top-0 backdrop-blur-none bg-transparent px-4 sm:px-8 md:px-16 lg:px-72"
      }
      origin-center`}>
      <div className="w-full h-full flex items-center justify-between gap-4 transition-all duration-500 ease-in-out relative">
        {/* Logo */}
        <div className="flex-shrink-0 z-10">
          <Link
            href="/"
            className={`font-ff cursor-pointer text-primary transform transition-all duration-500 ease-in-out inline-block
text-xl`}>
            fadely
          </Link>
        </div>

        {/* Desktop navigation - centered */}
        <div
          className={`hidden md:flex items-center justify-center gap-1 transition-all duration-500 ease-in-out transform absolute left-1/2 -translate-x-1/2
          ${isScrolled ? "scale-90" : "scale-100"}`}>
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} onClick={(e) => (item.href.startsWith("#") ? handleNavigation(e, item.href) : null)}>
              <Button
                variant="ghost"
                size="sm"
                className={`text-sm font-semibold ${pathname === item.href ? "text-primary" : "text-neutral-500 hover:text-primary"}`}>
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* User actions - right aligned */}
        <div className={`hidden md:flex items-center gap-2 flex-shrink-0 transition-all duration-500 ease-in-out transform z-10`}>
          <ModeToggle />
          <Button
            size="sm"
            variant="outline"
            className="px-3 text-xs font-semibold"
            data-cal-link="fadely/30min"
            data-cal-namespace="30min"
            data-cal-config='{"layout":"month_view"}'>
            Book a call
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-black/90 p-4 md:hidden">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} onClick={(e) => (item.href.startsWith("#") ? handleNavigation(e, item.href) : null)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-sm w-full justify-start mb-2 ${pathname === item.href ? "text-primary" : "text-neutral-500 hover:text-primary"}`}>
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
      <CalendarScript />
    </div>
  );
}
