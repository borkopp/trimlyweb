import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ClientProfilePage from "./ClientProfilePage";
import { Database } from "@/database.types";

type AppointmentWithDetails =
  Database["public"]["Tables"]["appointments"]["Row"] & {
    barber: Database["public"]["Tables"]["barbers"]["Row"];
    services: Database["public"]["Tables"]["services"]["Row"][];
  };

export default async function ClientProfile(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();

  // Fetch client profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    notFound();
  }

  if (!profile) {
    notFound();
  }

  // Fetch client's appointments with services and barber details
  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select(
      `
      *,
      barber:barbers!appointments_barber_id_fkey(
        id,
        name,
        email,
        image
      )
    `
    )
    .eq("user_id", params.id)
    .order("date", { ascending: false })
    .order("time", { ascending: false });

  if (appointmentsError) {
    console.error("Error fetching appointments:", appointmentsError);
  }

  // Fetch all services for these appointments
  const serviceIds = appointments?.flatMap((apt) => apt.service_ids) || [];
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("*")
    .in("id", serviceIds);

  if (servicesError) {
    console.error("Error fetching services:", servicesError);
  }

  // Create a map of service IDs to service objects for quick lookup
  const servicesMap = (services || []).reduce((map, service) => {
    map[service.id] = service;
    return map;
  }, {} as Record<number, Database["public"]["Tables"]["services"]["Row"]>);

  // Transform the appointments data to match the expected format
  const transformedAppointments: AppointmentWithDetails[] = (
    appointments || []
  ).map((apt) => {
    return {
      ...apt,
      barber: apt.barber,
      services: apt.service_ids
        .map((id: number) => servicesMap[id])
        .filter(Boolean),
    };
  });

  return (
    <ClientProfilePage
      profile={profile}
      appointments={transformedAppointments}
    />
  );
}
