"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { fetchAppointments, fetchServices, getCalendarDateRange } from "@/calendar/lib/supabase-queries";
import { transformAppointmentsToEvents } from "@/calendar/lib/appointment-adapters";
import type { IEvent } from "@/calendar/interfaces";
import type { DatabaseAppointment, DatabaseService } from "@/calendar/lib/appointment-adapters";

interface UseRealtimeAppointmentsResult {
  events: IEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRealtimeAppointments(
  selectedDate: Date,
  barbershopId: number = 1
): UseRealtimeAppointmentsResult {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [servicesMap, setServicesMap] = useState<Record<number, DatabaseService>>({});

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get date range for the current calendar view
      const { startDate, endDate } = getCalendarDateRange(selectedDate);

      // Fetch appointments and services in parallel
      const [appointmentsResult, servicesResult] = await Promise.all([
        fetchAppointments(barbershopId, startDate, endDate),
        fetchServices(barbershopId),
      ]);

      if (appointmentsResult.error) {
        throw new Error(`Failed to fetch appointments: ${appointmentsResult.error}`);
      }

      if (servicesResult.error) {
        throw new Error(`Failed to fetch services: ${servicesResult.error}`);
      }

      // Update services map
      setServicesMap(servicesResult.servicesMap);

      // Transform appointments to calendar events
      const transformedEvents = transformAppointmentsToEvents(
        appointmentsResult.appointments,
        servicesResult.servicesMap
      );

      setEvents(transformedEvents);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch appointment data';
      console.error('Error fetching appointment data:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, barbershopId]);

  // Set up realtime subscription
  useEffect(() => {
    const supabase = createClient();

    // Initial data fetch
    fetchData();

    // Set up realtime subscription for appointments
    const channel = supabase
      .channel('calendar-appointments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `barbershop_id=eq.${barbershopId}`,
        },
        (payload) => {
          console.log('Realtime appointment change:', payload);
          
          // Refetch data when appointments change
          // This ensures we get the complete updated data with all joins
          fetchData();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData, barbershopId]);

  // Refetch when selected date changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    events,
    loading,
    error,
    refetch: fetchData,
  };
} 