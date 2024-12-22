import {getServices} from "@/app/actions/dashboard-actions";
import ServicesPageClient from "./ServicesPageClient";
import {headers} from "next/headers";

export default async function ServicesPage() {
  const services = await getServices();
  const headersList = headers();
  const barbershopId = parseInt(headersList.get("x-barbershop-id") || "0");

  async function refreshServices() {
    "use server";
    return await getServices();
  }

  return <ServicesPageClient initialServices={services} refreshServices={refreshServices} barbershopId={barbershopId} />;
}
