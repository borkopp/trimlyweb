import { createClient } from '@/utils/supabase/client';

const supabase = createClient();


export async function adminRemoveAppointment(id: number): Promise<void> {
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
}
}
