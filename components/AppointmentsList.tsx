"use client";

import {useAppointments} from "@/components/AppointmentsContext";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Database} from "@/database.types";
import {format, parseISO} from "date-fns";

type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type Props = {
  appointments: (Appointment & {client: Profile})[];
};

export default function AppointmentsList({appointments}: Props) {
  const {selectedAppointment, setSelectedAppointment} = useAppointments();

  // TODO: do with dayjs for consistency
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

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
        {appointments.map((appointment) => {
          const isConfirmed = new Date(`${appointment.date}T${appointment.time}`) < new Date();
          const isSelected = selectedAppointment?.id === appointment.id;
          return (
            <TableRow key={appointment.id} onClick={() => setSelectedAppointment(appointment)} className={`cursor-pointer transition-colors ${isSelected ? "bg-muted/50" : "hover:bg-muted/50"}`}>
              <TableCell>
                <div className="font-medium">{appointment.client.full_name}</div>
                <div className="text-sm text-muted-foreground">{appointment.client.email}</div>
              </TableCell>
              <TableCell>
                <Badge variant={isConfirmed ? "secondary" : "outline"}>{isConfirmed ? "Completed" : "Upcoming"}</Badge>
              </TableCell>
              <TableCell>{format(parseISO(appointment.date), "MMM dd, yyyy")}</TableCell>
              <TableCell>{formatTime(appointment.time)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
