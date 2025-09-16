"use client";

import React, { useEffect, useState, useTransition } from "react";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, MoreVertical, Users, Copy } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/lib/toast";
import { cancelAppointmentByBarber } from "@/app/actions/appointment-actions";
import { RescheduleDialog } from "@/components/dashboard/RescheduleDialog";
import { formatDate, formatDateShort } from "@/utils/dateUtils";
import { Database } from "@/database.types";

import { Dialog as CalendarDialog } from "@/components/ui-calendar/dialog";
import type { IEvent } from "@/calendar/interfaces";

type Service = Database["public"]["Tables"]["services"]["Row"];
type Barber = Database["public"]["Tables"]["barbers"]["Row"];
type Client = Database["public"]["Tables"]["profiles"]["Row"];

interface DatabaseAppointment {
  id: number;
  user_id: string | null;
  barber_id: number;
  date: string;
  time: string;
  end_time: string | null;
  service_ids: number[];
  is_cancelled: boolean;
  is_cancelled_by_barber: boolean;
  name: string | null; // For walk-in customers
  client?: Client;
}

interface IProps {
  event: IEvent;
  children: React.ReactNode;
}

export function EventDetailsDialog({ event, children }: IProps) {
  const [appointment, setAppointment] = useState<DatabaseAppointment | null>(
    null
  );
  const [services, setServices] = useState<Service[]>([]);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setLoggedInUserId(user?.id || null);
    };
    getCurrentUser();
  }, [supabase]);

  useEffect(() => {
    if (!isDialogOpen) return;

    const fetchAppointmentDetails = async () => {
      try {
        // Fetch the full appointment details using the event ID
        const { data: appointmentData, error: appointmentError } =
          await supabase
            .from("appointments")
            .select(
              `
            *,
            client:user_id (
              id,
              full_name,
              email,
              phone
            )
          `
            )
            .eq("id", event.id)
            .single();

        if (appointmentError) {
          console.error("Error fetching appointment:", appointmentError);
          return;
        }

        setAppointment(appointmentData);

        // Fetch services
        const { data: fetchedServices, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .in("id", appointmentData.service_ids);

        if (servicesError) {
          console.error("Error fetching services:", servicesError);
        } else {
          setServices(fetchedServices || []);
        }

        // Fetch barber
        const { data: fetchedBarber, error: barberError } = await supabase
          .from("barbers")
          .select("*")
          .eq("id", appointmentData.barber_id)
          .single();

        if (barberError) {
          console.error("Error fetching barber:", barberError);
        } else {
          setBarber(fetchedBarber);
        }
      } catch (error) {
        console.error("Error fetching appointment details:", error);
      }
    };

    fetchAppointmentDetails();
  }, [event.id, isDialogOpen, supabase]);

  // Check if appointment is in the past (completed)
  const isAppointmentCompleted = () => {
    if (!appointment) return false;
    const appointmentDateTime = new Date(
      `${appointment.date}T${appointment.time}`
    );
    const now = new Date();
    return appointmentDateTime < now;
  };

  // Determine if it's a walk-in based on user ID comparison
  const isWalkIn =
    appointment && appointment.user_id === loggedInUserId && !!appointment.name;

  const totalDuration = services.reduce(
    (total, service) => total + (service.time || 0),
    0
  );
  const totalPrice = services.reduce(
    (total, service) => total + service.price,
    0
  );

  const handleCancelAppointment = async (): Promise<void> => {
    if (!appointment) return;

    try {
      startTransition(async () => {
        await cancelAppointmentByBarber(appointment.id);
        toast({
          title: "Appointment cancelled",
          description: "The appointment has been marked as cancelled.",
          variant: "success",
        });
        setIsDialogOpen(false);
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel the appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <CalendarDialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <CalendarDialog.Trigger asChild onClick={() => setIsDialogOpen(true)}>
        {children}
      </CalendarDialog.Trigger>

      <CalendarDialog.Content
        size="xs"
        className="max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <CalendarDialog.Close />

        {/* Add DialogTitle for accessibility */}
        <CalendarDialog.Title className="sr-only">
          Appointment Details
        </CalendarDialog.Title>

        <div className="">
          {!appointment ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Card className="overflow-hidden border-0 shadow-none">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="flex flex-row gap-2 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDateShort(appointment.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {appointment.time.slice(0, 5)}
                    </span>
                  </CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  {!isAppointmentCompleted() && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1"
                        onClick={() => setIsRescheduleDialogOpen(true)}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                          Reschedule
                        </span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => setIsDeleteDialogOpen(true)}
                          >
                            Cancel Appointment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Appointment Details</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Service</span>
                      <span>
                        {services.map((service) => service.name).join(", ")}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span>{totalDuration} minutes</span>
                    </li>
                  </ul>
                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span>€ {totalPrice.toFixed(2)}</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />

                {/* Conditionally render Client Information */}
                {isWalkIn ? (
                  <div className="grid gap-3">
                    <div className="font-semibold">Client Information</div>
                    <dl className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Name</dt>
                        <dd>{appointment.name}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Type</dt>
                        <dd className="italic">Walk-in / Phone</dd>
                      </div>
                    </dl>
                  </div>
                ) : appointment.client ? (
                  <div className="grid gap-3">
                    <div className="font-semibold">Client Information</div>
                    <dl className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Name</dt>
                        <dd>{appointment.client.full_name}</dd>
                      </div>
                      {appointment.client.email && (
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Email</dt>
                          <dd>
                            <a
                              className="hover:underline"
                              href={`mailto:${appointment.client.email}`}
                            >
                              {appointment.client.email}
                            </a>
                          </dd>
                        </div>
                      )}
                      {appointment.client.phone && (
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Phone</dt>
                          <dd>
                            <a
                              className="hover:underline"
                              href={`tel:${appointment.client.phone}`}
                            >
                              {appointment.client.phone}
                            </a>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    <div className="font-semibold">Client Information</div>
                    <p className="text-muted-foreground text-sm italic">
                      Client details not available.
                    </p>
                  </div>
                )}

                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Barber Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Barber
                      </dt>
                      <dd>{barber?.name}</dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs flex justify-between w-full text-muted-foreground">
                  <span>Appointment-ID: {appointment.id}</span>
                  <span>
                    Created{" "}
                    <time dateTime={appointment.date}>
                      {formatDate(appointment.date)}
                    </time>
                  </span>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Appointment Cancellation</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this appointment? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                No, Keep Appointment
              </Button>
              <Button variant="destructive" onClick={handleCancelAppointment}>
                Yes, Cancel Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reschedule Dialog */}
        {appointment && (
          <RescheduleDialog
            open={isRescheduleDialogOpen}
            onOpenChange={setIsRescheduleDialogOpen}
            appointment={appointment as any} // Type assertion needed due to interface differences
          />
        )}
      </CalendarDialog.Content>
    </CalendarDialog.Root>
  );
}
