'use server'

import { Database } from '@/database.types';
import { createClient } from '@/utils/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { headers } from 'next/headers';

type NewAppointment = Database['public']['Tables']['appointments']['Insert']
type Service = Database['public']['Tables']['services']['Row']

// Add this new type
type CreateAppointmentData = {
  barber_id: number;
  user_id: string;
  date: string;
  time: string;
  service_ids: number[];
  barbershop_id: number;
  client_name?: string; // Optional client name for manual client entry
}

export async function createAppointment(appointmentData: CreateAppointmentData) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .rpc('book_appointment_v2_text', {
      p_barber_id: appointmentData.barber_id,
      p_user_id: appointmentData.user_id,
      p_service_ids: appointmentData.service_ids,
      p_date: appointmentData.date,
      p_time: appointmentData.time,
      p_check_only: false,
      p_client_name: appointmentData.client_name
    })

  if (error) {
    console.error('Supabase RPC error:', error);
    if (error.message === 'Time slot is not available') {
      throw new Error('This time slot is no longer available')
    }
    throw new Error(`Failed to create appointment: ${error.message}`)
  }

  // Comprehensive revalidation of all appointment-related paths
  revalidatePath('/dashboard', 'layout');
  revalidatePath('/dashboard/appointments');
  revalidatePath('/dashboard/overview');
  revalidatePath('/dashboard/appointments/week');
  revalidatePath('/dashboard/appointments/today');
  revalidatePath('/appointments');
  
  return data
}

export async function getBarberServices(barberId: number): Promise<Service[]> {
  const supabase = await createClient()
  
  type ServiceResponse = {
    services: Service
  }

  const { data, error } = await supabase
    .from('barber_services')
    .select(`
      services (
        id,
        name,
        description,
        price,
        time,
        image
      )
    `)
    .eq('barber_id', barberId) as { data: ServiceResponse[] | null, error: any }

  if (error) {
    console.error('Error fetching barber services:', error)
    return []
  }

  return data?.map(item => item.services) ?? []
}

export async function cancelAppointmentByBarber(id: number) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("appointments")
    .update({ is_cancelled_by_barber: true, is_cancelled: true }) // Also set is_cancelled for consistency
    .eq('id', id)

  if (error) {
    console.error("Error cancelling appointment:", error); // Add log
    throw new Error('Failed to cancel appointment')
  }

  // Revalidation remains important as the appointment state changed
  revalidatePath('/dashboard', 'layout');
  revalidatePath('/dashboard/appointments');
  revalidatePath('/dashboard/overview');
  revalidatePath('/dashboard/appointments/week');
  revalidatePath('/dashboard/appointments/today');
  revalidatePath('/appointments');
}

export async function getBarberAvailability(barberId: number, date: string) {
  const supabase = await createClient()
  
  // First get all potential slots
  const { data: slots, error: slotsError } = await supabase
    .from('barber_availability')
    .select('*')
    .eq('barber_id', barberId)
    .eq('date', date)
    .order('slot_time')

  if (slotsError) {
    console.error('Error fetching barber availability:', slotsError)
    return []
  }

  // Filter slots using check_time_slot_availability
  const availableSlots = [];
  
  for (const slot of slots || []) {
    const { data: isAvailable, error: checkError } = await supabase
      .rpc('check_time_slot_availability', {
        p_barber_id: barberId,
        p_date: date,
        p_time: slot.slot_time,
        p_service_ids: [] // We'll check availability without specific services first
      })

    if (!checkError && isAvailable) {
      availableSlots.push(slot);
    }
  }
  return availableSlots;
}

export async function rescheduleAppointment(
  appointmentId: string,
  date: string,
  time: string,
) {
  const supabase = await createClient();

  try {
    // Convert appointmentId to integer for database query
    const appointmentIdInt = parseInt(appointmentId);
    
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentIdInt)
      .single();

    if (appointmentError) throw appointmentError;

    // Use the specialized reschedule availability check function
    const { data: availabilityCheck, error: availabilityError } = await supabase
      .rpc('check_reschedule_availability', {
        p_appointment_id: appointmentIdInt,
        p_barber_id: appointment.barber_id,
        p_date: date,
        p_time: time,
        p_service_ids: appointment.service_ids
      });

    if (availabilityError) {
      console.error('Availability check error:', availabilityError);
      throw new Error(availabilityError.message || 'Time slot availability check failed');
    }

    // Check if the availability check was successful
    if (!availabilityCheck?.success) {
      throw new Error(availabilityCheck?.message || 'Time slot is not available');
    }

    // If the slot is available, update the appointment
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        date,
        time: time,
        end_time: availabilityCheck.end_time
      })
      .eq('id', appointmentIdInt);

    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }

    // Comprehensive revalidation of all appointment-related paths
    revalidatePath('/dashboard', 'layout');
    revalidatePath('/dashboard/appointments');
    revalidatePath('/dashboard/overview');
    revalidatePath('/dashboard/appointments/week');
    revalidatePath('/dashboard/appointments/today');
    revalidatePath('/appointments');
    
    return { success: true };
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to reschedule appointment';
    return { success: false, error: errorMessage };
  }
}

export async function getAppointments() {
  const headersList = await headers();
  const barbershopId = headersList.get('x-barbershop-id');
  
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      client:profiles!appointments_user_id_fkey(full_name, email)
    `)
    .eq('barbershop_id', barbershopId)
    .order('date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getAppointmentDetails(appointmentId: string | number) {
  const supabase = await createClient();
  const headersList = await headers();
  const barbershopId = headersList.get('x-barbershop-id');

  try {
    // Fetch appointment with client details
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        *,
        client:profiles!appointments_user_id_fkey(
          full_name,
          email
        )
      `)
      .eq('id', appointmentId)
      .eq('barbershop_id', barbershopId)
      .single();

    if (appointmentError) throw appointmentError;
    if (!appointment) throw new Error('Appointment not found');

    // Fetch services
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .in('id', appointment.service_ids);

    if (servicesError) throw servicesError;

    // Fetch barber
    const { data: barber, error: barberError } = await supabase
      .from('barbers')
      .select('*')
      .eq('id', appointment.barber_id)
      .single();

    if (barberError) throw barberError;

    return {
      appointment,
      services: services || [],
      barber
    };
  } catch (error) {
    console.error('Error fetching appointment details:', error);
    throw error;
  }
}

/**
 * Server action to revalidate appointment data
 * This can be called from client components via useTransition
 */
export async function revalidateAppointments() {
  // Revalidate by tag
  revalidateTag('appointments');
  
  // Also revalidate specific paths
  revalidatePath('/dashboard', 'layout');
  revalidatePath('/dashboard/appointments');
  revalidatePath('/dashboard/overview');
  revalidatePath('/dashboard/appointments/week');
  revalidatePath('/dashboard/appointments/today');
  revalidatePath('/appointments');
  
  return { success: true };
}