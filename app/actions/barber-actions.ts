'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function assignBarberRole(userId: string, serviceIds: number[]) {
  const supabase = createClient()
  
  const { data, error } = await supabase.rpc('assign_barber_role', { user_id: userId, service_ids: serviceIds })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/management')
  return data
}

export async function searchUsers(query: string) {
  const supabase = createClient();

  try {
    // Fetch all barber user IDs
    const { data: barbers, error: barbersError } = await supabase
      .from('barbers')
      .select('id');

    if (barbersError) {
      throw new Error(barbersError.message);
    }

    const barberIds = barbers.map(barber => barber.id);

    // Search profiles excluding barbers
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .not('id', 'in', `(${barberIds.join(',')})`)
      .limit(5);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error('Error searching users:', error);
    return [];
  }
}

export const getServices = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('services')
    .select('id, name')

  return data
}