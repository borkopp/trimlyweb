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

export async function addService(service: Omit<Service, 'id'>): Promise<Service> {
    const supabase = createClient()
    try {
        const { data, error } = await supabase
        .from('services')
        .insert({ ...service, image: service.image || null })
        .select()
        .single()

        if (error) {
            throw error;
        }
        revalidatePath('/dashboard/services');
        return data;
    } catch (error) {
        console.error('Error adding service:', error);
        throw error;
    }
}

export async function updateService(service: Service): Promise<Service> {
    const supabase = createClient()
  
    const { data, error } = await supabase
      .from('services')
      .update({ ...service, image: service.image || null })
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

type Barber = Database["public"]["Tables"]["barbers"]["Row"];

export async function getBarbers(): Promise<(Barber & { services: Service[] })[]> {
    const supabase = createClient()
  
    const { data: barbers, error: barbersError } = await supabase
      .from('barbers')
      .select('*')
  
    if (barbersError) throw barbersError

    const { data: barberServices, error: servicesError } = await supabase
      .from('barber_services')
      .select('barber_id, services(*)')

    if (servicesError) throw servicesError

    const barbersWithServices = barbers.map(barber => ({
      ...barber,
      services: barberServices
        .filter(bs => bs.barber_id === barber.id)
        .map(bs => bs.services)
    }))

    return barbersWithServices
}

export async function addBarber(barber: Omit<Barber, 'id'>): Promise<Barber> {
    const supabase = createClient()
    try {
        const { data, error } = await supabase
        .from('profiles')
        .insert({ ...barber, role: 'barber' })
        .select()
        .single()

        if (error) {
            throw error;
        }
        revalidatePath('/dashboard/barbers');
        return data;
    } catch (error) {
        console.error('Error adding barber:', error);
        throw error;
    }
}

export async function updateBarber(barber: Barber): Promise<Barber> {
    const supabase = createClient()
  
    const { data, error } = await supabase
      .from('profiles')
      .update(barber)
      .eq('id', barber.id)
      .select()
      .single()
  
    if (error) {
        throw error
    }
    revalidatePath('/dashboard/barbers')
    return data
}

export async function deleteBarber(barberId: number): Promise<void> {
    const supabase = createClient()
    
    // First, get the user_id associated with this barber
    const { data: barber, error: fetchError } = await supabase
      .from('barbers')
      .select('user_id')
      .eq('id', barberId)
      .single()

    if (fetchError) throw fetchError

    if (!barber || !barber.user_id) {
      throw new Error('Barber not found or not associated with a user')
    }

    // Call the remove_barber_role RPC with the user_id
    const { error } = await supabase
      .rpc('remove_barber_role', { p_user_id: barber.user_id })
  
    if (error) {
        if (error.code === '23503') {
            if (error.message.includes('appointments')) {
                throw new Error('Cannot delete barber: This barber has existing appointments.')
            } else if (error.message.includes('barber_services')) {
                throw new Error('Cannot delete barber: This barber has associated services.')
            } else {
                throw new Error('Cannot delete barber: There are related records preventing deletion.')
            }
        }
        throw error
    }
    revalidatePath('/dashboard/barbers')
}

export async function addServiceToBarber(barberId: number, serviceId: number): Promise<void> {
    const supabase = createClient()
    
    const { error } = await supabase
        .from('barber_services')
        .insert({ barber_id: barberId, service_id: serviceId })

    if (error) throw error

    revalidatePath('/dashboard/barbers')
}

export async function removeServiceFromBarber(barberId: number, serviceId: number): Promise<void> {
    const supabase = createClient()
    
    const { error } = await supabase
        .from('barber_services')
        .delete()
        .match({ barber_id: barberId, service_id: serviceId })

    if (error) throw error

    revalidatePath('/dashboard/barbers')
}

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export async function getNonBarberProfiles(): Promise<Profile[]> {
    const supabase = createClient()
  
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'barber')
  
    if (error) {
        throw error
    }
    return data
}

export async function assignBarberRole(userId: string, serviceIds: number[] = []): Promise<void> {
    const supabase = createClient()
    
    // First, get the user's profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError

    if (!profile || !profile.full_name) {
      throw new Error('User profile not found or missing required data')
    }

    // Call the updated RPC function
    const { error } = await supabase.rpc('assign_barber_role_with_data', { 
      p_user_id: userId, 
      barber_name: profile.full_name,
      barber_email: profile.email,
      service_ids: serviceIds 
    })

    if (error) throw error

    revalidatePath('/dashboard/barbers')
}