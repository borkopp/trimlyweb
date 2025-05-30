'use server'

import { Database } from '@/database.types'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateBarbershopSettings(settings: Partial<Database['public']['Tables']['barbershops']['Update']>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('barbershops')
    .update(settings)
    .eq('id', 1)
    .select()
    .single()

  if (error) {
    throw new Error('Failed to update barbershop settings')
  }

  revalidatePath('/dashboard/settings')
  return data
}

export async function getBarbershopSettings() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('barbershops')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) {
    throw new Error('Failed to fetch barbershop settings')
  }

  return data
}
