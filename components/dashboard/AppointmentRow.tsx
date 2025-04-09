"use client";

import {useAppointments} from "@/components/dashboard/AppointmentsContext";
import {TableCell, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {formatDate, formatTime} from "@/utils/dateUtils";
import {Database} from "@/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type AppointmentWithNullableClient = Database["public"]["Tables"]["appointments"]["Row"] & {
  client: Profile | null; // Allow client to be null
};

type AppointmentWithClient = Database["public"]["Tables"]["appointments"]["Row"] & {
  client: Profile; // Non-nullable client
};

type Props = {
  appointment: AppointmentWithNullableClient;
  loggedInUserId: string;
};

export default function AppointmentRow({appointment, loggedInUserId}: Props) {
  const {selectedAppointment, setSelectedAppointment} = useAppointments();

  const isConfirmed = new Date(`${appointment.date}T${appointment.time}`) < new Date();
  const isSelected = selectedAppointment?.id === appointment.id;
  const isCancelled = appointment.is_cancelled || appointment.is_cancelled_by_barber;

  const isWalkIn = appointment.user_id === loggedInUserId && !!appointment.name;

  // Determine customer name and details
  let customerName = 'Unknown Client';
  let customerDetails = null;

  if (isWalkIn) {
    customerName = appointment.name || 'Walk-in Client'; // Use appointment.name if available
    customerDetails = <div className="text-xs text-muted-foreground italic">Walk-in/Phone</div>;
  } else if (appointment.client) {
    customerName = appointment.client.full_name || 'Registered Client';
    customerDetails = appointment.client.email ? (
      <div className="text-sm text-muted-foreground">{appointment.client.email}</div>
    ) : (
      <div className="text-xs text-muted-foreground italic">Client (No email)</div>
    );
  } // If neither walk-in nor client data, customerName remains 'Unknown Client'

  const handleRowClick = () => {
    // Keep existing logic, but ensure selection logic makes sense for walk-ins too
    if (appointment.client) {
      setSelectedAppointment(appointment as AppointmentWithClient);
    } else if (isWalkIn) {
      // Decide how to handle selection for walk-ins. Maybe still select?
      // For now, casting might be needed if context expects non-null client.
      // Or modify context to handle this case.
      // Let's temporarily allow selection but log a warning.
      console.warn("Selecting walk-in appointment, context might expect client data:", appointment.id);
      setSelectedAppointment(appointment as AppointmentWithClient); // CAUTION: Casting walk-in
    } else {
      console.warn("Cannot select appointment row without client data or walk-in info:", appointment.id);
      setSelectedAppointment(null);
    }
  };

  return (
    <TableRow
      onClick={handleRowClick}
      className={`cursor-pointer transition-colors ${isSelected ? "bg-muted/50" : "hover:bg-muted/50"}`}>
      <TableCell>
        <div className="font-medium">{customerName}</div>
        {customerDetails}
      </TableCell>
      <TableCell>
        <Badge variant={isCancelled ? "destructive" : isConfirmed ? "secondary" : "outline"}>{isCancelled ? "Cancelled" : isConfirmed ? "Completed" : "Upcoming"}</Badge>
      </TableCell>
      <TableCell>{formatDate(appointment.date)}</TableCell>
      <TableCell>{formatTime(appointment.time)}</TableCell>
    </TableRow>
  );
}
