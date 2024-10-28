import { Database } from "@/database.types";

type AppointmentRow = Database["public"]["Tables"]["appointments"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export interface Appointment extends Omit<AppointmentRow, 'user_id'> {
  client: {
    full_name: string | null;
    email: string | null;
  };
}
