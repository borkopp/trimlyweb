import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      barberId, 
      userId, 
      serviceIds, 
      date, 
      time,
      name, 
      isGuest = false, 
      temporaryUserId = null 
    } = body;
    
    // Validate required fields
    if (!barberId || !userId || !serviceIds || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Validate serviceIds is an array with at least one item
    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
      return NextResponse.json(
        { error: 'Service IDs must be a non-empty array' }, 
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    // Get barbershop_id from headers or from barber record
    let barbershopId = parseInt(request.headers.get('x-barbershop-id') || '0', 10);
    
    // If barbershopId is not in headers, get it from the barber record
    if (!barbershopId) {
      const { data: barberData, error: barberError } = await supabase
        .from('barbers')
        .select('barbershop_id')
        .eq('id', barberId)
        .single();
      
      if (!barberError && barberData) {
        barbershopId = barberData.barbershop_id;
      }
    }
    
    console.log('Using barbershop_id:', barbershopId);
    
    // First verify if the UUID is valid by querying the user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    // If no user found, try to create an appointment with a direct UUID value
    // UUID is passed directly if user found or using a proper UUID format
    const finalUserId = !userError && userData?.id ? userData.id : userId;
    
    console.log('Creating appointment with userId:', finalUserId, 'barberId:', barberId, 'date:', date, 'time:', time, 'name:', name);
    
    try {
      // Include name parameter in the RPC call if provided
      const { data, error } = await supabase
        .rpc('book_appointment_v2_text', {
          p_barber_id: parseInt(barberId.toString(), 10),
          p_user_id: finalUserId,
          p_service_ids: serviceIds,
          p_date: date,
          p_time: time,
          p_client_name: name,
          p_check_only: false
        });
      
      if (error) {
        console.error('Error creating appointment:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      if (!data.success) {
        return NextResponse.json({ error: data.message }, { status: 400 });
      }
      
      // Use both revalidation strategies to ensure reliable updates
      revalidateTag('appointments'); // Revalidate all requests tagged with 'appointments'
      
      // Also revalidate specific paths
      revalidatePath('/dashboard', 'layout');
      revalidatePath('/dashboard/appointments');
      revalidatePath('/dashboard/overview');
      revalidatePath('/dashboard/appointments/week');
      revalidatePath('/dashboard/appointments/today');
      revalidatePath('/appointments');
      
      return NextResponse.json(data);
    } catch (rpcError) {
      console.error('RPC execution error:', rpcError);
      return NextResponse.json(
        { error: rpcError instanceof Error ? rpcError.message : 'RPC execution failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in appointments API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}