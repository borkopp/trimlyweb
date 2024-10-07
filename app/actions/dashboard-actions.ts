'use server';

import { Database } from '@/database.types';
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

type Service = Database["public"]["Tables"]["services"]["Row"];

export async function getServices(): Promise<Service[]> {
    const supabase = createClient()
  
    const { data, error } = await supabase
      .from('services')
      .select('*')
  
    if (error) {
        throw error
    }
    return data
}

export async function addService(service: Service): Promise<void> {
    const supabase = createClient()
    try {
        const { error } = await supabase
        .from('services')
        .insert(service)

        if (error) {
        throw error;
        }
        revalidatePath('/dashboard/services');
    } catch (error) {
        console.error('Error adding service:', error);
        throw error;
    }
}

export async function updateService(service: Service): Promise<Service> {
    const supabase = createClient()
  
    const { data, error } = await supabase
      .from('services')
      .update(service)
      .eq('id', service.id)
      .select()
      .single()
  
    if (error) {
        throw error
    }
    revalidatePath('/dashboard/services')
    return data
}

export async function deleteService(id: number): Promise<void> {
    const supabase = createClient()
  
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
  
    if (error) {
        throw error
    }
    revalidatePath('/dashboard/services')
}