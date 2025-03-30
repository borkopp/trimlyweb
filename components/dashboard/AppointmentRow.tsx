"use client";

import {useAppointments} from "@/components/dashboard/AppointmentsContext";
import {TableCell, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {formatDate, formatTime} from "@/utils/dateUtils";
import {Database} from "@/database.types";

type Appointment = Database["public"]["Tables"]["appointments"]["Row"] & {
  client: Database["public"]["Tables"]["profiles"]["Row"];
};

type Props = {
  appointment: Appointment;
};

export default function AppointmentRow({appointment}: Props) {
  const {selectedAppointment, setSelectedAppointment} = useAppointments();

  const isConfirmed = new Date(`${appointment.date}T${appointment.time}`) < new Date();
  const isSelected = selectedAppointment?.id === appointment.id;

  // Determine customer name - use the appointment.name field if available,
  // otherwise use the client profile name from the user relationship
  const customerName = appointment.name || appointment.client?.full_name;
  const customerEmail = appointment.client?.email;

  return (
    <TableRow
      onClick={() => setSelectedAppointment(appointment)}
      className={`cursor-pointer transition-colors ${isSelected ? "bg-muted/50" : "hover:bg-muted/50"}`}>
      <TableCell>
        <div className="font-medium">{customerName}</div>
        {customerEmail && <div className="text-sm text-muted-foreground">{customerEmail}</div>}
        {!customerEmail && appointment.name && <div className="text-xs text-muted-foreground italic">Phone/walk-in customer</div>}
      </TableCell>
      <TableCell>
        <Badge variant={isConfirmed ? "secondary" : "outline"}>{isConfirmed ? "Completed" : "Upcoming"}</Badge>
      </TableCell>
      <TableCell>{formatDate(appointment.date)}</TableCell>
      <TableCell>{formatTime(appointment.time)}</TableCell>
    </TableRow>
  );
}
