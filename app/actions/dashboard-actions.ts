'use server';

import { Database } from '@/database.types';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { tenantContext } from '@/lib/tenant-context';

type Service = Database["public"]["Tables"]["services"]["Row"];
type Barber = Database["public"]["Tables"]["barbers"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type BarbershopSettings = Database["public"]["Tables"]["barbershops"]["Row"];

async function getBarbershopId(): Promise<number | null> {
  const tenant = await tenantContext.getTenantContext();
  if (tenant && !tenant.isMainDomain && tenant.id > 0) return tenant.id;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('barbershop_id')
    .eq('id', user.id)
    .single();
  return (profile && profile.barbershop_id) ? profile.barbershop_id : null;
}

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('services')
    .select('*');

  if (error) {
    throw error;
  }
  return data;
}

export async function addService(service: Omit<Service, 'id'>): Promise<Service> {
  const supabase = await createClient();
  const barbershopId = await getBarbershopId();
  if (!barbershopId) throw new Error('Missing tenant');
  await supabase.rpc('set_tenant_context', { tenant_id: barbershopId });

  try {
    const payload: any = { ...service };
    Object.keys(payload).forEach((k) => {
      if (typeof (payload as any)[k] === 'string' && (payload as any)[k].trim() === '') {
        (payload as any)[k] = null;
      }
    });
    delete (payload as any).barbershop_id;
    if (typeof (payload as any).time === 'string') {
      const t = (payload as any).time.trim();
      (payload as any).time = t === '' ? null : parseInt(t, 10);
    }
    if (typeof (payload as any).price === 'string') {
      const p = (payload as any).price.trim();
      (payload as any).price = p === '' ? null : p;
    }

    const { data, error } = await supabase
      .from('services')
      .insert({ ...payload, image: payload.image || null, barbershop_id: barbershopId })
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
  const supabase = await createClient();
  const barbershopId = await getBarbershopId();
  if (!barbershopId) throw new Error('Missing tenant');
  console.log("updateService tenant", barbershopId, typeof barbershopId);
  const { error: rpcErr } = await supabase.rpc('set_tenant_context', { tenant_id: barbershopId });
  if (rpcErr) console.warn("updateService rpc error", JSON.stringify(rpcErr));

  const payload: any = { ...service };
  Object.keys(payload).forEach((k) => {
    if (typeof (payload as any)[k] === 'string' && (payload as any)[k].trim() === '') {
      (payload as any)[k] = null;
    }
  });
  delete (payload as any).barbershop_id;
  if (typeof (payload as any).time === 'string') {
    const t = (payload as any).time.trim();
    (payload as any).time = t === '' ? null : parseInt(t, 10);
  }
  if (typeof (payload as any).price === 'string') {
    const p = (payload as any).price.trim();
    (payload as any).price = p === '' ? null : p;
  }

  const { data, error } = await supabase
    .from('services')
    .update({ ...payload, image: payload.image || null })
    .eq('id', service.id)
    .eq('barbershop_id', barbershopId)
    .select()
    .single();
  if (error) {
    console.warn('updateService supabase error', JSON.stringify(error), 'payload', JSON.stringify(payload));
  }

  if (error) {
    throw error;
  }
  revalidatePath('/dashboard/services');
  return data;
}

export async function deleteService(id: number): Promise<void> {
  const supabase = await createClient();
  const barbershopId = await getBarbershopId();
  if (!barbershopId) throw new Error('Missing tenant');
  await supabase.rpc('set_tenant_context', { tenant_id: barbershopId });

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
  const supabase = await createClient();
  const barbershopId = await getBarbershopId();

  const { data: barbers, error: barbersError } = await supabase
    .from('barbers')
    .select('*');

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
  const supabase = await createClient();
  const barbershopId = await getBarbershopId();
  if (!barbershopId) throw new Error('Missing tenant');
  await supabase.rpc('set_tenant_context', { tenant_id: barbershopId });

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
  const supabase = await createClient();
  const barbershopId = await getBarbershopId();
  if (!barbershopId) throw new Error('Missing tenant');
  await supabase.rpc('set_tenant_context', { tenant_id: barbershopId });

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
  const supabase = await createClient();
  const barbershopId = await getBarbershopId();
  if (!barbershopId) throw new Error('Missing tenant');
  await supabase.rpc('set_tenant_context', { tenant_id: barbershopId });

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
    .rpc('remove_barber_role', { p_user_id: barber.user_id });

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
  const supabase = await createClient();
  const barbershopId = await getBarbershopId();
  if (!barbershopId) throw new Error('Missing tenant');
  await supabase.rpc('set_tenant_context', { tenant_id: barbershopId });

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
  const supabase = await createClient();
  const barbershopId = await getBarbershopId();
  if (!barbershopId) throw new Error('Missing tenant');
  await supabase.rpc('set_tenant_context', { tenant_id: barbershopId });

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
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .neq('role', 'barber');

  if (error) {
    throw error;
  }
  return data;
}

export async function assignBarberRole(userId: string, serviceIds: number[] = []): Promise<void> {
  const supabase = await createClient();
  const barbershopId = await getBarbershopId();
  if (!barbershopId) throw new Error('Missing tenant');
  await supabase.rpc('set_tenant_context', { tenant_id: barbershopId });

  // First, get the user's profile data
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, email, phone')
    .eq('id', userId)
    .eq('barbershop_id', barbershopId)
    .single();

  if (profileError) throw profileError;

  if (!profile || !profile.full_name) {
    throw new Error('User profile not found or missing required data');
  }

  // Call the RPC function with barbershop_id
  const { error } = await supabase.rpc('assign_barber_role', {
    user_id: userId,
    service_ids: serviceIds,
    p_barbershop_id: barbershopId
  });

  if (error) throw error;

  revalidatePath('/dashboard/barbers');
}

export async function getBarbershopSettings(): Promise<BarbershopSettings> {
  const supabase = await createClient();
  const barbershopId = await getBarbershopId();
  if (!barbershopId) throw new Error('Missing tenant');
  await supabase.rpc('set_tenant_context', { tenant_id: barbershopId });

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

export async function getUser(): Promise<Profile | null> {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  
  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) throw profileError;
  
  return profile;
}

