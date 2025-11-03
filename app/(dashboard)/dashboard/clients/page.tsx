import { createClient } from "@/utils/supabase/server";
import ClientsPageClient from "./ClientsPageClient";
import { notFound } from "next/navigation";
import { Database } from "@/database.types";
import { tenantContext } from "@/lib/tenant-context";

type ServiceAppointment = {
  services: Database["public"]["Tables"]["services"]["Row"];
};

type AppointmentWithServices =
  Database["public"]["Tables"]["appointments"]["Row"] & {
    services: ServiceAppointment[];
  };

type ClientWithAppointments =
  Database["public"]["Tables"]["profiles"]["Row"] & {
    appointments: AppointmentWithServices[];
  };

export default async function ClientsPage() {
  const supabase = await createClient();
  const tenant = await tenantContext.getTenantContext();
  const barbershopId = tenant && !tenant.isMainDomain && tenant.id > 0 ? tenant.id : null;

  // First get all barber user IDs for this barbershop
  const { data: barbers } = await supabase
    .from("barbers")
    .select("user_id");

  const barberIds = barbers?.map((b) => b.user_id).filter(Boolean) || [];

  // Fetch all clients (profiles) with their appointment counts and latest appointment
  const { data: clients, error } = await supabase
    .from("profiles")
    .select(
      `
      *,
      appointments (
        id,
        date,
        time,
        is_cancelled,
        services:service_appointments (
          services (
            id,
            name,
            price
          )
        )
      )
    `
    )
    
    .not("id", "in", `(${barberIds.join(",")})`)
    .order("full_name");

  if (error) {
    console.error("Error fetching clients:", error);
    notFound();
  }

  // Transform the data to match the expected format
  const transformedClients = (clients || []).map(
    (client: ClientWithAppointments) => ({
      ...client,
      appointments: (client.appointments || []).map(
        (apt: AppointmentWithServices) => ({
          ...apt,
          services:
            apt.services?.map((s: ServiceAppointment) => s.services).flat() ||
            [],
        })
      ),
    })
  );

  return <ClientsPageClient initialClients={transformedClients} />;
}
