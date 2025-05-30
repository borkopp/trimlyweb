import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Database } from '@/database.types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const barberId = searchParams.get('barberId');
  
  if (!barberId) {
    return NextResponse.json({ error: 'Barber ID is required' }, { status: 400 });
  }
  
  try {
    const supabase = await createClient();

    // Get service IDs for this barber
    const { data: serviceLinks, error: linkError } = await supabase
      .from("barber_services")
      .select('service_id')
      .eq('barber_id', barberId);
    
    if (linkError) {
      console.error('Error fetching barber service links:', linkError);
      return NextResponse.json({ error: linkError.message }, { status: 500 });
    }
    
    if (!serviceLinks || serviceLinks.length === 0) {
      return NextResponse.json([]);
    }
    
    // Extract service IDs
    const serviceIds = serviceLinks
      .map(link => link.service_id)
      .filter(Boolean) as number[];
    
    if (serviceIds.length === 0) {
      return NextResponse.json([]);
    }
    
    // Get service details - only select essential fields (exclude image)
    const { data: services, error: serviceError } = await supabase
      .from('services')
      .select('id, name, description, price, time')
      .in('id', serviceIds);
    
    if (serviceError) {
      console.error('Error fetching services:', serviceError);
      return NextResponse.json({ error: serviceError.message }, { status: 500 });
    }
    
    return NextResponse.json(services || []);
  } catch (error) {
    console.error('Error in barber-services API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}