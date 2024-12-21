import {Suspense} from "react";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {Database} from "@/database.types";
import CalendarClient from "./CalendarClient";
import {Skeleton} from "@/components/ui/skeleton";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {AppointmentDetails} from "@/components/dashboard/AppointmentDetails";

export const dynamic = "force-dynamic";

type AppointmentRow = Database["public"]["Tables"]["appointments"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type BarberRow = Database["public"]["Tables"]["barbers"]["Row"];

interface Appointment extends AppointmentRow {
  client: ProfileRow;
  barber: BarberRow;
  services: ServiceRow[];
}

async function getAppointments(): Promise<Appointment[]> {
  const supabase = createServerComponentClient<Database>({cookies});

  const {data, error} = await supabase
    .from("appointments")
    .select(
      `
      *,
      client:profiles!appointments_user_id_fkey(*),
      barber:barbers(*),
      services:service_appointments(
        services(*)
      )
    `
    )
    .order("date", {ascending: true})
    .order("time", {ascending: true});

  if (error) throw error;

  const transformedData = (data || []).map((apt) => ({
    ...apt,
    services: apt.services?.map((s) => s.services).flat() || [],
  }));

  return transformedData as Appointment[];
}

export default async function CalendarPage() {
  const appointments = await getAppointments();

  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <CalendarClient initialAppointments={appointments} />
    </Suspense>
  );
}

function CalendarSkeleton() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <main className="flex-1 p-6">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" /> {/* Prev button */}
            <Skeleton className="h-9 w-24" /> {/* Next button */}
            <Skeleton className="h-9 w-24" /> {/* Today button */}
          </div>
          <Skeleton className="h-9 w-48" /> {/* Title */}
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" /> {/* Day view */}
            <Skeleton className="h-9 w-24" /> {/* Week view */}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="rounded-lg border border-border h-[calc(100%-4rem)]">
          {/* Header row */}
          <div className="grid grid-cols-6 border-b border-border">
            {Array.from({length: 6}).map((_, i) => (
              <Skeleton key={i} className="h-12 m-2" />
            ))}
          </div>

          {/* Time grid */}
          <div className="grid grid-cols-[auto,1fr] h-[calc(100%-3rem)]">
            {/* Time labels */}
            <div className="space-y-6 pr-2 pt-4">
              {Array.from({length: 24}).map((_, i) => (
                <Skeleton key={i} className="h-4 w-12" />
              ))}
            </div>

            {/* Event grid */}
            <div className="grid grid-cols-6 gap-[1px]">
              {Array.from({length: 6}).map((_, i) => (
                <div key={i} className="relative">
                  {Array.from({length: 4}).map((_, j) => (
                    <Skeleton
                      key={j}
                      className="absolute h-24 left-1 right-1"
                      style={{
                        top: `${j * 120 + Math.random() * 50}px`,
                        opacity: Math.random() > 0.7 ? 1 : 0,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Sidebar */}
      <aside className="w-80 border-l p-4 hidden lg:flex flex-col">
        <Skeleton className="h-7 w-48 mb-4" /> {/* Today's Appointments heading */}
        <div className="space-y-2">
          {Array.from({length: 5}).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" /> /* Appointment cards */
          ))}
        </div>
      </aside>
    </div>
  );
}
