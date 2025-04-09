"use client";

import {useEffect} from "react";
import {createClient} from "@/utils/supabase/client";
import {useRouter} from "next/navigation";

export default function RealtimeAppointments({barbershopId}: {barbershopId: string}) {
  const router = useRouter();

  // Set up Realtime subscription if enabled
  useEffect(() => {
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
        },

        (payload) => {
          console.log("Appointment change detected via Realtime:", payload);
          router.refresh();
        }
      )
      .subscribe();

    // Cleanup subscription when component unmounts
    return () => {
      channel.unsubscribe();
    };
  }, [barbershopId, router,]);

  // This component doesn't render anything visible
  return null;
}
