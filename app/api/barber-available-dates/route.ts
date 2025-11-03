import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

type AvailableDate = {
  date_value: string;
  has_availability: boolean;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const barberId = searchParams.get('barberId');
  const daysAhead = searchParams.get('daysAhead') || '30';
  const serviceIds = searchParams.get('serviceIds')?.split(',').map(id => parseInt(id, 10));
  
  if (!barberId) {
    return NextResponse.json({ error: 'Barber ID is required' }, { status: 400 });
  }
  
  try {
    const supabase = await createClient();
    const parsedBarberId = parseInt(barberId, 10);
    const requestedDays = parseInt(daysAhead, 10);

    // Resolve max_advance_booking_days from barbershop settings
    let maxAdvanceDays = 14;
    const { data: barberRow } = await supabase
      .from('barbers')
      .select('barbershop_id')
      .eq('id', parsedBarberId)
      .single();
    if (barberRow?.barbershop_id) {
      const { data: shop } = await supabase
        .from('barbershops')
        .select('max_advance_booking_days')
        .eq('id', barberRow.barbershop_id)
        .single();
      if (typeof shop?.max_advance_booking_days === 'number') {
        maxAdvanceDays = shop.max_advance_booking_days;
      }
    }
    const maxDays = Math.min(requestedDays, maxAdvanceDays);

    let totalDuration = 30;
    if (serviceIds && serviceIds.length > 0) {
      const { data: svc, error: svcErr } = await supabase
        .from('services')
        .select('time')
        .in('id', serviceIds);
      if (svcErr) {
        console.error('Error fetching services:', svcErr);
        return NextResponse.json({ error: svcErr.message }, { status: 500 });
      }
      totalDuration = (svc || []).reduce((sum, s: any) => sum + (s.time || 30), 0) || 30;
    }

    const today = new Date();
    today.setHours(0,0,0,0);
    const results: AvailableDate[] = [];
    for (let i = 0; i <= maxDays; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const { data: slots, error } = await supabase.rpc('available_time_slots', {
        p_barber_id: parsedBarberId,
        p_date: dateStr,
        p_duration: totalDuration
      });
      if (error) {
        console.error('Error fetching slots for date', dateStr, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      const hasAvailability = Array.isArray(slots) && slots.some((s: any) => s.is_available);
      results.push({ date_value: dateStr, has_availability: hasAvailability });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in barber-available-dates API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}