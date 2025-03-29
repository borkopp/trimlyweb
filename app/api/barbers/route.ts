import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Database } from '@/database.types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const barbershopId = searchParams.get('barbershopId') || '1';
  
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('barbers')
      .select('id, name, description, email')
      .eq('barbershop_id', barbershopId);
    
    if (error) {
      console.error('Error fetching barbers:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in barbers API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}