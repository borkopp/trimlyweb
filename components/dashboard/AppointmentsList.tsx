import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import AppointmentRow from "@/components/dashboard/AppointmentRow";
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
        {appointments.length > 0 ? (
          appointments.map((appointment) => <AppointmentRow key={appointment.id} appointment={appointment} />)
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No appointments to display.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
