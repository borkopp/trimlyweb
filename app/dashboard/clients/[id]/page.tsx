import {createClient} from "@/utils/supabase/server";
import {notFound} from "next/navigation";
import ClientProfilePage from "./ClientProfilePage";

export default async function ClientProfile({params}: {params: {id: string}}) {
  const supabase = createClient();

  // Fetch client profile
  const {data: profile} = await supabase.from("profiles").select("*").eq("id", params.id).single();

  if (!profile) {
    notFound();
  }

  // Fetch client's appointments with services and barber details
  const {data: appointments} = await supabase
    .from("appointments")
    .select(
      `
      *,
      barber:barbers(id, name, email),
      services:services(*)
    `
    )
    .eq("user_id", params.id)
    .order("date", {ascending: false})
    .order("time", {ascending: false});

  return <ClientProfilePage profile={profile} appointments={appointments || []} />;
}
