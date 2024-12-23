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
import {TeamSwitcher} from "@/components/team-switcher";
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/og-image.png",
  },
  teams: [
    {
      name: "Bruno's Barbershop",
      logo: Scissors,
      plan: "Pro",
    },
  ],
  navMain: [
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
  ],
  projects: [
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
  ],
};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-[#18181B]">
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent className="bg-[#18181B]">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
