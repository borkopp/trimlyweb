import {Suspense} from "react";
import {getBarbers, getServices} from "@/app/actions/dashboard-actions";
import BarbersPageClient from "./BarbersPageClient";
import {Skeleton} from "@/components/ui/skeleton";

export default function Page() {
  return (
    <Suspense fallback={<BarbersSkeleton />}>
      <BarbersPage />
    </Suspense>
  );
}

async function BarbersPage() {
  const barbers = await getBarbers();
  const services = await getServices();

  async function refreshBarbers() {
    "use server";
    return await getBarbers();
  }

  return <BarbersPageClient initialBarbers={barbers} initialServices={services} refreshBarbers={refreshBarbers} />;
}

function BarbersSkeleton() {
  return (
    <div className="container mx-auto py-10">
      <Skeleton className="w-48 h-6 mb-4" /> {/* Breadcrumb skeleton */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="w-64 h-10" /> {/* Search input skeleton */}
        <Skeleton className="w-40 h-10" /> {/* Add New Barber button skeleton */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({length: 6}).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" /> /* Barber card skeleton */
        ))}
      </div>
    </div>
  );
}
