import { Database } from '@/database.types';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];


export async function adminRemoveAppointment(id: number): Promise<void> {
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
}
}

export async function getWeekAppointments(): Promise<(Appointment & { client: Profile })[]> {
    const supabase = createClient();
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()).toISOString().split('T')[0];
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6).toISOString().split('T')[0];
  
  
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

  return data as (Appointment & { client: Profile })[];
}