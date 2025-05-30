import { fetchBarbers } from "@/calendar/lib/supabase-queries";
import { transformBarbersToUsers } from "@/calendar/lib/appointment-adapters";
import type { IEvent, IUser } from "@/calendar/interfaces";

export const getEvents = async (): Promise<IEvent[]> => {
  // Events are now handled by the realtime hook in the calendar context
  // Return empty array as events will be populated by useRealtimeAppointments
  return [];
};

export const getUsers = async (): Promise<IUser[]> => {
  try {
    const { barbers, error } = await fetchBarbers();
    
    if (error) {
      console.error('Error fetching barbers:', error);
      return [];
    }
    
    return transformBarbersToUsers(barbers);
  } catch (err) {
    console.error('Unexpected error fetching users:', err);
    return [];
  }
};
