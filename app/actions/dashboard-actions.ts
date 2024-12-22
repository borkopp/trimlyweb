'use server';

import { Database } from '@/database.types';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

type Service = Database["public"]["Tables"]["services"]["Row"];
type Barber = Database["public"]["Tables"]["barbers"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type BarbershopSettings = Database["public"]["Tables"]["barbershops"]["Row"];

async function getBarbershopId(): Promise<string | null> {
  const headersList = headers();
  return headersList.get("x-barbershop-id");
}

export async function getServices(): Promise<Service[]> {
  const supabase = createClient();
  const barbershopId = await getBarbershopId();

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('barbershop_id', barbershopId);

  if (error) {
    throw error;
  }
  return data;
}

export async function addService(service: Omit<Service, 'id'>): Promise<Service> {
  const supabase = createClient();
  const barbershopId = await getBarbershopId();

  try {
    const { data, error } = await supabase
      .from('services')
      .insert({ ...service, image: service.image || null, barbershop_id: barbershopId })
      .select()
      .single();

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
  const supabase = createClient();
  const barbershopId = await getBarbershopId();

  const { data, error } = await supabase
    .from('services')
    .update({ ...service, image: service.image || null })
    .eq('id', service.id)
    .eq('barbershop_id', barbershopId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  revalidatePath('/dashboard/services');
  return data;
}

export async function deleteService(id: number): Promise<void> {
  const supabase = createClient();
  const barbershopId = await getBarbershopId();

  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)
    .eq('barbershop_id', barbershopId);

  if (error) {
    throw error;
  }
  revalidatePath('/dashboard/services');
}

export async function getBarbers(): Promise<(Barber & { services: Service[] })[]> {
  const supabase = createClient();
  const barbershopId = await getBarbershopId();

  const { data: barbers, error: barbersError } = await supabase
    .from('barbers')
    .select('*')
    .eq('barbershop_id', barbershopId);

  if (barbersError) throw barbersError;

  const { data: barberServices, error: servicesError } = await supabase
    .from('barber_services')
    .select('barber_id, services(*)')
    .in('barber_id', barbers.map(b => b.id));

  if (servicesError) throw servicesError;

  const barbersWithServices = barbers.map(barber => ({
    ...barber,
    services: barberServices
      .filter(bs => bs.barber_id === barber.id)
      .map(bs => bs.services)
  }));

  return barbersWithServices;
}

export async function addBarber(barber: Omit<Barber, 'id'>): Promise<Barber> {
  const supabase = createClient();
  const barbershopId = await getBarbershopId();

  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({ ...barber, role: 'barber', barbershop_id: barbershopId })
      .select()
      .single();

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
  const supabase = createClient();
  const barbershopId = await getBarbershopId();

  const { data, error } = await supabase
    .from('profiles')
    .update(barber)
    .eq('id', barber.id)
    .eq('barbershop_id', barbershopId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  revalidatePath('/dashboard/barbers');
  return data;
}

export async function deleteBarber(barberId: number): Promise<void> {
  const supabase = createClient();
  const barbershopId = await getBarbershopId();

  // First, get the user_id associated with this barber
  const { data: barber, error: fetchError } = await supabase
    .from('barbers')
    .select('user_id')
    .eq('id', barberId)
    .eq('barbershop_id', barbershopId)
    .single();

  if (fetchError) throw fetchError;

  if (!barber || !barber.user_id) {
    throw new Error('Barber not found or not associated with a user');
  }

  // Call the remove_barber_role RPC with the user_id
  const { error } = await supabase
    .rpc('remove_barber_role', { p_user_id: barber.user_id, p_barbershop_id: barbershopId });

  if (error) {
    if (error.code === '23503') {
      if (error.message.includes('appointments')) {
        throw new Error('Cannot delete barber: This barber has existing appointments.');
      } else if (error.message.includes('barber_services')) {
        throw new Error('Cannot delete barber: This barber has associated services.');
      } else {
        throw new Error('Cannot delete barber: There are related records preventing deletion.');
      }
    }
    throw error;
  }
  revalidatePath('/dashboard/barbers');
}

export async function addServiceToBarber(barberId: number, serviceId: number): Promise<void> {
  const supabase = createClient();
  const barbershopId = await getBarbershopId();

  // Verify both barber and service belong to this barbershop
  const { data: barber } = await supabase
    .from('barbers')
    .select()
    .eq('id', barberId)
    .eq('barbershop_id', barbershopId)
    .single();

  const { data: service } = await supabase
    .from('services')
    .select()
    .eq('id', serviceId)
    .eq('barbershop_id', barbershopId)
    .single();

  if (!barber || !service) {
    throw new Error('Invalid barber or service for this barbershop');
  }

  const { error } = await supabase
    .from('barber_services')
    .insert({ barber_id: barberId, service_id: serviceId });

  if (error) throw error;

  revalidatePath('/dashboard/barbers');
}

export async function removeServiceFromBarber(barberId: number, serviceId: number): Promise<void> {
  const supabase = createClient();
  const barbershopId = await getBarbershopId();

  // Verify both barber and service belong to this barbershop
  const { data: barber } = await supabase
    .from('barbers')
    .select()
    .eq('id', barberId)
    .eq('barbershop_id', barbershopId)
    .single();

  const { data: service } = await supabase
    .from('services')
    .select()
    .eq('id', serviceId)
    .eq('barbershop_id', barbershopId)
    .single();

  if (!barber || !service) {
    throw new Error('Invalid barber or service for this barbershop');
  }

  const { error } = await supabase
    .from('barber_services')
    .delete()
    .match({ barber_id: barberId, service_id: serviceId });

  if (error) throw error;

  revalidatePath('/dashboard/barbers');
}

export async function getNonBarberProfiles(): Promise<Profile[]> {
  const supabase = createClient();
  const barbershopId = await getBarbershopId();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('barbershop_id', barbershopId)
    .neq('role', 'barber');

  if (error) {
    throw error;
  }
  return data;
}

export async function assignBarberRole(userId: string, serviceIds: number[] = []): Promise<void> {
  const supabase = createClient();
  const barbershopId = await getBarbershopId();

  // First, get the user's profile data
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', userId)
    .eq('barbershop_id', barbershopId)
    .single();

  if (profileError) throw profileError;

  if (!profile || !profile.full_name) {
    throw new Error('User profile not found or missing required data');
  }

  // Call the updated RPC function
  const { error } = await supabase.rpc('assign_barber_role_with_data', {
    p_user_id: userId,
    barber_name: profile.full_name,
    barber_email: profile.email,
    service_ids: serviceIds,
    p_barbershop_id: barbershopId
  });

  if (error) throw error;

  revalidatePath('/dashboard/barbers');
}

export async function getBarbershopSettings(): Promise<BarbershopSettings> {
  const supabase = createClient();
  const barbershopId = await getBarbershopId();

  const { data, error } = await supabase
    .from('barbershop')
    .select('*')
    .eq('id', barbershopId)
    .single();

  if (error) {
    throw error;
  }
  return data;
}
