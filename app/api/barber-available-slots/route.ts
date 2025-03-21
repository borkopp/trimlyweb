import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

type AvailableSlot = {
  time_slot: string;
  end_time: string;
  is_available: boolean;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const barberId = searchParams.get('barberId');
  const date = searchParams.get('date');
  const serviceIds = searchParams.get('serviceIds')?.split(',').map(id => parseInt(id, 10));
  
  if (!barberId || !date) {
    return NextResponse.json(
      { error: 'Barber ID and date are required' }, 
      { status: 400 }
    );
  }
  
  if (!serviceIds || serviceIds.length === 0) {
    return NextResponse.json(
      { error: 'At least one service ID is required' },
      { status: 400 }
    );
  }
  
  console.log(`Fetching available slots for barber ${barberId} on ${date} for services: ${serviceIds.join(',')}`);
  
  try {
    const supabase = createClient();
    
    const parsedBarberId = parseInt(barberId, 10);
    if (isNaN(parsedBarberId)) {
      return NextResponse.json(
        { error: 'Invalid barber ID format' },
        { status: 400 }
      );
    }
    
    // Verify barber exists
    const { data: barber, error: barberError } = await supabase
      .from('barbers')
      .select('id, barbershop_id')
      .eq('id', parsedBarberId)
      .single();
    
    if (barberError) {
      console.error('Error fetching barber:', barberError);
      return NextResponse.json({ error: 'Barber not found' }, { status: 404 });
    }
    
    if (!barber?.barbershop_id) {
      return NextResponse.json({ error: 'Barber has no associated barbershop' }, { status: 400 });
    }
    
    // Verify barbershop has opening hours
    const { data: barbershop, error: barbershopError } = await supabase
      .from('barbershops')
      .select('id, opening_time, closing_time')
      .eq('id', barber.barbershop_id)
      .single();
    
    if (barbershopError || !barbershop) {
      console.error('Error fetching barbershop:', barbershopError);
      return NextResponse.json({ error: 'Associated barbershop not found' }, { status: 404 });
    }
    
    if (!barbershop.opening_time || !barbershop.closing_time) {
      return NextResponse.json({ error: 'Barbershop has no opening/closing hours defined' }, { status: 400 });
    }
    
    // Check if service IDs are valid and get their durations
    const { data: validServices, error: servicesError } = await supabase
      .from('services')
      .select('id, time')
      .in('id', serviceIds);
    
    if (servicesError) {
      console.error('Error validating services:', servicesError);
      return NextResponse.json({ error: servicesError.message }, { status: 500 });
    }
    
    if (!validServices || validServices.length !== serviceIds.length) {
      return NextResponse.json({ error: 'One or more service IDs are invalid' }, { status: 400 });
    }
    
    // Get total service duration for slot calculation
    const totalDuration = validServices.reduce((sum, service) => sum + (service.time || 30), 0);
    
    // Get existing appointments to check for conflicts
    const { data: existingAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('time, service_ids, end_time')
      .eq('barber_id', parsedBarberId)
      .eq('date', date)
      .eq('is_cancelled', false);
    
    if (appointmentsError) {
      console.error('Error fetching existing appointments:', appointmentsError);
      // Continue anyway, we'll just show all slots as available
    }
    
    // Get barber unavailability periods
    const { data: unavailablePeriods, error: unavailabilityError } = await supabase
      .from('barber_unavailability')
      .select('start_time, end_time')
      .eq('barber_id', parsedBarberId)
      .eq('date', date);
    
    if (unavailabilityError) {
      console.error('Error fetching barber unavailability:', unavailabilityError);
      // Continue anyway, we'll just ignore unavailability
    }
    
    // Generate time slots
    const timeSlots = generateTimeSlots(
      barbershop.opening_time, 
      barbershop.closing_time, 
      totalDuration,
      date,
      existingAppointments || [],
      unavailablePeriods || []
    );
    
    console.log(`Generated ${timeSlots.length} available slots for barber ${barberId} on ${date}`);
    
    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error('Error in barber-available-slots API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to generate time slots
function generateTimeSlots(
  openingTime: string, 
  closingTime: string, 
  serviceDuration: number = 30,
  date: string,
  existingAppointments: any[] = [],
  unavailablePeriods: any[] = []
): AvailableSlot[] {
  // Parse times
  const [openHour, openMinute] = openingTime.split(':').map(Number);
  const [closeHour, closeMinute] = closingTime.split(':').map(Number);
  
  const slots: AvailableSlot[] = [];
  const intervalMinutes = 30; // Standard 30-minute intervals
  
  // Convert to minutes since midnight for easier math
  let currentMinutes = openHour * 60 + openMinute;
  const endMinutes = closeHour * 60 + closeMinute - serviceDuration;
  
  // Check if date is today
  const isToday = new Date().toISOString().split('T')[0] === date;
  const currentTimeMinutes = isToday 
    ? new Date().getHours() * 60 + new Date().getMinutes() 
    : -1;
  
  while (currentMinutes <= endMinutes) {
    const hour = Math.floor(currentMinutes / 60);
    const minute = currentMinutes % 60;
    
    // Format time as HH:MM:00
    const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
    
    // Calculate end time
    const endTimeMinutes = currentMinutes + serviceDuration;
    const endHour = Math.floor(endTimeMinutes / 60);
    const endMinute = endTimeMinutes % 60;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}:00`;
    
    // Check if slot is available
    let isAvailable = true;
    
    // Check if slot is in the past for today
    if (isToday && currentMinutes <= currentTimeMinutes) {
      isAvailable = false;
    }
    
    // Check if slot overlaps with existing appointments
    if (isAvailable && existingAppointments.length > 0) {
      for (const appointment of existingAppointments) {
        const appStartTime = appointment.time.split(':');
        const appStartMinutes = parseInt(appStartTime[0]) * 60 + parseInt(appStartTime[1]);
        
        let appEndMinutes;
        if (appointment.end_time) {
          const appEndTime = appointment.end_time.split(':');
          appEndMinutes = parseInt(appEndTime[0]) * 60 + parseInt(appEndTime[1]);
        } else {
          // If no end_time, calculate based on services
          appEndMinutes = appStartMinutes + 30; // Default to 30 minutes
        }
        
        // Check for overlap
        const hasOverlap = (
          (currentMinutes < appEndMinutes) && 
          (endTimeMinutes > appStartMinutes)
        );
        
        if (hasOverlap) {
          isAvailable = false;
          break;
        }
      }
    }
    
    // Check if slot overlaps with barber unavailability
    if (isAvailable && unavailablePeriods.length > 0) {
      for (const period of unavailablePeriods) {
        const unavailStartTime = period.start_time.split(':');
        const unavailStartMinutes = parseInt(unavailStartTime[0]) * 60 + parseInt(unavailStartTime[1]);
        
        const unavailEndTime = period.end_time.split(':');
        const unavailEndMinutes = parseInt(unavailEndTime[0]) * 60 + parseInt(unavailEndTime[1]);
        
        // Check for overlap
        const hasOverlap = (
          (currentMinutes < unavailEndMinutes) && 
          (endTimeMinutes > unavailStartMinutes)
        );
        
        if (hasOverlap) {
          isAvailable = false;
          break;
        }
      }
    }
    
    slots.push({
      time_slot: timeSlot,
      end_time: endTime,
      is_available: isAvailable
    });
    
    currentMinutes += intervalMinutes;
  }
  
  // Filter to only return available slots
  return slots.filter(slot => slot.is_available);
} 