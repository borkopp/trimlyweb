'use server'

import { Database } from '@/database.types';
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

type NewAppointment = Database["public"]["Tables"]["appointments"]["Insert"];

export async function createAppointment(appointmentData: NewAppointment) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("appointments")
    .insert(appointmentData)
    .select()
    .single()

  if (error) {
    throw new Error('Failed to create appointment')
  }

  revalidatePath('/dashboard/appointments')
  return data
}

export async function deleteAppointment(id: number) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id)

  if (error) {
    throw new Error('Failed to delete appointment')
  }

  revalidatePath('/dashboard')
}