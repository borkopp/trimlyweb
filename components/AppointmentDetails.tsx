"use client";

import React, {useEffect, useState} from "react";
import {useAppointments} from "@/components/AppointmentsContext";
import {createClient} from "@/utils/supabase/client";
import {ChevronLeft, ChevronRight, Clock, Copy, MoreVertical, Users} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Pagination, PaginationContent, PaginationItem} from "@/components/ui/pagination";
import {Separator} from "@/components/ui/separator";
import {Database} from "@/database.types";

type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];
type Barber = Database["public"]["Tables"]["barbers"]["Row"];

export function AppointmentDetails() {
  const {selectedAppointment} = useAppointments();
  const [services, setServices] = useState<Service[]>([]);
  const [barber, setBarber] = useState<Barber | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!selectedAppointment) return;

    const fetchDetails = async () => {
      // Fetch services
      const {data: fetchedServices, error: servicesError} = await supabase.from("services").select("*").in("id", selectedAppointment.service_ids);

      if (servicesError) {
        console.error("Error fetching services:", servicesError);
      } else {
        setServices(fetchedServices || []);
      }

      // Fetch barber
      const {data: fetchedBarber, error: barberError} = await supabase.from("barbers").select("*").eq("id", selectedAppointment.barber_id).single();

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
          <CardDescription className="max-w-lg text-balance leading-relaxed">Click on an appointment from the list to view its details.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const totalDuration = services.reduce((total, service) => total + (service.time || 0), 0);
  const totalPrice = services.reduce((total, service) => total + service.price, 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Appointment Details
            <Button size="icon" variant="outline" className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100">
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy Appointment ID</span>
            </Button>
          </CardTitle>
          <CardDescription>Date: {selectedAppointment.date}</CardDescription>
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
              <DropdownMenuItem>Cancel</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Client History</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <span>${totalPrice.toFixed(2)}</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Client Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Name</dt>
              <dd>{selectedAppointment.user_id}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                <a href={`mailto:${selectedAppointment.user_id}`}>{selectedAppointment.user_id}</a>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Phone</dt>
              <dd>
                <a href={`tel:+1234567890`}>+1 234 567 890</a>
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
        <Pagination className="ml-auto mr-0 w-auto">
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
        </Pagination>
      </CardFooter>
    </Card>
  );
}
