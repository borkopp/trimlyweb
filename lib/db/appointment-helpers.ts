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
  const supabase = await createClient();
  const headersList = await headers();
  const barbershopId = headersList.get("x-barbershop-id") || "1"; // Fallback to default barbershop ID if header is missing

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
  const supabase = await createClient();

  // Get service IDs for this barber
  const { data: serviceLinks, error: linkError } = await supabase
    .from("barber_services")
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
  daysAhead: number = 30,
  serviceIds: number[] = []
): Promise<AvailableDate[]> {
  const supabase = await createClient();
  let totalDuration = 30;
  if (serviceIds && serviceIds.length > 0) {
    const { data: svc, error: svcErr } = await supabase
      .from('services')
      .select('time')
      .in('id', serviceIds);
    if (svcErr) {
      console.error('Error fetching services:', svcErr);
      return [];
    }
    totalDuration = (svc || []).reduce((sum, s: any) => sum + (s.time || 30), 0) || 30;
  }

  const today = new Date();
  today.setHours(0,0,0,0);
  const results: AvailableDate[] = [];
  for (let i = 0; i <= daysAhead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const { data, error } = await supabase.rpc('available_time_slots', {
      p_barber_id: barberId,
      p_date: dateStr,
      p_duration: totalDuration
    });
    if (error) {
      console.error('Error fetching slots for date', dateStr, error);
      return [];
    }
    const hasAvailability = Array.isArray(data) && data.some((s: any) => s.is_available);
    results.push({ date_value: dateStr, has_availability: hasAvailability });
  }

  return results;
}

/**
 * Get available time slots for a barber on a specific date
 */
export async function getBarberAvailableSlots(
  barberId: number,
  date: string,
  serviceIds: number[] = []
): Promise<AvailableSlot[]> {
  const supabase = await createClient();
  
  const { data: svc, error: svcErr } = await supabase
    .from('services')
    .select('time')
    .in('id', serviceIds);
  if (svcErr) {
    console.error('Error fetching services:', svcErr);
    return [];
  }
  const totalDuration = (svc || []).reduce((sum, s: any) => sum + (s.time || 30), 0) || 30;

  const { data, error } = await supabase
    .rpc('available_time_slots', {
      p_barber_id: barberId,
      p_date: date,
      p_duration: totalDuration
    });
  
  if (error) {
    console.error('Error fetching available time slots:', error);
    return [];
  }
  
  return (data || [])
    .filter((slot: any) => slot.is_available)
    .map((slot: any) => {
      const [h, m] = (slot.time_slot as string).split(':').map((n: string) => parseInt(n, 10));
      const startMinutes = h * 60 + m;
      const endMinutes = startMinutes + totalDuration;
      const eh = Math.floor(endMinutes / 60);
      const em = endMinutes % 60;
      const end_time = `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}:00`;
      return { time_slot: slot.time_slot, end_time, is_available: slot.is_available } as AvailableSlot;
    });
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
  const supabase = await createClient();
  
  // For debugging purposes
  if (typeof window !== 'undefined') {
    console.log('Creating appointment client-side');
  } else {
    console.log('Creating appointment server-side');
  }
  
  const { data, error } = await supabase
    .rpc('book_appointment_v2_text', {
      p_barber_id: barberId,
      p_user_id: userId,
      p_service_ids: serviceIds,
      p_date: date,
      p_time: time,
      p_client_name: isGuest ? 'Guest' : undefined,
      p_check_only: false
    });
  
  if (error) {
    console.error('Error creating appointment:', error);
    throw new Error(error.message || 'Failed to create appointment');
  }
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to create appointment');
  }
  
  // Comprehensive revalidation of all appointment-related paths
  revalidatePath('/dashboard', 'layout'); // Revalidate entire dashboard layout
  revalidatePath('/dashboard/appointments');
  revalidatePath('/dashboard/overview');
  revalidatePath('/dashboard/appointments/week');
  revalidatePath('/dashboard/appointments/today');
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
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .rpc('book_appointment_v2_text', {
      p_barber_id: barberId,
      p_user_id: 'check-only',
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
 * Fetch barbershop booking settings for a given barber
 */
export async function getBarbershopSettings(barberId: number): Promise<{ buffer: number; maxDays: number }> {
  const supabase = await createClient();
  const { data: barber } = await supabase
    .from('barbers')
    .select('barbershop_id')
    .eq('id', barberId)
    .single();
  if (!barber) return { buffer: 30, maxDays: 14 };
  const { data: shop } = await supabase
    .from('barbershops')
    .select('last_minute_booking_buffer, max_advance_booking_days')
    .eq('id', barber.barbershop_id)
    .single();
  return {
    buffer: shop?.last_minute_booking_buffer ?? 30,
    maxDays: shop?.max_advance_booking_days ?? 14,
  };
}

/**
 * Calculate the total duration in minutes for selected services
 */
export async function calculateServicesDuration(serviceIds: number[]): Promise<number> {
  if (!serviceIds.length) return 30; // Default duration
  
  const supabase = await createClient();
  
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
  const supabase = await createClient();
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