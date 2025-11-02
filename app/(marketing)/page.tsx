import { redirect } from "next/navigation";
import { tenantContext } from "@/lib/tenant-context";
import HomeClient from "./HomeClient";

export default async function Home() {
  const tenant = await tenantContext.getTenantContext();

  if (!tenant.isMainDomain && tenant.subdomain !== "main") {
    redirect("/login");
  }

  return <HomeClient />;
}
