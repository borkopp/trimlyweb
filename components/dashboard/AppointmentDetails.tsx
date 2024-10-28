"use client";
import React, {useEffect, useState} from "react";
import {createClient} from "@/utils/supabase/client";
import {Calendar, Clock, Copy, MoreVertical, Users} from "lucide-react";
import {Button} from "@/components/ui/button";
import {CardContent, CardDescription, CardFooter, CardTitle} from "@/components/ui/card";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Separator} from "@/components/ui/separator";
import {Database} from "@/database.types";
import {toast} from "@/components/ui/use-toast";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useTransition} from "react";
import {deleteAppointment} from "@/app/actions/appointment-actions";
import {Appointment} from "@/types/appointments";

type Service = Database["public"]["Tables"]["services"]["Row"];
type Barber = Database["public"]["Tables"]["barbers"]["Row"];

type Props = {
  appointmentId: string | null;
  onClose?: () => void;
};

export function AppointmentDetails({appointmentId, onClose}: Props) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!appointmentId) return;

      try {
        // Fetch appointment with client details
        const {data: appointmentData, error: appointmentError} = await supabase
          .from("appointments")
          .select(
            `
            *,
            client:profiles!appointments_user_id_fkey(full_name, email)
          `
          )
          .eq("id", appointmentId)
          .single();

        if (appointmentError) throw appointmentError;
        setSelectedAppointment(appointmentData as Appointment);

        // Fetch services
        if (appointmentData.service_ids.length > 0) {
          const {data: servicesData, error: servicesError} = await supabase.from("services").select("*").in("id", appointmentData.service_ids);

          if (servicesError) throw servicesError;
          setServices(servicesData);
        }

        // Fetch barber
        const {data: barberData, error: barberError} = await supabase.from("barbers").select("*").eq("id", appointmentData.barber_id).single();

        if (barberError) throw barberError;
        setBarber(barberData);
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
  }, [appointmentId, supabase]);

  if (!selectedAppointment) {
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

  return (
    <div className="overflow-hidden">
      <div className="flex flex-row items-start bg-muted/50 p-6">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Appointment Details
            <Button size="icon" variant="outline" className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100">
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy Appointment ID</span>
            </Button>
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
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">Reschedule</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-500">
                Cancel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Client History</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
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
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Phone</dt>
              <dd>
                <a className="hover:underline" href={`tel:+1234567890`}>
                  +1 234 567 890
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
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Created <time dateTime={selectedAppointment.date}>{selectedAppointment.date}</time>
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
            <DialogDescription>Are you sure you want to cancel this appointment? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              No, Keep Appointment
            </Button>
            <Button variant="destructive" onClick={handleRemoveAppointment}>
              Yes, Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
