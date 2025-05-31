"use client";
import React, { useEffect, useState } from "react";
import { useAppointments } from "@/components/dashboard/AppointmentsContext";
import { createClient } from "@/utils/supabase/client";
import { Calendar, Clock, Copy, MoreVertical, Users } from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Database } from "@/database.types";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTransition } from "react";
import { cancelAppointmentByBarber } from "@/app/actions/appointment-actions";
import { RescheduleDialog } from "./RescheduleDialog";
import { formatDate, formatDateShort } from "@/utils/dateUtils";

type Service = Database["public"]["Tables"]["services"]["Row"];
type Barber = Database["public"]["Tables"]["barbers"]["Row"];

// Add loggedInUserId to props
interface AppointmentDetailsOverviewProps {
  loggedInUserId: string | null;
}

export function AppointmentDetailsOverview({
  loggedInUserId,
}: AppointmentDetailsOverviewProps) {
  const { selectedAppointment, removeAppointment } = useAppointments();
  const [services, setServices] = useState<Service[]>([]);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  useEffect(() => {
    if (!selectedAppointment) return;

    const fetchDetails = async () => {
      // Fetch services
      const { data: fetchedServices, error: servicesError } = await supabase
        .from("services")
        .select("*")
        .in("id", selectedAppointment.service_ids);

      if (servicesError) {
        console.error("Error fetching services:", servicesError);
      } else {
        setServices(fetchedServices || []);
      }

      // Fetch barber
      const { data: fetchedBarber, error: barberError } = await supabase
        .from("barbers")
        .select("*")
        .eq("id", selectedAppointment.barber_id)
        .single();

      if (barberError) {
        console.error("Error fetching barber:", barberError);
      } else {
        setBarber(fetchedBarber);
      }
    };

    fetchDetails();
  }, [selectedAppointment, supabase]);

  if (!selectedAppointment) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle>Select an appointment to see details</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            Click on an appointment from the list to view its details.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Determine if it's a walk-in based on user ID comparison
  const isWalkIn =
    selectedAppointment.user_id === loggedInUserId &&
    !!selectedAppointment.name;

  // Check if appointment is in the past (completed)
  const isAppointmentCompleted = () => {
    const appointmentDateTime = new Date(
      `${selectedAppointment.date}T${selectedAppointment.time}`
    );
    const now = new Date();
    return appointmentDateTime < now;
  };

  const totalDuration = services.reduce(
    (total, service) => total + (service.time || 0),
    0
  );
  const totalPrice = services.reduce(
    (total, service) => total + service.price,
    0
  );

  const handleCancelAppointment = async (): Promise<void> => {
    if (!selectedAppointment) return;

    try {
      startTransition(async () => {
        await cancelAppointmentByBarber(selectedAppointment.id);
        toast({
          title: "Appointment cancelled",
          description: "The appointment has been marked as cancelled.",
        });
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
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Appointment Details
          </CardTitle>
          <CardDescription className="flex flex-row gap-2 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDateShort(selectedAppointment.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {selectedAppointment.time.slice(0, 5)}
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
                <span className="lg:sr-only  xl:not-sr-only xl:whitespace-nowrap">
                  Reschedule
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" className="h-8 w-8">
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
              <span>{services.map((service) => service.name).join(", ")}</span>
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
                {/* Display appointment.name for walk-ins */}
                <dd>{selectedAppointment.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Type</dt>
                <dd className="italic">Walk-in / Phone</dd>
              </div>
            </dl>
          </div>
        ) : selectedAppointment.client ? (
          // Render full client info if it's a registered client
          <div className="grid gap-3">
            <div className="font-semibold">Client Information</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Name</dt>
                <dd>{selectedAppointment.client.full_name}</dd>
              </div>
              {selectedAppointment.client.email && (
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>
                    <a
                      className="hover:underline"
                      href={`mailto:${selectedAppointment.client.email}`}
                    >
                      {selectedAppointment.client.email}
                    </a>
                  </dd>
                </div>
              )}
              {/* Add Phone display if available on profile */}
              {selectedAppointment.client.phone && (
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd>
                    <a
                      className="hover:underline"
                      href={`tel:${selectedAppointment.client.phone}`}
                    >
                      {selectedAppointment.client.phone}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        ) : (
          // Optional: Fallback if client data is missing unexpectedly
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
          <span>Appointment-ID: {selectedAppointment.id}</span>
          <span>
            Created{" "}
            <time dateTime={selectedAppointment.date}>
              {formatDate(selectedAppointment.date)}
            </time>
          </span>
        </div>
        {/* <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Previous Appointment</span>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Next Appointment</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination> */}
      </CardFooter>
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
      {selectedAppointment && (
        <RescheduleDialog
          open={isRescheduleDialogOpen}
          onOpenChange={setIsRescheduleDialogOpen}
          appointment={selectedAppointment}
        />
      )}
    </Card>
  );
}
