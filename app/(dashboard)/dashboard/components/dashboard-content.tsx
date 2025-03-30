import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {headers} from "next/headers";
import {AppointmentDetailsOverview} from "@/components/dashboard/AppointmentDetailsOverview";
import DashboardStats from "./dashboard-stats";
import AppointmentsTabs from "./appointments-tabs";
import {Suspense} from "react";
import RealtimeAppointments from "./realtime-appointments";

export default async function DashboardContent({searchParams}: {searchParams?: {view?: string}}) {
  // Authentication check
  const supabase = createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get barbershop ID from headers
  const headersList = headers();
  const barbershopId = headersList.get("x-barbershop-id") || "1";

  return (
    <>
      {/* Real-time subscription component */}
      <RealtimeAppointments barbershopId={barbershopId} />

      <main className="grid flex-1 items-start gap-2 p-10 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          {/* Dashboard stats (Overview, Appointments, Revenue) */}
          <Suspense fallback={<div>Loading stats...</div>}>
            <DashboardStats userId={user.id} barbershopId={barbershopId} />
          </Suspense>

          {/* Appointments tabs (Today, Week) */}
          <Suspense fallback={<div>Loading appointments...</div>}>
            <AppointmentsTabs searchParams={searchParams} />
          </Suspense>

          {/* Mobile appointment details (hidden on desktop) */}
          <div className="col-span-4 space-y-4 lg:col-span-1 lg:hidden">
            <AppointmentDetailsOverview />
          </div>
        </div>

        {/* Desktop appointment details (hidden on mobile) */}
        <div className="col-span-4 hidden space-y-4 lg:col-span-1 lg:block">
          <AppointmentDetailsOverview />
        </div>
      </main>
    </>
  );
}
