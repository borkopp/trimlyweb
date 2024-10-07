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
type BarberService = Database["public"]["Tables"]["barber_services"]["Row"];

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

export async function deleteBarber(id: string): Promise<void> {
    const supabase = createClient()
  
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
  
    if (error) {
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
    
    const { error } = await supabase
      .rpc('assign_barber_role', { user_id: userId, service_ids: serviceIds })

    if (error) throw error

    revalidatePath('/dashboard/barbers')
}