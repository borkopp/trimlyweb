import {Tabs, TabsContent} from "@/components/ui/tabs";
import AppointmentsSection from "@/components/dashboard/AppointmentsSection";
import {getDayAppointments, getWeekAppointments, getAllAppointments} from "@/lib/supabase/queries";
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
  const view = searchParams?.view || "all";

  return (
    <Tabs defaultValue={view} value={view}>
      <ClientTabsUI currentView={view} />
      <TabsContent value="all" className="mt-4">
        {view === "all" && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary self-center"></div>
              </div>
            }>
            <AppointmentsData view="all" />
          </Suspense>
        )}
      </TabsContent>
      <TabsContent value="today" className="mt-4">
        {view === "today" && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary self-center"></div>
              </div>
            }>
            <AppointmentsData view="today" />
          </Suspense>
        )}
      </TabsContent>
      <TabsContent value="week" className="mt-4">
        {view === "week" && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary self-center"></div>
              </div>
            }>
            <AppointmentsData view="week" />
          </Suspense>
        )}
      </TabsContent>
    </Tabs>
  );
}
