import {Suspense} from "react";
import ServicesPage from "./ServicesPage";
import {Skeleton} from "@/components/ui/skeleton";

export default function Page() {
  return (
    <Suspense fallback={<ServicesSkeleton />}>
      <ServicesPage />
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
