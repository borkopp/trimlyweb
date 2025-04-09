import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {headers} from "next/headers";
import {AppointmentDetailsOverview} from "@/components/dashboard/AppointmentDetailsOverview";
import DashboardStats from "./dashboard-stats";
import {Suspense} from "react";
import AppointmentsList from "@/components/dashboard/AppointmentsList";
import {Database} from "@/database.types";

// Define the expected shape of fetched appointments including the client profile
type AppointmentWithClient = Database["public"]["Tables"]["appointments"]["Row"] & {
  client: Database["public"]["Tables"]["profiles"]["Row"] | null; // Client might not exist
};

export default async function DashboardContent({searchParams}: {searchParams?: {view?: string}}) {
  // Authentication check
  const supabase = createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get barbershop ID from headers and convert to number
  const headersList = headers();
  const barbershopIdString = headersList.get("x-barbershop-id") || "1"; // Default to "1" if header is missing
  const barbershopId = parseInt(barbershopIdString, 10);

  if (isNaN(barbershopId)) {
      console.error("Invalid barbershop ID header:", barbershopIdString);
      // Handle error appropriately, maybe redirect or show an error message
      // For now, redirecting to a hypothetical error page
       redirect("/error?message=Invalid barbershop configuration");
  }

  // Fetch initial appointments data
  let appointmentsData: AppointmentWithClient[] = [];
  try {
      const { data, error } = await supabase
          .from('appointments')
          .select(`
              *,
              client:profiles!inner(*)
          `) // Join with profiles table (assuming user_id links correctly)
          .eq('barbershop_id', barbershopId)
          .order('date', { ascending: false }) // Initial sort, might be overridden by client-side filter
          .order('time', { ascending: true });

      if (error) {
          throw error;
      }
      // Cast the data, ensuring the client part matches the type (can be null if join fails)
      appointmentsData = (data as any[] || []).map(appt => ({
          ...appt,
          client: appt.client ? appt.client : null
      })) as AppointmentWithClient[];

      console.log(`[DashboardContent] Fetched ${appointmentsData.length} initial appointments for barbershop ${barbershopId}`);

  } catch (error) {
       console.error("[DashboardContent] Error fetching initial appointments:", error);
       // Optionally display an error message to the user
       // appointmentsData will remain []
  }

  return (
    <>
      {/* Real-time subscription is now inside AppointmentsList */}
      {/* <RealtimeAppointments barbershopId={barbershopIdString} /> */}

      <main className="grid flex-1 items-start gap-2 p-10 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          {/* Dashboard stats (Overview, Appointments, Revenue) */}
          <Suspense fallback={<div>Loading stats...</div>}>
            <DashboardStats userId={user.id} barbershopId={barbershopIdString} />
          </Suspense>

          {/* Appointments list with initial data */}
          <Suspense fallback={<div>Loading appointments...</div>}>
             {/* Pass fetched data, numeric barbershopId, and loggedInUserId */}
            <AppointmentsList
              initialAppointments={appointmentsData}
              barbershopId={barbershopId}
              loggedInUserId={user.id}
            />
          </Suspense>

          {/* Mobile appointment details (hidden on desktop) */}
          <div className="col-span-4 space-y-4 lg:col-span-1 lg:hidden">
             {/* Pass loggedInUserId here too */}
            <AppointmentDetailsOverview loggedInUserId={user.id} />
          </div>
        </div>

        {/* Desktop appointment details (hidden on mobile) */}
        <div className="col-span-4 hidden space-y-4 sticky top-20 lg:col-span-1 lg:block">
           {/* Pass loggedInUserId here too */}
          <AppointmentDetailsOverview loggedInUserId={user.id} />
        </div>
      </main>
    </>
  );
}
