import {getBarbers, getServices} from "@/app/actions/dashboard-actions";
import BarbersPageClient from "./BarbersPageClient";

export default async function BarbersPage() {
  const barbers = await getBarbers();
  const services = await getServices();

  async function refreshBarbers() {
    "use server";
    return await getBarbers();
  }

  return <BarbersPageClient initialBarbers={barbers} initialServices={services} refreshBarbers={refreshBarbers} />;
}
