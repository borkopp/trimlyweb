"use client";

import Link from "next/link";
import {useRouter, usePathname} from "next/navigation";
import {Scissors, Home, Calendar, Users2, LineChart} from "lucide-react";
import {SheetClose} from "@/components/ui/sheet";
import {cn} from "@/lib/utils";

export function DashboardSidebarContent() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const navItems = [
    {href: "/dashboard", icon: Home, label: "Dashboard"},
    {href: "/dashboard/calendar", icon: Calendar, label: "Calendar"},
    {href: "/dashboard/barbers", icon: Users2, label: "Barbers"},
    {href: "/dashboard/services", icon: Scissors, label: "Services"},
    {href: "/dashboard/analytics", icon: LineChart, label: "Analytics"},
  ];

  return (
    <nav className="grid gap-6 text-lg font-medium">
      <Link
        href="#"
        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
        <Scissors className="h-5 w-5 transition-all group-hover:scale-110" />
        <span className="sr-only">Barbershop Dashboard</span>
      </Link>
      {navItems.map((item) => (
        <SheetClose key={item.href} asChild>
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-4 px-2.5",
              pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleNavigation(item.href)}>
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        </SheetClose>
      ))}
    </nav>
  );
}
