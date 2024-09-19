import {createClient} from "@/utils/supabase/server";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {formatDate, formatTime} from "@/utils/dateUtils";
import AppointmentRow from "@/components/AppointmentRow";

export default async function AppointmentsList() {
  const supabase = createClient();
  const {data: appointments, error} = await supabase
    .from("appointments")
    .select(
      `
      *,
      client:profiles!appointments_user_id_fkey(full_name, email)
    `
    )
    .order("date", {ascending: true})
    .order("time", {ascending: true});

  if (error) {
    console.error("Error fetching appointments:", error);
    return <div>Error loading appointments</div>;
  }

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
