import { AnalyticsPage } from "@/components/barbershop-dashboard";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function Page() {
  return (
    <div className="container mx-auto py-10">
      <Breadcrumb className="hidden md:flex mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Analytics</BreadcrumbPage>
            <Badge variant="outline">DEMO</Badge>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <AnalyticsPage />
    </div>
  );
}
