import AppointmentsList from "./AppointmentsList";
import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type Props = {
  appointments: (Appointment & { client: Profile })[];
};

async function getBarbershopId(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get("x-barbershop-id");
}

export default async function AppointmentsSection({ appointments }: Props) {
  // Get current user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get barbershop ID
  const barbershopIdString = await getBarbershopId();
  const barbershopId = parseInt(barbershopIdString || "1", 10);

  if (!user) {
    return <div>User not authenticated</div>;
  }

  return (
    <div className="w-full">
      <AppointmentsList
        initialAppointments={appointments}
        barbershopId={barbershopId}
        loggedInUserId={user.id}
      />
    </div>
  );
}
