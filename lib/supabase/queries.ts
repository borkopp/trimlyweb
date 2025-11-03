import 'server-only';
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/database.types";
import { tenantContext } from "@/lib/tenant-context";

type Appointment = Database['public']['Tables']['appointments']['Row'];
type Service = Database['public']['Tables']['services']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Barber = Database['public']['Tables']['barbers']['Row'];

async function getBarbershopId(): Promise<number | null> {
  const tenant = await tenantContext.getTenantContext();
  return tenant && !tenant.isMainDomain && tenant.id > 0 ? tenant.id : null;
}

export async function getTodayAppointments(): Promise<Appointment[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];
  const barbershopId = await getBarbershopId();
  if (!barbershopId) return [];

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('date', today)
    .eq('barbershop_id', barbershopId)
    .order('time');

  if (error) {
    console.error('Error fetching today\'s appointments:', error);
    return [];
  }

  return data;
}

export async function getCurrentMonthRevenue(): Promise<number> {
  const supabase = await createClient();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  const barbershopId = await getBarbershopId();
  if (!barbershopId) return 0;

  // Fetch appointments for the current month
  const { data: appointments, error: appointmentsError } = await supabase
    .from('appointments')
    .select('id, service_ids')
    .eq('barbershop_id', barbershopId)
    .gte('date', firstDayOfMonth)
    .lte('date', lastDayOfMonth);

  if (appointmentsError) {
    console.error('Error fetching appointments:', appointmentsError);
    return 0;
  }

  // Fetch all services for this barbershop
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('id, price')
    .eq('barbershop_id', barbershopId);

  if (servicesError) {
    console.error('Error fetching services:', servicesError);
    return 0;
  }

  // Create a map of service id to price for quick lookup
  const servicePrices = new Map(services.map((service) => [service.id, service.price]));

  // Calculate total revenue
  const totalRevenue = appointments.reduce((total: number, appointment) => {
    const appointmentRevenue = appointment.service_ids.reduce((sum: number, serviceId: number) => {
      return sum + (servicePrices.get(serviceId) || 0);
    }, 0);
    return total + appointmentRevenue;
  }, 0);

  return totalRevenue;
}

/**
 * Fetches all appointments for the current week, including client details
 * @returns Array of appointments with associated client profiles
 */
export async function getWeekAppointments(): Promise<(Appointment & { client: Profile })[]> {
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Calculate start and end dates for current week
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()).toISOString().split('T')[0];
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6).toISOString().split('T')[0];
    
    // Get barbershop ID for filtering
    const barbershopId = await getBarbershopId();
    if (!barbershopId) return [];
  
    // Query appointments with client profile join with Next.js cache tags using fetch
    const fetchOptions = { next: { tags: ['appointments'], revalidate: 0 } };
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        client:profiles!appointments_user_id_fkey(full_name, email)
      `)
      .eq('barbershop_id', barbershopId)
      .gte('date', startOfWeek)  // Greater than or equal to start of week
      .lte('date', endOfWeek)    // Less than or equal to end of week
      .order('date', { ascending: true })  // Sort by date first
      .order('time', { ascending: true });  // Then by time
  
    // Handle any errors
    if (error) {
      console.error('Error fetching week appointments:', error);
      return [];
    }

    return data as (Appointment & { client: Profile })[];
}

export async function getDayAppointments(date: string): Promise<(Appointment & { client: Profile })[]> {
  const supabase = await createClient();
  const barbershopId = await getBarbershopId();
  if (!barbershopId) return [];

  // Query with Next.js cache tags
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      client:profiles!appointments_user_id_fkey(full_name, email)
    `)
    .eq('barbershop_id', barbershopId)
    .eq('date', date)
    .order('time', { ascending: true });

  if (error) {
    console.error('Error fetching day appointments:', error);
    return [];
  }

  return data as (Appointment & { client: Profile })[];
}

export async function getServicesById(ids: number[]): Promise<Service[]> {
    const supabase = await createClient();
    const barbershopId = await getBarbershopId();
    if (!barbershopId) return [];

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq('barbershop_id', barbershopId)
      .in("id", ids);
  
    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  
    return data;
}
  
export async function getBarberById(id: number): Promise<Barber | null> {
    const supabase = await  createClient();
    const barbershopId = await getBarbershopId();
    if (!barbershopId) return null;

    const { data, error } = await supabase
      .from("barbers")
      .select("*")
      .eq('barbershop_id', barbershopId)
      .eq("id", id)
      .single();
  
    if (error) {
      console.error('Error fetching barber:', error);
      return null;
    }
  
    return data;
}

export async function getBarbers(): Promise<Barber[]> {
    const supabase = await createClient();
    const barbershopId = await getBarbershopId();
    if (!barbershopId) return [];

    const { data, error } = await supabase
      .from("barbers")
      .select("*")
      .eq('barbershop_id', barbershopId);

    if (error) {
      console.error('Error fetching barbers:', error);
      return [];
    }
    return data;
}

export async function getServices(): Promise<Service[]> {
    const supabase = await createClient();
    const barbershopId = await getBarbershopId();
    if (!barbershopId) return [];

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq('barbershop_id', barbershopId);

    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }
    return data;
}

/**
 * Fetches all upcoming appointments, sorted by date and time
 * @returns Array of appointments with associated client profiles
 */
export async function getAllAppointments(): Promise<(Appointment & { client: Profile })[]> {
  const supabase = await createClient();
  const barbershopId = await getBarbershopId();
  if (!barbershopId) return [];
  const today = new Date().toISOString().split('T')[0];
  
  // First get upcoming appointments (today or future dates)
  const { data: upcomingAppointments, error: upcomingError } = await supabase
    .from('appointments')
    .select(`
      *,
      client:profiles!appointments_user_id_fkey(full_name, email)
    `)
    .eq('barbershop_id', barbershopId)
    .gte('date', today) // Only get today and future appointments
    .is('is_cancelled', false) // Exclude cancelled appointments
    .order('date', { ascending: true })
    .order('time', { ascending: true });
  
  if (upcomingError) {
    console.error('Error fetching upcoming appointments:', upcomingError);
    return [];
  }
  
  // Get the current time to determine which appointments are in the future
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`;
  
  // Filter out appointments from today that have already passed
  // Then combine with future appointments and sort by date and time
  const todayAppointments = upcomingAppointments.filter(
    apt => apt.date !== today || apt.time > currentTime
  );
    
  return todayAppointments as (Appointment & { client: Profile })[];
}


