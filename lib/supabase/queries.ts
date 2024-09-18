import { createClient } from "@/utils/supabase/server";
import { Database } from "@/database.types";

type Appointment = Database['public']['Tables']['appointments']['Row'];
type Service = Database['public']['Tables']['services']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Barber = Database['public']['Tables']['barbers']['Row'];

export async function getTodayAppointments(): Promise<Appointment[]> {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('date', today)
    .order('time');

  if (error) {
    console.error('Error fetching today\'s appointments:', error);
    return [];
  }

  return data;
}

export async function getCurrentMonthRevenue(): Promise<number> {
  const supabase = createClient();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  // Fetch appointments for the current month
  const { data: appointments, error: appointmentsError } = await supabase
    .from('appointments')
    .select('id, service_ids')
    .gte('date', firstDayOfMonth)
    .lte('date', lastDayOfMonth);

  if (appointmentsError) {
    console.error('Error fetching appointments:', appointmentsError);
    return 0;
  }

  // Fetch all services
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('id, price');

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

export async function getWeekAppointments(): Promise<(Appointment & { client: Profile })[]> {
    const supabase = createClient();
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()).toISOString().split('T')[0];
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6).toISOString().split('T')[0];
  
    console.log('Fetching appointments from', startOfWeek, 'to', endOfWeek);
  
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        client:profiles!appointments_user_id_fkey(full_name, email)
      `)
      .gte('date', startOfWeek)
      .lte('date', endOfWeek)
      .order('date', { ascending: true })
      .order('time', { ascending: true });
  
    if (error) {
      console.error('Error fetching week appointments:', error);
      return [];
  }
  console.log('Fetched appointments:', data);

  return data as (Appointment & { client: Profile })[];
}

export async function getServicesById(ids: number[]): Promise<Service[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .in("id", ids);
  
    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  
    return data;
  }
  
  export async function getBarberById(id: number): Promise<Barber | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("barbers")
      .select("*")
      .eq("id", id)
      .single();
  
    if (error) {
      console.error('Error fetching barber:', error);
      return null;
    }
  
    return data;
  }

  export async function getBarbers(): Promise<Barber[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("barbers")
      .select("*");

    if (error) {
      console.error('Error fetching barbers:', error);
      return [];
    }
    return data;
  }

  export async function getServices(): Promise<Service[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("services")
      .select("*");

    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }
    return data;
  }