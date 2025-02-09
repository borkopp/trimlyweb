import {Suspense} from "react";
import SettingsPageClient from "./SettingsPageClient";
import {Skeleton} from "@/components/ui/skeleton";

export default function Page() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsPage />
    </Suspense>
  );
}

function SettingsPage() {
  // Mock data
  const mockSettings = {
    id: 1,
    name: "Sample Barbershop",
    location: "123 Main St",
    phone: "+1234567890",
    opening_time: "09:00",
    closing_time: "18:00",
    description: null,
    subdomain: "sample",
  };

  return <SettingsPageClient initialSettings={mockSettings} />;
}

function SettingsSkeleton() {
  return (
    <div className="container mx-auto py-10">
      <Skeleton className="w-48 h-6 mb-4" />
      <Skeleton className="h-[600px] w-full" />
    </div>
  );
}
