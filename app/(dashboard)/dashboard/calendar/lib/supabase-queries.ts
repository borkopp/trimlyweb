import { createClient } from "@/utils/supabase/client";
import type { DatabaseAppointment, DatabaseService, DatabaseBarber } from "./appointment-adapters";

// Types for the joined query results
interface AppointmentWithRelations {
  id: number;
  user_id: string | null;
  barber_id: number;
  date: string;
  time: string;
  end_time: string | null;
  duration: number | null;
  service_ids: number[];
  is_cancelled: boolean;
  is_cancelled_by_barber: boolean;
  cancellation_reason: string | null;
  barbershop_id: number;
  name: string | null;
  barbers: {
    name: string;
    image: string | null;
  } | null;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

/**
 * Get appointments with joined barber and customer data
 */
export async function fetchAppointments(
  barbershopId: number = 1,
  startDate?: string,
  endDate?: string
): Promise<{ appointments: DatabaseAppointment[]; error: string | null }> {
  const supabase = createClient();
  
  try {
    let query = supabase
      .from('appointments')
      .select(`
        id,
        user_id,
        barber_id,
        date,
        time,
        end_time,
        duration,
        service_ids,
        is_cancelled,
        is_cancelled_by_barber,
        cancellation_reason,
        barbershop_id,
        name,
        barbers!appointments_barber_id_fkey (
          name,
          image
        ),
        profiles!appointments_user_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .eq('barbershop_id', barbershopId)
      .eq('is_cancelled', false)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    // Add date range filtering if provided
    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching appointments:', error);
      return { appointments: [], error: error.message };
    }

    // Transform the joined data to match our expected format
    const appointments: DatabaseAppointment[] = (data || []).map((appointment: any) => ({
      ...appointment,
      barber_name: appointment.barbers?.name || 'Unknown Barber',
      barber_image: appointment.barbers?.image || null,
      customer_name: appointment.profiles?.full_name || null,
      customer_avatar: appointment.profiles?.avatar_url || null,
    }));

    return { appointments, error: null };
  } catch (err) {
    console.error('Unexpected error fetching appointments:', err);
    return { 
      appointments: [], 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Get all barbers for a barbershop
 */
export async function fetchBarbers(
  barbershopId: number = 1
): Promise<{ barbers: DatabaseBarber[]; error: string | null }> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('barbers')
      .select('*')
      .eq('barbershop_id', barbershopId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching barbers:', error);
      return { barbers: [], error: error.message };
    }

    return { barbers: data || [], error: null };
  } catch (err) {
    console.error('Unexpected error fetching barbers:', err);
    return { 
      barbers: [], 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Get all services for a barbershop
 */
export async function fetchServices(
  barbershopId: number = 1
): Promise<{ services: DatabaseService[]; servicesMap: Record<number, DatabaseService>; error: string | null }> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('services')
      .select('id, name, description, time, price')
      .eq('barbershop_id', barbershopId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
      return { services: [], servicesMap: {}, error: error.message };
    }

    const services = data || [];
    const servicesMap = services.reduce((acc, service) => {
      acc[service.id] = service;
      return acc;
    }, {} as Record<number, DatabaseService>);

    return { services, servicesMap, error: null };
  } catch (err) {
    console.error('Unexpected error fetching services:', err);
    return { 
      services: [], 
      servicesMap: {},
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Get calendar date range for fetching appointments
 */
export function getCalendarDateRange(selectedDate: Date): { startDate: string; endDate: string } {
  // Get a range that covers the month view plus some buffer
  const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
  const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 2, 0);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
} 