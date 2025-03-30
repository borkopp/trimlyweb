import {Suspense} from "react";
import {AppointmentsProvider} from "@/components/dashboard/AppointmentsContext";
import DashboardSkeleton from "@/app/(dashboard)/dashboard/components/dashboard-skeleton";
import DashboardContent from "@/app/(dashboard)/dashboard/components/dashboard-content";

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DashboardPage({searchParams}: {searchParams?: {view?: string}}) {
  return (
    <AppointmentsProvider>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent searchParams={searchParams} />
      </Suspense>
    </AppointmentsProvider>
  );
}
