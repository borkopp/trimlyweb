"use client";

import { CalendarPlus, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AppointmentDialog } from "@/components/appointment-dialog";
import { SearchClientDialog } from "@/components/search-client-dialog";
import { CommandShortcut } from "./ui/command";

interface QuickActionsProps {
  userId: string;
  barbershopId?: string;
}

export function QuickActions({
  userId,
  barbershopId = "1",
}: QuickActionsProps) {
  const appointmentDialogRef = useRef<HTMLButtonElement>(null);
  const searchDialogRef = useRef<HTMLButtonElement>(null);

  // Listen for command palette triggered actions
  useEffect(() => {
    const handleBookAppointment = () => {
      appointmentDialogRef.current?.click();
    };

    const handleSearchClient = () => {
      searchDialogRef.current?.click();
    };

    // Add event listeners for custom events from command palette
    window.addEventListener("command-book-appointment", handleBookAppointment);
    window.addEventListener("command-search-client", handleSearchClient);

    return () => {
      window.removeEventListener(
        "command-book-appointment",
        handleBookAppointment
      );
      window.removeEventListener("command-search-client", handleSearchClient);
    };
  }, []);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <AppointmentDialog userId={userId} barbershopId={barbershopId}>
            <SidebarMenuButton
              ref={appointmentDialogRef}
              className="hover:bg-secondary"
            >
              <CalendarPlus className="h-4 w-4" />
              <span>Book Appointment</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </SidebarMenuButton>
          </AppointmentDialog>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SearchClientDialog>
            <SidebarMenuButton
              ref={searchDialogRef}
              className="hover:bg-secondary"
            >
              <Search className="h-4 w-4" />
              <span>Search Client</span>
              <CommandShortcut>⌘⇧F</CommandShortcut>
            </SidebarMenuButton>
          </SearchClientDialog>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
