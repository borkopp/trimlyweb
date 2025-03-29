'use server';

import { createClient } from '@/utils/supabase/server';
import { Database } from '@/database.types';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

type Barber = Database['public']['Tables']['barbers']['Row'];
type Service = Database['public']['Tables']['services']['Row'];
type AvailableDate = {
  date_value: string;
  has_availability: boolean;
};
type AvailableSlot = {
  time_slot: string;
  end_time: string;
  is_available: boolean;
};

/**
 * Get all active barbers for a barbershop
 */
export async function getBarbers() {
  const supabase = createClient();
  const headersList = headers();
  const barbershopId = headersList.get('x-barbershop-id') || '1'; // Fallback to default barbershop ID if header is missing
  
  try {
    const { data, error } = await supabase
      .from('barbers')
      .select(`
        id,
        name,
        description,
        image,
        email
      `)
      .eq('barbershop_id', barbershopId);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching barbers:', error);
    throw new Error(`Failed to fetch barbers: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get services for a specific barber
 */
export async function getBarberServices(barberId: number): Promise<Service[]> {
  const supabase = createClient();
  
  // Get service IDs for this barber
  const { data: serviceLinks, error: linkError } = await supabase
    .from('barber_services')
    .select('service_id')
    .eq('barber_id', barberId);
  
  if (linkError || !serviceLinks || serviceLinks.length === 0) {
    console.error('Error fetching barber service links:', linkError);
    return [];
  }
  
  // Extract service IDs
  const serviceIds = serviceLinks.map(link => link.service_id).filter(Boolean) as number[];
  
  if (serviceIds.length === 0) {
    return [];
  }
  
  // Get service details
  const { data: services, error: serviceError } = await supabase
    .from('services')
    .select('*')
    .in('id', serviceIds);
  
  if (serviceError) {
    console.error('Error fetching services:', serviceError);
    return [];
  }
  
  return services || [];
}

/**
 * Get available dates for a barber
 */
export async function getBarberAvailableDates(
  barberId: number,
  daysAhead: number = 30
): Promise<AvailableDate[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .rpc('get_barber_available_dates', {
      p_barber_id: barberId,
      p_days_ahead: daysAhead
    });
  
  if (error) {
    console.error('Error fetching available dates:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Get available time slots for a barber on a specific date
 */
export async function getBarberAvailableSlots(
  barberId: number,
  date: string,
  serviceIds: number[] = []
): Promise<AvailableSlot[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .rpc('get_barber_available_slots', {
      p_barber_id: barberId,
      p_date: date,
      p_service_ids: serviceIds.length > 0 ? serviceIds : null
    });
  
  if (error) {
    console.error('Error fetching available time slots:', error);
    return [];
  }
  
  // Only return slots that are available
  return data?.filter((slot: AvailableSlot) => slot.is_available) || [];
}

/**
 * Create a new appointment
 */
export async function createAppointment(
  barberId: number,
  userId: string,
  serviceIds: number[],
  date: string,
  time: string,
  isGuest: boolean = false,
  temporaryUserId: number | null = null
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .rpc('book_appointment_v2', {
      p_barber_id: barberId,
      p_user_id: userId,
      p_service_ids: serviceIds,
      p_date: date,
      p_time: time,
      p_is_guest: isGuest,
      p_temporary_user_id: temporaryUserId,
      p_check_only: false
    });
  
  if (error) {
    console.error('Error creating appointment:', error);
    throw new Error(error.message || 'Failed to create appointment');
  }
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to create appointment');
  }
  
  // Revalidate relevant paths to update UI
  revalidatePath('/dashboard/appointments');
  revalidatePath('/appointments');
  
  return data;
}

/**
 * Check if a time slot is available without booking it
 */
export async function checkTimeSlotAvailability(
  barberId: number,
  serviceIds: number[],
  date: string,
  time: string
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .rpc('book_appointment_v2', {
      p_barber_id: barberId,
      p_user_id: 'check-only',  // This doesn't matter for check_only=true
      p_service_ids: serviceIds,
      p_date: date,
      p_time: time,
      p_check_only: true
    });
  
  if (error) {
    console.error('Error checking time slot availability:', error);
    return { success: false, message: error.message };
  }
  
  return data;
}

/**
 * Calculate the total duration in minutes for selected services
 */
export async function calculateServicesDuration(serviceIds: number[]): Promise<number> {
  if (!serviceIds.length) return 30; // Default duration
  
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('services')
    .select('time')
    .in('id', serviceIds);
  
  if (error || !data) {
    console.error('Error calculating services duration:', error);
    return 30; // Default duration
  }
  
  return data.reduce((total, service) => total + (service.time || 0), 0);
}

/**
 * Get barber and service images with preloaded URLs
 */
export async function getBarberServiceImages(
  barbers: Barber[],
  services?: Service[]
) {
  const supabase = createClient();
  const barberAvatars: Record<number, string> = {};
  const serviceImages: Record<number, string> = {};
  
  // Process barber images
  for (const barber of barbers) {
    if (barber.image) {
      const { data } = await supabase.storage.from('barber-images').getPublicUrl(barber.image);
      if (data?.publicUrl) {
        barberAvatars[barber.id] = data.publicUrl;
      }
    }
  }
  
  // Process service images if provided
  if (services) {
    for (const service of services) {
      if (service.image) {
        const { data } = await supabase.storage.from('barber-images').getPublicUrl(service.image);
        if (data?.publicUrl) {
          serviceImages[service.id] = data.publicUrl;
        }
      }
    }
  }
  
  return { barberAvatars, serviceImages };
} 