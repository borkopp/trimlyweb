import { Suspense } from "react";
import { getBarbershopSettings } from "@/app/actions/dashboard-actions";
import SettingsPageClient from "./SettingsPageClient";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsPage />
    </Suspense>
  );
}

async function SettingsPage() {
  const barbershopSettings = await getBarbershopSettings();

  async function refreshSettings() {
    "use server";
    return await getBarbershopSettings();
  }

  return <SettingsPageClient initialSettings={barbershopSettings} refreshSettings={refreshSettings} />;
}

function SettingsSkeleton() {
  return (
    <div className="container mx-auto py-10">
      <Skeleton className="w-48 h-6 mb-4" />
      <Skeleton className="h-[600px] w-full" />
    </div>
  );
}
