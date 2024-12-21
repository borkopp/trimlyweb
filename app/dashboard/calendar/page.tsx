import {Suspense} from "react";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {Database} from "@/database.types";
import CalendarClient from "./CalendarClient";
import {Skeleton} from "@/components/ui/skeleton";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {Appointment} from "@/types/appointments";
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {AppointmentDetails} from "@/components/dashboard/AppointmentDetails";

export const dynamic = "force-dynamic";

async function getAppointments(): Promise<Appointment[]> {
  const supabase = createServerComponentClient<Database>({cookies});

  const {data, error} = await supabase
    .from("appointments")
    .select(
      `
      *,
      client:profiles!appointments_user_id_fkey(*)
    `
    )
    .order("date", {ascending: true})
    .order("time", {ascending: true});

  if (error) throw error;

  return data as Appointment[];
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
    <div className="flex h-screen">
      <Skeleton className="w-64 h-full" />
      <div className="flex-1 p-4">
        <Skeleton className="w-full h-12 mb-4" />
        <div className="grid grid-cols-8 gap-2">
          {Array.from({length: 64}).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
