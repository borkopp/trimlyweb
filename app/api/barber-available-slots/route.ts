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
    const supabase = await createClient();
    
    const parsedBarberId = parseInt(barberId, 10);
    if (isNaN(parsedBarberId)) {
      return NextResponse.json(
        { error: 'Invalid barber ID format' },
        { status: 400 }
      );
    }
    
    const { data: svc, error: svcErr } = await supabase
      .from('services')
      .select('time')
      .in('id', serviceIds);
    if (svcErr) {
      console.error('Error fetching services:', svcErr);
      return NextResponse.json({ error: svcErr.message }, { status: 500 });
    }
    const totalDuration = (svc || []).reduce((sum, s: any) => sum + (s.time || 30), 0) || 30;

    const { data, error } = await supabase.rpc('available_time_slots', {
      p_barber_id: parsedBarberId,
      p_date: date,
      p_duration: totalDuration
    });
    
    if (error) {
      console.error('Error fetching available slots:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    const availableSlots = (data || [])
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
    
    console.log(`Retrieved ${availableSlots.length} available slots for barber ${barberId} on ${date}`);
    
    return NextResponse.json(availableSlots);
  } catch (error) {
    console.error('Error in barber-available-slots API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 