"use client";

import { usePathname } from "next/navigation";
import { DashboardHeader } from "./header";
import { ModeToggle } from "@/components/theme-toggle";
import { PanelLeft, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

const BREADCRUMB_TITLES: Record<string, string> = {
  calendar: "Calendar",
  clients: "Clients",
  barbers: "Barbers",
  services: "Services",
  analytics: "Analytics",
  settings: "Settings",
  overview: "Overview",
  "month-view": "Calendar",
  "day-view": "Calendar",
  "week-view": "Calendar",
};

export function DashboardHeaderWithBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isCalendarView =
    pathname.includes("/month-view") ||
    pathname.includes("/day-view") ||
    pathname.includes("/week-view");

  let processedBreadcrumbs = [];

  if (segments.length === 1) {
    processedBreadcrumbs = [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Overview" },
    ];
  } else if (isCalendarView) {
    processedBreadcrumbs = [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Calendar", href: "/dashboard/calendar/month-view" },
    ];
  } else {
    processedBreadcrumbs = [
      { title: "Dashboard", href: "/dashboard" },
      ...segments.slice(1).map((segment, index) => {
        const href =
          index === segments.length - 2
            ? undefined
            : `/dashboard/${segments.slice(1, index + 2).join("/")}`;
        const title = BREADCRUMB_TITLES[segment] || segment;

        return {
          title,
          href,
        };
      }),
    ];
  }

  return (
    <div className="flex items-center justify-between bg-background border-b sticky top-0 z-50">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 ml-2"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        <DashboardHeader breadcrumbs={processedBreadcrumbs} />
      </div>
      <div className="flex items-center gap-2 pr-4">
        <ModeToggle />
      </div>
    </div>
  );
}
