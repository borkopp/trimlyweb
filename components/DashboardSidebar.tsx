"use client";

import Link from "next/link";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Calendar, Home, LineChart, Scissors, Settings, User, User2, Users, Users2} from "lucide-react";
import {usePathname} from "next/navigation";

export function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/dashboard"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
          <Scissors className="h-4 w-4 text-white transition-all group-hover:scale-110" />
          <span className="sr-only">Barbershop Dashboard</span>
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/dashboard"
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                pathname === "/dashboard" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground md:h-8 md:w-8`}>
              <Home className="h-5 w-5" />
              <span className="sr-only">Dashboard</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Dashboard</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/dashboard/clients"
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                pathname === "/dashboard/clients" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground md:h-8 md:w-8`}>
              <Users2 className="h-5 w-5" />
              <span className="sr-only">Clients</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Clients</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/dashboard/calendar"
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                pathname === "/dashboard/calendar" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground md:h-8 md:w-8`}>
              <Calendar className="h-5 w-5" />
              <span className="sr-only">Calendar</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Calendar</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/dashboard/barbers"
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                pathname === "/dashboard/barbers" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground md:h-8 md:w-8`}>
              <User2 className="h-5 w-5" />
              <span className="sr-only">Barbers</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Barbers</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/dashboard/services"
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                pathname === "/dashboard/services" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground md:h-8 md:w-8`}>
              <Scissors className="h-5 w-5" />
              <span className="sr-only">Services</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Services</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/dashboard/analytics"
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                pathname === "/dashboard/analytics" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground md:h-8 md:w-8`}>
              <LineChart className="h-5 w-5" />
              <span className="sr-only">Analytics</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Analytics</TooltipContent>
        </Tooltip>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/dashboard/settings"
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                pathname === "/dashboard/settings" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground md:h-8 md:w-8`}>
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
