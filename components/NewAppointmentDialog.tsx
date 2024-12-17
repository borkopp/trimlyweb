"use client";

import { useState, useTransition, useRef, useEffect, useCallback, useMemo } from "react";
import { format, isBefore, isSameDay, set, parse, addDays } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, Scissors, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Database } from "@/database.types";
import { toast } from "./ui/use-toast";
import {
  createAppointment,
  getBarberServices,
  getBarberAvailability,
} from "@/app/actions/appointment-actions";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

type Barber = Database["public"]["Tables"]["barbers"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];

interface Props {
  initialBarbers: Barber[];
  initialServices: Service[];
  user_id: string;
}

export function NewAppointmentDialog({ initialBarbers, user_id }: Props) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [barber, setBarber] = useState("");
  const [service, setService] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [time, setTime] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [barberAvatars, setBarberAvatars] = useState<Record<number, string>>(
    {}
  );
  const [serviceAvatars, setServiceAvatars] = useState<Record<number, string>>(
    {}
  );
  const queryClient = useQueryClient();
  const today = new Date();

  const getAvailabilityKey = (barberId: string, date: Date | undefined) =>
    ['barber-availability', barberId, format(date ?? today, 'yyyy-MM-dd')];

  const { data: currentSlots, isLoading } = useQuery({
    queryKey: getAvailabilityKey(barber, date),
    queryFn: () => {
      if (!date) return Promise.resolve([]);
      return getBarberAvailability(parseInt(barber), format(date, 'yyyy-MM-dd'));
    },
    enabled: !!barber && !!date,
  });

  useEffect(() => {
    if (barber && date) {
      const prefetchDates = Array.from({ length: 5 }, (_, i) =>
        addDays(date, i + 1)
      );

      prefetchDates.forEach(async (prefetchDate) => {
        await queryClient.prefetchQuery({
          queryKey: getAvailabilityKey(barber, prefetchDate),
          queryFn: () => getBarberAvailability(parseInt(barber), format(prefetchDate, 'yyyy-MM-dd')),
        });
      });
    }
  }, [barber, date, queryClient]);

  useEffect(() => {
    async function loadBarberAvatars() {
      const supabase = createClient();
      const avatarUrls: Record<number, string> = {};

      for (const b of initialBarbers) {
        if (b.image) {
          const { data } = await supabase.storage
            .from("barber-images")
            .getPublicUrl(b.image);
          if (data?.publicUrl) {
            avatarUrls[b.id] = data.publicUrl;
          }
        }
      }

      setBarberAvatars(avatarUrls);
    }

    loadBarberAvatars();
  }, [initialBarbers]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchBarberServices = useCallback(async () => {
    try {
      const services = await getBarberServices(parseInt(barber));
      const serviceAvatars: Record<number, string> = {};
      for (const s of services) {
        if (s.image) {
          const url = await getImageUrl(s.image);
          if (url) serviceAvatars[s.id] = url;
        }
      }
      setServices(services);
      setServiceAvatars(serviceAvatars);
    } catch (error) {
      console.error("Error fetching barber services:", error);
    }
  }, [barber]);

  useEffect(() => {
    if (barber) {
      fetchBarberServices();
    } else {
      setServices([]);
    }
  }, [barber, fetchBarberServices]);

  async function getImageUrl(path: string) {
    if (!path) return null;
    const supabase = createClient();
    const { data } = await supabase.storage.from("barber-images").getPublicUrl(path);
    return data?.publicUrl || null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !barber || !service || !time) return;

    startTransition(async () => {
      try {
        await createAppointment({
          barber_id: parseInt(barber),
          service_ids: [parseInt(service)],
          date: format(date, "yyyy-MM-dd"),
          time,
          barbershop_id: 1, 
          user_id: user_id,
        });
        toast({
          title: "Success",
          description: "Appointment created successfully",
        });
        setOpen(false);
        setDate(undefined);
        setBarber("");
        setService("");
        setTime("");
      } catch (error) {
        console.error("Error creating appointment:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create appointment",
          variant: "destructive",
        });
      }
    });
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      for (let minute of [0, 30]) {
        slots.push(
          `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`
        );
      }
    }
    return slots;
  };

  const isTimeSlotAvailable = (timeSlot: string) => {
    if (!date) return true;
    const [hours, minutes] = timeSlot.split(":").map(Number);
    const slotDate = set(date, { hours, minutes });
    const now = new Date();
    return isSameDay(date, now) ? !isBefore(slotDate, now) : true;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-white" onClick={() => setOpen(true)}>
          <CalendarIcon className="mr-2 h-4 w-4 text-white" />
          New Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-[90vw] h-[600px] flex flex-col bg-black">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader>
            <DialogTitle>Create New Appointment</DialogTitle>
            <DialogDescription>
              Fill in the details to schedule a new appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-[250px_250px_fit-content(100%)_250px] gap-6 py-6">
            {/* Barber Selection Column */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Choose Barber</Label>
              <ScrollArea className="h-[332px] border rounded-md bg-background">
                <div className="grid">
                  {initialBarbers.map((b) => (
                    <Button
                      key={b.id}
                      variant={
                        barber === b.id.toString() ? "secondary" : "outline"
                      }
                      className="w-full justify-start  p-4 h-auto rounded-none"
                      onClick={() => {
                        setBarber(b.id.toString());
                        setService(""); // Reset service when barber changes
                      }}
                    >
                      <div className="flex items-center w-full gap-3">
                        <Avatar className="w-12 h-12">
                          {barberAvatars[b.id] ? (
                            <AvatarImage
                              src={barberAvatars[b.id] || undefined}
                              alt={b.name || ""}
                            />
                          ) : (
                            <AvatarFallback>
                              <User className="h-6 w-6" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex flex-col items-start">
                          <span className="text-base font-medium">
                            {b.name}
                          </span>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Service Selection Column */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Select Service</Label>
              <ScrollArea className="h-[332px] border rounded-md bg-background">
                <div>
                  {!barber ? (
                    <div className="text-muted-foreground p-4">
                      Please select a barber first
                    </div>
                  ) : services.length === 0 ? (
                    <div className="text-muted-foreground p-4">
                      Loading services...
                    </div>
                  ) : (
                    <div className="grid">
                      {services.map((s) => (
                        <Button
                          key={s.id}
                          variant={
                            service === s.id.toString() ? "secondary" : "outline"
                          }
                          className="w-full justify-start  p-4 h-auto rounded-none"
                          onClick={() => setService(s.id.toString())}
                        >
                          <div className="flex items-center w-full gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                              <Image
                                src={serviceAvatars[s.id] || ""}
                                alt={s.name || ""}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-base font-medium">
                                {s.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                ${s.price}
                              </span>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Calendar Column */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                Choose Date
              </Label>
              <div>
                <div className="bg-background border rounded-md items-center flex justify-center p-3">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </div>
              </div>
            </div>

            {/* Time Selection Column */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Select Time</Label>
              <ScrollArea className="h-[332px] border rounded-md bg-background">
                <div className="">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : !barber ? (
                    <div className="text-muted-foreground p-4">
                      Select a barber to view available times
                    </div>
                  ) : !currentSlots?.length ? (
                    <div className="text-muted-foreground p-4">
                      No available slots for this date
                    </div>
                  ) : (
                    <div className="grid">
                      {currentSlots.map((slot) => (
                        <Button
                          key={slot.slot_time}
                          variant={time === slot.slot_time ? "secondary" : "outline"}
                          className="w-full justify-start p-4 h-auto rounded-none"
                          onClick={() => {
                            setTime(slot.slot_time);
                          }}
                          type="button"
                        >
                          {format(parse(slot.slot_time, "HH:mm:ss", new Date()), "h:mm a")}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              disabled={!date || !barber || !service || !time || isPending}
              className="w-[200px]"
            >
              {isPending ? "Creating..." : "Create Appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
