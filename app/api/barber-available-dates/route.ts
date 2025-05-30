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
  
  if (!barberId) {
    return NextResponse.json({ error: 'Barber ID is required' }, { status: 400 });
  }
  
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("get_barber_available_dates", {
        p_barber_id: parseInt(barberId, 10),
        p_days_ahead: parseInt(daysAhead, 10)
      });
    
    if (error) {
      console.error('Error fetching available dates:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in barber-available-dates API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}