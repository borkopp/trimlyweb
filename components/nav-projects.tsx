"use client";

import {CalendarPlus, Search, type LucideIcon} from "lucide-react";
import {useRouter} from "next/navigation";

import {SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const router = useRouter();

  const quickActions = [
    {
      name: "Book Appointment",
      icon: CalendarPlus,
      action: () => router.push("/dashboard/calendar?new=true"),
    },
    {
      name: "Search Client",
      icon: Search,
      action: () => router.push("/dashboard/clients?search=true"),
    },
  ];

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
      <SidebarMenu>
        {quickActions.map((action) => (
          <SidebarMenuItem key={action.name}>
            <SidebarMenuButton onClick={action.action} className="hover:bg-secondary">
              <action.icon className="h-4 w-4" />
              <span>{action.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
