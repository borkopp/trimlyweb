"use client";

import {useEffect, useState} from "react";
import {createClient} from "@/utils/supabase/client";
import {useRouter} from "next/navigation";
import {checkRealtimeEnabled} from "@/lib/supabase/realtime";

export default function RealtimeAppointments({barbershopId}: {barbershopId: string}) {
  const router = useRouter();
  const [realtimeEnabled, setRealtimeEnabled] = useState<boolean | null>(null);

  // Check if Realtime is enabled on mount
  useEffect(() => {
    async function checkRealtime() {
      const isEnabled = await checkRealtimeEnabled("appointments");
      setRealtimeEnabled(isEnabled);

      if (!isEnabled) {
        console.warn("Supabase Realtime is not enabled for appointments table. Falling back to polling.");
      }
    }

    checkRealtime();
  }, []);

  // Set up Realtime subscription if enabled
  useEffect(() => {
    if (realtimeEnabled !== true) return;

    const supabase = createClient();

    // Subscribe to changes on the appointments table
    const channel = supabase
      .channel("appointment-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "appointments",
          filter: `barbershop_id=eq.${barbershopId}`, // Only for current barbershop
        },
        () => {
          console.log("Appointment change detected via Realtime, refreshing...");
          router.refresh();
        }
      )
      .subscribe();

    // Cleanup subscription when component unmounts
    return () => {
      channel.unsubscribe();
    };
  }, [barbershopId, router, realtimeEnabled]);

  // Fallback polling if Realtime is not enabled
  useEffect(() => {
    if (realtimeEnabled !== false) return;

    console.log("Using polling fallback for appointment updates");

    // Poll every 10 seconds
    const intervalId = setInterval(() => {
      console.log("Polling for appointment updates...");
      router.refresh();
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [router, realtimeEnabled]);

  // This component doesn't render anything visible
  return null;
}
