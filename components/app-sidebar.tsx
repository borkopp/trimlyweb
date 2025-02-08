"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Scissors,
  Home,
  Calendar,
  Users2,
  LineChart,
  CalendarPlus,
  Search,
} from "lucide-react";

import {NavMain} from "@/components/nav-main";
import {NavProjects} from "@/components/nav-projects";
import {NavUser} from "@/components/nav-user";
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail} from "@/components/ui/sidebar";
import {Database} from "@/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Move the static data outside the component
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
    url: "#",
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
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings2,
    items: [
      {
        title: "General",
        url: "/dashboard/settings",
      },
      {
        title: "Team",
        url: "/dashboard/settings/team",
      },
      {
        title: "Billing",
        url: "/dashboard/settings/billing",
      },
    ],
  },
];

const projectItems = [
  {
    name: "Book Appointment",
    url: "/dashboard/calendar?new=true",
    icon: CalendarPlus,
  },
  {
    name: "Search Client",
    url: "/dashboard/clients?search=true",
    icon: Search,
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: Profile | null;
}

export function AppSidebar({user, ...props}: AppSidebarProps) {
  if (!user) return null;

  const userData = {
    name: user.full_name || "Unknown",
    email: user.email || "",
    avatar: user.avatar_url || "/og-image.png",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-white dark:bg-[#18181B]">
        <NavUser user={userData} />
      </SidebarHeader>
      <SidebarContent className="bg-white dark:bg-[#18181B]">
        <NavMain items={navMainItems} />
        <NavProjects projects={projectItems} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
