'use server'

import { Database } from '@/database.types';
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

type NewAppointment = Database['public']['Tables']['appointments']['Insert']
type Service = Database['public']['Tables']['services']['Row']

export async function createAppointment(appointmentData: {
  barber_id: number;
  user_id: string;
  date: string;
  time: string;
  service_ids: number[];
  barbershop_id: number;
}) {
  const supabase = createClient()
  
  console.log('Attempting to book appointment with data:', appointmentData);
  
  const { data, error } = await supabase
    .rpc('book_appointment', {
      p_barber_id: appointmentData.barber_id,
      p_user_id: appointmentData.user_id,
      p_barbershop_id: appointmentData.barbershop_id,
      p_date: appointmentData.date,
      p_time: appointmentData.time,
      p_service_ids: appointmentData.service_ids
    })

  if (error) {
    console.error('Supabase RPC error:', error);
    if (error.message === 'Time slot is not available') {
      throw new Error('This time slot is no longer available')
    }
    throw new Error(`Failed to create appointment: ${error.message}`)
  }

  revalidatePath('/dashboard/appointments')
  return data
}

export async function getBarberServices(barberId: number): Promise<Service[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('barber_services')
    .select(`
      service_id,
      services (*)
    `)
    .eq('barber_id', barberId)

  if (error) {
    console.error('Error fetching barber services:', error)
    return []
  }

  return data.map(item => item.services)
}

export async function deleteAppointment(id: number) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error('Failed to delete appointment')
  }

  revalidatePath('/dashboard/appointments')
}

export async function getBarberAvailability(barberId: number, date: string) {
  const supabase = createClient()
  
  console.log('Fetching availability for:', { barberId, date });
  
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

  console.log('Available slots after filtering:', availableSlots);
  return availableSlots;
}

export async function rescheduleAppointment(
  appointmentId: string,
  date: string,
  time: string,
) {
  const supabase = createClient();

  try {
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();

    if (appointmentError) throw appointmentError;

    // Use the existing book_appointment function to check availability
    const { data: bookingCheck, error: bookingError } = await supabase
      .rpc('book_appointment', {
        p_user_id: appointment.user_id,
        p_barber_id: appointment.barber_id,
        p_service_ids: appointment.service_ids,
        p_date: date,
        p_time: time,
        p_is_guest: appointment.is_guest || false,
        p_check_only: true
      });

    if (bookingError) throw bookingError;

    // If the slot is available, update the appointment
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        date,
        time: time,
        end_time: bookingCheck.end_time
      })
      .eq('id', appointmentId);

    if (updateError) throw updateError;

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    return { success: false, error: 'Failed to reschedule appointment' };
  }
}