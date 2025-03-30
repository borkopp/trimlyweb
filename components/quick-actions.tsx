"use client";

import {CalendarPlus, Search} from "lucide-react";
import {useRouter} from "next/navigation";
import {SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import {AppointmentDialog} from "@/components/appointment-dialog";
import {useCallback} from "react";

interface QuickActionsProps {
  userId: string;
  barbershopId?: string;
}

export function QuickActions({userId, barbershopId = "1"}: QuickActionsProps) {
  const router = useRouter();

  const handleSearchClient = useCallback(() => {
    router.push("/dashboard/clients?search=true");
  }, [router]);

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
          <SidebarMenuButton onClick={handleSearchClient} className="hover:bg-secondary">
            <Search className="h-4 w-4" />
            <span>Search Client</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
