import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import AppointmentRow from "@/components/AppointmentRow";
import {Database} from "@/database.types";

type Appointment = Database["public"]["Tables"]["appointments"]["Row"] & {
  client: Database["public"]["Tables"]["profiles"]["Row"];
};

export default async function AppointmentsList({appointments}: {appointments: Appointment[]}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <AppointmentRow key={appointment.id} appointment={appointment} />
        ))}
      </TableBody>
    </Table>
  );
}
