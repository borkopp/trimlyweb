import {getServices} from "@/app/actions/dashboard-actions";
import ServicesPageClient from "./ServicesPageClient";

export default async function ServicesPage() {
  const services = await getServices();

  async function refreshServices() {
    "use server";
    return await getServices();
  }

  return <ServicesPageClient initialServices={services} refreshServices={refreshServices} />;
}
