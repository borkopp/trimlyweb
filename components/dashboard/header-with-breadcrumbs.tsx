"use client";

import {usePathname} from "next/navigation";
import {DashboardHeader} from "./header";

const BREADCRUMB_TITLES: Record<string, string> = {
  calendar: "Calendar",
  clients: "Clients",
  barbers: "Barbers",
  services: "Services",
  analytics: "Analytics",
  settings: "Settings",
  overview: "Overview",
};

export function DashboardHeaderWithBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs =
    segments.length === 1
      ? [{title: "Dashboard", href: "/dashboard"}, {title: "Overview"}]
      : [
          {title: "Dashboard", href: "/dashboard"},
          ...segments.slice(1).map((segment, index) => ({
            title: BREADCRUMB_TITLES[segment] || segment,
            href: index === segments.length - 2 ? undefined : `/dashboard/${segments.slice(1, index + 2).join("/")}`,
          })),
        ];

  return <DashboardHeader breadcrumbs={breadcrumbs} />;
}
