"use client";

import {useAppointments} from "@/components/AppointmentsContext";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Database} from "@/database.types";

type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type Props = {
  appointments: (Appointment & {client: Profile})[];
};

export default function AppointmentsList({appointments}: Props) {
  const {setSelectedAppointment} = useAppointments();

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
          return (
            <TableRow key={appointment.id} onClick={() => setSelectedAppointment(appointment)} className="cursor-pointer hover:bg-muted/20">
              <TableCell>
                <div className="font-medium">{appointment.client.full_name}</div>
                <div className="text-sm text-muted-foreground">{appointment.client.email}</div>
              </TableCell>
              <TableCell>
                <Badge variant={isConfirmed ? "secondary" : "outline"}>{isConfirmed ? "Completed" : "Upcoming"}</Badge>
              </TableCell>
              <TableCell>{appointment.date}</TableCell>
              <TableCell>{appointment.time}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
