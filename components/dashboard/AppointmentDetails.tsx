"use client";
import React, {useEffect, useState} from "react";
import {Calendar, Clock, Copy, MoreVertical, Users} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Separator} from "@/components/ui/separator";
import {Database} from "@/database.types";
import {toast} from "@/components/ui/use-toast";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useTransition} from "react";
import {deleteAppointment, getAppointmentDetails} from "@/app/actions/appointment-actions";
import {Appointment} from "@/types/appointments";
import {RescheduleDialog} from "./RescheduleDialog";

type Service = Database["public"]["Tables"]["services"]["Row"];
type Barber = Database["public"]["Tables"]["barbers"]["Row"];

type Props = {
  appointmentId?: string | null;
  appointment?: Appointment | null;
  onClose?: () => void;
  variant?: "card" | "dialog";
  onAppointmentDeleted?: (id: number) => void;
};

export function AppointmentDetails({appointmentId, appointment: initialAppointment, onClose, variant = "card", onAppointmentDeleted}: Props) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(initialAppointment || null);
  const [services, setServices] = useState<Service[]>([]);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!appointmentId && !initialAppointment) return;

      try {
        if (appointmentId) {
          console.log("Fetching appointment with ID:", appointmentId);
          const details = await getAppointmentDetails(appointmentId);
          setSelectedAppointment(details.appointment as Appointment);
          setServices(details.services);
          setBarber(details.barber);
        } else if (initialAppointment) {
          setSelectedAppointment(initialAppointment);
          // Fetch services and barber details if needed
          const details = await getAppointmentDetails(initialAppointment.id);
          setServices(details.services);
          setBarber(details.barber);
        }
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        toast({
          title: "Error",
          description: "Failed to load appointment details",
          variant: "destructive",
        });
      }
    };

    fetchDetails();
  }, [appointmentId, initialAppointment]);

  if (!selectedAppointment) {
    if (variant === "card") {
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
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold">Loading appointment details...</h2>
      </div>
    );
  }

  const totalDuration = services.reduce((total, service) => total + (service.time || 0), 0);
  const totalPrice = services.reduce((total, service) => total + service.price, 0);

  const handleRemoveAppointment = async (): Promise<void> => {
    if (!selectedAppointment) return;

    try {
      startTransition(async () => {
        await deleteAppointment(selectedAppointment.id);
        onAppointmentDeleted?.(selectedAppointment.id);
        toast({
          title: "Appointment cancelled",
          description: "The appointment has been successfully cancelled.",
        });
        onClose?.();
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

  const content = (
    <>
      <div className="grid gap-0.5">
        <CardTitle className="group flex items-center gap-2 text-lg">
          Appointment #{selectedAppointment.id}
          <div className="ml-auto flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsRescheduleDialogOpen(true)}>Reschedule</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500" onClick={() => setIsDeleteDialogOpen(true)}>
                  Cancel Appointment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
        <CardDescription className="flex flex-row gap-2 text-sm">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {selectedAppointment.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {selectedAppointment.time.slice(0, 5)}
          </span>
        </CardDescription>
      </div>

      <div className="mt-6 grid gap-3">
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
          <li className="flex items-center justify-between font-semibold">
            <span className="text-muted-foreground">Total</span>
            <span>€ {totalPrice.toFixed(2)}</span>
          </li>
        </ul>
      </div>

      <Separator className="my-4" />

      <div className="grid gap-3">
        <div className="font-semibold">Client Information</div>
        <dl className="grid gap-3">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Name</dt>
            <dd>{selectedAppointment.client.full_name}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd>
              <a className="hover:underline" href={`mailto:${selectedAppointment.client.email}`}>
                {selectedAppointment.client.email}
              </a>
            </dd>
          </div>
        </dl>
      </div>

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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Appointment Cancellation</DialogTitle>
            <DialogDescription>Are you sure you want to cancel this appointment? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              No, Keep Appointment
            </Button>
            <Button variant="destructive" onClick={handleRemoveAppointment} disabled={isPending}>
              Yes, Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RescheduleDialog
        open={isRescheduleDialogOpen}
        onOpenChange={setIsRescheduleDialogOpen}
        appointment={selectedAppointment}
        onReschedule={() => {
          setIsRescheduleDialogOpen(false);
          window.location.reload();
        }}
      />
    </>
  );

  if (variant === "card") {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="relative flex flex-row items-start bg-muted/50">{content}</CardHeader>
        <CardContent className="p-6 text-sm">{/* The rest of the content */}</CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Created <time dateTime={selectedAppointment.date}>{selectedAppointment.date}</time>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return <div className="relative p-6">{content}</div>;
}
