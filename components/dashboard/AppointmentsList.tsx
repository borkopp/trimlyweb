"use client";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import AppointmentRow from "@/components/dashboard/AppointmentRow";
import {Database} from "@/database.types";
import {useEffect, useState, useMemo} from "react";
import {createClient} from "@/utils/supabase/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isToday, isThisWeek, parseISO, startOfWeek, endOfWeek, compareAsc } from 'date-fns';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type AppointmentWithClient = Database["public"]["Tables"]["appointments"]["Row"] & {
  client: Database["public"]["Tables"]["profiles"]["Row"] | null;
};

// Helper function to fetch client data for a single appointment
async function fetchClientForAppointment(appointment: Database["public"]["Tables"]["appointments"]["Row"]): Promise<AppointmentWithClient | null> {
  console.log('[fetchClientForAppointment] Fetching client for appointment ID:', appointment.id, 'User ID:', appointment.user_id);
  const supabase = createClient();
  const { data: client, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', appointment.user_id)
    .single();

  if (error || !client) {
    console.error('[fetchClientForAppointment] Error fetching client for appointment ID:', appointment.id, 'Error:', error);
    return null;
  }
  console.log('[fetchClientForAppointment] Successfully fetched client:', client.full_name, 'for appointment ID:', appointment.id);
  return { ...appointment, client };
}

// Props now include initialAppointments, barbershopId, and loggedInUserId
interface AppointmentsListProps {
    initialAppointments: AppointmentWithClient[];
    barbershopId: number;
    loggedInUserId: string;
}

export default function AppointmentsList({initialAppointments, barbershopId, loggedInUserId}: AppointmentsListProps) {
  console.log('[AppointmentsList] Rendering. Initial Props:', { initialAppointments: initialAppointments?.length, barbershopId });

  // Initialize with empty array if initialAppointments is null/undefined
  const [appointments, setAppointments] = useState<AppointmentWithClient[]>(initialAppointments || []);
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'week'>('all');
  const supabase = createClient();

  // Log initial state
  useEffect(() => {
      console.log('[AppointmentsList] State initialized. Appointments count:', appointments.length);
  }, []); // Run only once on mount

  // Update state if initialAppointments prop changes
  useEffect(() => {
    console.log('[AppointmentsList] initialAppointments prop changed. New count:', initialAppointments?.length);
    setAppointments(initialAppointments || []);
  }, [initialAppointments]);

  // Realtime subscription effect
  useEffect(() => {
    console.log(`[AppointmentsList] Setting up Realtime for * events on appointments for barbershopId: ${barbershopId}`);
    if (!barbershopId) {
        console.error("[AppointmentsList] Realtime setup skipped: barbershopId is missing.");
        return;
    }

    // Define the expected row type for clarity
    type AppointmentRowType = Database["public"]["Tables"]["appointments"]["Row"];

    const channel = supabase
      .channel(`realtime-appointments-all-${barbershopId}`)
      .on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'appointments',
            filter: `barbershop_id=eq.${barbershopId}`
        },
        async (payload: RealtimePostgresChangesPayload<AppointmentRowType>) => {
          console.log(`[Realtime * Event] Received payload for barbershop ${barbershopId}:`, payload);

          switch (payload.eventType) {
            case 'INSERT':
              console.log(`[Realtime * -> INSERT]`, payload.new);
              const newAppointmentWithClient = await fetchClientForAppointment(payload.new as AppointmentRowType);
              if (newAppointmentWithClient) {
                  setAppointments((currentAppointments) => {
                      // Prevent duplicates if event fires multiple times rapidly
                      if (currentAppointments.some(appt => appt.id === newAppointmentWithClient.id)) {
                          return currentAppointments;
                      }
                      const newState = [...currentAppointments, newAppointmentWithClient];
                      console.log('[Realtime * -> INSERT] State updated. New count:', newState.length);
                      return newState;
                  });
              } else {
                  console.warn('[Realtime * -> INSERT] Failed to fetch client data for new appointment ID:', (payload.new as AppointmentRowType).id);
              }
              break;

            case 'UPDATE':
              console.log(`[Realtime * -> UPDATE]`, payload.new);
              const updatedAppointmentWithClient = await fetchClientForAppointment(payload.new as AppointmentRowType);
              if (updatedAppointmentWithClient) {
                   setAppointments((currentAppointments) => {
                       const newState = currentAppointments.map((appt) =>
                         appt.id === updatedAppointmentWithClient.id ? updatedAppointmentWithClient : appt
                       );
                       console.log(`[Realtime * -> UPDATE] State updated for ID: ${updatedAppointmentWithClient.id}. Current count:`, newState.length);
                       return newState;
                   });
              } else {
                console.warn('[Realtime * -> UPDATE] Failed to fetch client data for updated appointment ID:', (payload.new as AppointmentRowType).id);
              }
              break;

            case 'DELETE':
               console.log(`[Realtime * -> DELETE]`, payload.old);
               const deletedAppointmentId = (payload.old as Partial<AppointmentRowType>)?.id;
               if (deletedAppointmentId) {
                    setAppointments((currentAppointments) => {
                        const newState = currentAppointments.filter((appt) => appt.id !== deletedAppointmentId);
                        console.log(`[Realtime * -> DELETE] State updated. Removed ID: ${deletedAppointmentId}. New count:`, newState.length);
                        return newState;
                    });
               } else {
                 console.warn("[Realtime * -> DELETE] Could not determine deleted appointment ID from payload:", payload.old);
               }
              break;

            default:
              console.log(`[Realtime *] Unhandled event type: ${(payload as any).eventType}`);
          }
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error(`[AppointmentsList * Channel] Realtime subscription error for barbershop ${barbershopId}:`, err);
        } else {
            console.log(`[AppointmentsList * Channel] Realtime subscription status for barbershop ${barbershopId}: ${status}`);
        }
      });

    // Cleanup
    return () => {
      console.log(`[AppointmentsList] Cleaning up Realtime * Channel for barbershopId: ${barbershopId}`);
      supabase.removeChannel(channel);
    };
  }, [supabase, barbershopId]);

  // Memoize filtered appointments
  const filteredAppointments = useMemo(() => {
    console.log(`[useMemo] Filtering appointments. Current count: ${appointments.length}, Filter: ${activeFilter}`);
    // Filter out appointments where client data failed to load initially or during realtime update
    const validAppointments = appointments.filter(appt => appt.client !== null);
    console.log(`[useMemo] Valid appointments (with client data) count: ${validAppointments.length}`);

    const now = new Date();
    const weekStartsOn = 1; // Monday

    let filtered = validAppointments; // Filter from valid appointments

    if (activeFilter === 'today') {
      filtered = filtered.filter(appt => isToday(parseISO(appt.date)));
      console.log(`[useMemo] Filtered for 'today'. Count after filter: ${filtered.length}`);
    } else if (activeFilter === 'week') {
       const start = startOfWeek(now, { weekStartsOn });
       const end = endOfWeek(now, { weekStartsOn });
       filtered = filtered.filter(appt => {
           const apptDate = parseISO(appt.date);
           return apptDate >= start && apptDate <= end;
       });
       console.log(`[useMemo] Filtered for 'week'. Count after filter: ${filtered.length}`);
    } else {
        console.log(`[useMemo] Filter is 'all'. Count remains: ${filtered.length}`);
    }

    // Sort appointments
     const sorted = filtered.sort((a, b) => {
        const dateComparison = compareAsc(parseISO(a.date), parseISO(b.date));
        if (activeFilter === 'all') {
            if (dateComparison !== 0) return -dateComparison;
            // Ensure client is not null before accessing properties for display (or handle in AppointmentRow)
            return a.time.localeCompare(b.time);
        } else {
            if (dateComparison !== 0) return dateComparison;
            return a.time.localeCompare(b.time);
        }
     });
     console.log(`[useMemo] Sorted appointments. Final count for rendering: ${sorted.length}`);
     return sorted;

  }, [appointments, activeFilter]);

  console.log(`[AppointmentsList] Ready to render table. Filtered appointments count: ${filteredAppointments.length}`);

  return (
    <div>
         {/* --- Filter Tabs --- */}
        <Tabs value={activeFilter} onValueChange={(value) => {
            console.log(`[Tabs] Filter changed to: ${value}`);
            setActiveFilter(value as 'all' | 'today' | 'week');
        }} className="mb-4">
            <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
            </TabsList>
        </Tabs>

        {/* --- Appointments Table --- */}
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  loggedInUserId={loggedInUserId}
                />
              ))
        ) : (
          <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                  {activeFilter === 'all' && 'No appointments found.'}
                  {activeFilter === 'today' && 'No appointments scheduled for today.'}
                  {activeFilter === 'week' && 'No appointments scheduled for this week.'}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    </div>
  );
}
