"use client";

import { CalendarPlus, Search } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AppointmentDialog } from "@/components/appointment-dialog";
import { SearchClientDialog } from "@/components/search-client-dialog";

interface QuickActionsProps {
  userId: string;
  barbershopId?: string;
}

export function QuickActions({
  userId,
  barbershopId = "1",
}: QuickActionsProps) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <AppointmentDialog userId={userId} barbershopId={barbershopId}>
            <SidebarMenuButton className="hover:bg-secondary">
              <CalendarPlus className="h-4 w-4" />
              <span>Book Appointment</span>
            </SidebarMenuButton>
          </AppointmentDialog>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SearchClientDialog>
            <SidebarMenuButton className="hover:bg-secondary">
              <Search className="h-4 w-4" />
              <span>Search Client</span>
            </SidebarMenuButton>
          </SearchClientDialog>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
