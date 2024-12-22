import {Suspense} from "react";
import DashboardContent from "./DashboardContent";
import {Skeleton} from "@/components/ui/skeleton";
import {AppointmentsProvider} from "@/components/dashboard/AppointmentsContext";
import {AppointmentDetails} from "@/components/dashboard/AppointmentDetails";
import {useToast} from "@/components/ui/use-toast";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Skeleton className="h-6 w-48 hidden md:block" /> {/* Breadcrumb skeleton */}
          <Skeleton className="h-10 w-full max-w-[336px] ml-auto" /> {/* Search input skeleton */}
          <Skeleton className="h-10 w-10 rounded-full" /> {/* User avatar skeleton */}
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Skeleton className="h-40 sm:col-span-2" /> {/* Overview card skeleton */}
              <Skeleton className="h-40" /> {/* Today's appointments skeleton */}
              <Skeleton className="h-40" /> {/* Estimated revenue skeleton */}
            </div>
            <Skeleton className="h-10 w-full" /> {/* Tabs skeleton */}
            <Skeleton className="h-[400px] w-full" /> {/* Appointments section skeleton */}
          </div>
          <div className="col-span-4 space-y-4 lg:col-span-1">
            <AppointmentsProvider>
              <AppointmentDetails variant="card" />
            </AppointmentsProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
