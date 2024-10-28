"use client";

import React, {useState} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {Button} from "./ui/button";
import {createClient} from "@/utils/supabase/client";
import {signOut} from "@/app/(auth)/actions";
import {Menu, X} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    setIsMenuOpen(false); // Close menu after navigation
  };

  const navItems = [
    {href: "#solution", label: "Features"},
    {href: "#pricing", label: "Pricing"},
    {href: "#faq", label: "FAQ"},
    {href: "/contact", label: "Contact"},
  ];

  return (
    <div className="w-full h-16 sticky top-0 backdrop-filter backdrop-blur-md bg-black/20 z-50 flex items-center justify-between border-b px-4 sm:px-8 md:px-16 lg:px-72">
      <div className="w-full max-w-[120rem] mx-auto h-full flex justify-between items-center">
        <Link href="/" className="font-ff text-2xl cursor-pointer text-primary">
          fadely
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} onClick={(e) => (item.href.startsWith("#") ? handleNavigation(e, item.href) : null)}>
              <Button
                variant="ghost"
                size="sm"
                className={`text-sm ${pathname === item.href ? "text-primary" : "text-neutral-500 hover:text-primary"}`}>
                {item.label}
              </Button>
            </Link>
          ))}
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

        {/* User actions */}
        <div className="hidden md:flex gap-2 items-center">
          {user ? (
            <>
              <form action={signOut}>
                <Button variant="link" size="sm" className="text-sm" type="submit">
                  Sign Out
                </Button>
              </form>
              <Link href="/dashboard">
                <Button variant="default" size="sm">
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="default">
                Log in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
