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
import {Badge} from "@/components/ui/badge";
import {formatDate, formatTime} from "@/utils/dateUtils";

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

  const isCompletedAppointment = new Date(`${selectedAppointment.date}T${selectedAppointment.time}`) < new Date();
  const customerName = selectedAppointment.name || selectedAppointment.client?.full_name;
  const customerEmail = selectedAppointment.client?.email;

  const content = (
    <>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">Appointment Details</h3>
          <Badge variant={isCompletedAppointment ? "secondary" : "outline"}>{isCompletedAppointment ? "Completed" : "Upcoming"}</Badge>
        </div>

        <Card className="p-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{customerName}</p>
                {customerEmail && <p className="text-sm text-muted-foreground">{customerEmail}</p>}
                {!customerEmail && selectedAppointment.name && <p className="text-xs text-muted-foreground italic">Phone/walk-in customer</p>}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{formatDate(selectedAppointment.date)}</p>
                <p className="text-sm text-muted-foreground">Appointment Date</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{formatTime(selectedAppointment.time)}</p>
                <p className="text-sm text-muted-foreground">Appointment Time</p>
              </div>
            </div>
          </div>
        </Card>

        <div>
          <h4 className="text-sm font-medium mb-2">Services</h4>
          <div className="space-y-2">
            {services.map((service) => (
              <Card key={service.id} className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    {service.description && <p className="text-xs text-muted-foreground">{service.description}</p>}
                  </div>
                  <p className="font-medium">€{service.price}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center px-1">
          <p className="font-medium">Total</p>
          <p className="font-bold">€{totalPrice.toFixed(2)}</p>
        </div>

        {!isCompletedAppointment && (
          <Button variant="destructive" className="w-full" onClick={() => setIsDeleteDialogOpen(true)}>
            Cancel Appointment
          </Button>
        )}
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
