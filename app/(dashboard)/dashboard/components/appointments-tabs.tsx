import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import {ListFilter, File} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppointmentsSection from "@/components/dashboard/AppointmentsSection";
import {getDayAppointments, getWeekAppointments, getAllAppointments} from "@/lib/supabase/queries";
import Link from "next/link";
import {Suspense} from "react";
import ClientTabsUI from "./client-tabs-ui";

// Server component to fetch data
async function AppointmentsData({view}: {view: string}) {
  if (view === "week") {
    const weekAppointments = await getWeekAppointments();
    return <AppointmentsSection appointments={weekAppointments} />;
  } else if (view === "all") {
    const allAppointments = await getAllAppointments();
    return <AppointmentsSection appointments={allAppointments} />;
  } else {
    // Default to 'today'
    const dayAppointments = await getDayAppointments(new Date().toISOString().split("T")[0]);
    return <AppointmentsSection appointments={dayAppointments} />;
  }
}

// Main AppointmentsTabs component
export default async function AppointmentsTabs({searchParams}: {searchParams?: {view?: string}}) {
  const view = searchParams?.view || "today";

  return (
    <Tabs defaultValue={view} value={view}>
      <ClientTabsUI currentView={view} />
      <TabsContent value="today" className="mt-4">
        {view === "today" && (
          <Suspense fallback={<div>Loading today&apos;s appointments...</div>}>
            <AppointmentsData view="today" />
          </Suspense>
        )}
      </TabsContent>
      <TabsContent value="week" className="mt-4">
        {view === "week" && (
          <Suspense fallback={<div>Loading week appointments...</div>}>
            <AppointmentsData view="week" />
          </Suspense>
        )}
      </TabsContent>
      <TabsContent value="all" className="mt-4">
        {view === "all" && (
          <Suspense fallback={<div>Loading all upcoming appointments...</div>}>
            <AppointmentsData view="all" />
          </Suspense>
        )}
      </TabsContent>
    </Tabs>
  );
}
