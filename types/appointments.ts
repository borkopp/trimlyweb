import { Database } from "@/database.types";

type AppointmentRow = Database["public"]["Tables"]["appointments"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type Appointment = Omit<AppointmentRow, "duration"> & {
  duration: AppointmentRow["duration"] | undefined;
  client: ProfileRow;
};