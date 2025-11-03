import {Suspense} from "react";
import ServicesPageClient from "./ServicesPageClient";
import {Skeleton} from "@/components/ui/skeleton";
import { tenantContext } from "@/lib/tenant-context";
import {getServices} from "@/app/actions/dashboard-actions";

export default async function Page() {
  const tenant = await tenantContext.getTenantContext();
  const barbershopId = tenant && !tenant.isMainDomain && tenant.id > 0 ? tenant.id : null;

  const services = await getServices();

  return (
    <Suspense fallback={<ServicesSkeleton />}>
      <ServicesPageClient initialServices={services} barbershopId={(barbershopId as number) || 0} refreshServices={getServices} />
    </Suspense>
  );
}

function ServicesSkeleton() {
  return (
    <div className="container mx-auto py-10">
      <Skeleton className="w-48 h-6 mb-4" /> {/* Breadcrumb skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" /> {/* Card header skeleton */}
        <div className="space-y-2">
          {/* Table header skeleton */}
          <Skeleton className="h-10 w-full" />
          {/* Table rows skeletons */}
          {Array.from({length: 5}).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
        <Skeleton className="h-10 w-40" /> {/* Add New Service button skeleton */}
      </div>
    </div>
  );
}
