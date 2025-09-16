"use client";

import * as React from "react";
import { Settings2, Home, Calendar, Users2, LogOut } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Database } from "@/database.types";
import { QuickActions } from "@/components/quick-actions";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const navMainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    isActive: true,
    items: [
      {
        title: "Overview",
        url: "/dashboard",
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
      },
    ],
  },
  {
    title: "Appointments",
    url: "/dashboard/calendar",
    icon: Calendar,
    items: [
      {
        title: "Calendar",
        url: "/dashboard/calendar",
      },
      {
        title: "Clients",
        url: "/dashboard/clients",
      },
    ],
  },
  {
    title: "Management",
    url: "/dashboard/services",
    icon: Users2,
    items: [
      {
        title: "Barbers",
        url: "/dashboard/barbers",
      },
      {
        title: "Services",
        url: "/dashboard/services",
      },
    ],
  },
  // {
  //   title: "Settings",
  //   url: "/dashboard/settings",
  //   icon: Settings2,
  //   items: [
  //     {
  //       title: "General",
  //       url: "/dashboard/settings?tab=general",
  //     },
  //     {
  //       title: "Opening Hours",
  //       url: "/dashboard/settings?tab=hours",
  //     },
  //     {
  //       title: "Notifications",
  //       url: "/dashboard/settings?tab=notifications",
  //     },
  //     {
  //       title: "Payments",
  //       url: "/dashboard/settings?tab=payments",
  //     },
  //   ],
  // },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: Profile | null;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  if (!user) return null;

  const userData = {
    name: user.full_name || "Unknown",
    email: user.email || "",
    avatar: user.avatar_url || "/og-image.png",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-muted/50 dark:bg-[#18181B]">
        <NavUser user={userData} />
      </SidebarHeader>
      <SidebarContent className="bg-muted/50 dark:bg-[#18181B]">
        <NavMain items={navMainItems} />
        <QuickActions userId={user.id} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
