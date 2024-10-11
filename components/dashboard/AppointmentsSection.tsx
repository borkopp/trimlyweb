import AppointmentsList from "./AppointmentsList";
import {Database} from "@/database.types";

type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type Props = {
  appointments: (Appointment & {client: Profile})[];
};

export default function AppointmentsSection({appointments}: Props) {
  return (
    <div className="w-full">
      <AppointmentsList appointments={appointments} />
    </div>
  );
}
