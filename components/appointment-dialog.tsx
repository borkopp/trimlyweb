"use client";

import {
  useState,
  useEffect,
  useTransition,
  useCallback,
  ReactNode,
} from "react";
import { format, formatDate, isBefore, startOfDay } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarPlus, Scissors, User, Loader2 } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import { Database } from "@/database.types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { revalidateAppointments } from "@/app/actions/appointment-actions";
import { useRouter } from "next/navigation";
import { formatTime } from "@/utils/dateUtils";
import dayjs from "dayjs";

type Barber = Database["public"]["Tables"]["barbers"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];
type AvailableDate = {
  date_value: string;
  has_availability: boolean;
};
type AvailableSlot = {
  time_slot: string;
  end_time: string;
};

interface AppointmentDialogProps {
  userId: string;
  children?: ReactNode;
}

export function AppointmentDialog({
  userId,
  children,
}: AppointmentDialogProps) {
  // State
  const [open, setOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSelectedBarber(null);
        setSelectedServices([]);
        setSelectedDate(undefined);
        setSelectedTime(null);
        setCustomerName("");
      }, 300); // Delay to prevent flickering during closing animation
    }
  }, [open]);

  // Fetch barbers
  const {
    data: barbers = [],
    isLoading: isLoadingBarbers,
    error: barberError,
    refetch: refetchBarbers,
  } = useQuery({
    queryKey: ["barbers"],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/barbers`);
        if (!response.ok) {
          throw new Error(`Failed to fetch barbers: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.length === 0) {
          console.warn("No barbers found in the database");
        }
        return data as Barber[];
      } catch (error) {
        console.error("Error fetching barbers:", error);
        throw error;
      }
    },
  });

  // Fetch services when barber is selected
  const {
    data: services = [],
    isLoading: isLoadingServices,
    error: servicesError,
  } = useQuery({
    queryKey: ["barber-services", selectedBarber],
    queryFn: async () => {
      if (!selectedBarber) return [];
      try {
        const response = await fetch(
          `/api/barber-services?barberId=${selectedBarber}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.statusText}`);
        }
        return (await response.json()) as Service[];
      } catch (error) {
        console.error("Error fetching barber services:", error);
        throw error;
      }
    },
    enabled: !!selectedBarber,
  });

  // Fetch barbershop settings (buffer and max advance days) for selected barber
  const { data: shopSettings } = useQuery({
    queryKey: ["barbershop-settings", selectedBarber],
    queryFn: async () => {
      if (!selectedBarber) return { buffer: 30, maxDays: 14 };
      const res1 = await fetch(`/api/barbers?barberId=${selectedBarber}`);
      if (!res1.ok) return { buffer: 30, maxDays: 14 };
      const barbers = await res1.json();
      const barber = Array.isArray(barbers)
        ? barbers.find((b: any) => b.id === selectedBarber)
        : null;
      let barbershopId = barber?.barbershop_id;
      if (!barbershopId) {
        const r = await fetch(`/api/barber-by-id?barberId=${selectedBarber}`).catch(() => null);
        const j = r && r.ok ? await r.json() : null;
        barbershopId = j?.barbershop_id;
      }
      if (!barbershopId) return { buffer: 30, maxDays: 14 };
      const res2 = await fetch(`/api/barbershop-settings?id=${barbershopId}`).catch(() => null);
      if (!res2 || !res2.ok) return { buffer: 30, maxDays: 14 };
      const shop = await res2.json();
      return {
        buffer: shop?.last_minute_booking_buffer ?? 30,
        maxDays: shop?.max_advance_booking_days ?? 14,
      };
    },
    enabled: !!selectedBarber,
    staleTime: 1000 * 60 * 10,
  });

  // Fetch available dates when services are selected
  const {
    data: availableDates = [],
    isLoading: isLoadingDates,
    error: datesError,
  } = useQuery({
    queryKey: ["available-dates", selectedBarber, selectedServices],
    queryFn: async () => {
      if (!selectedBarber) return [];
      try {
        const response = await fetch(
          `/api/barber-available-dates?barberId=${selectedBarber}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch available dates: ${response.statusText}`
          );
        }
        return (await response.json()) as AvailableDate[];
      } catch (error) {
        console.error("Error fetching available dates:", error);
        throw error;
      }
    },
    enabled: !!selectedBarber,
  });

  // Calculate total service duration
  const { data: serviceDuration = 30, isLoading: isCalculatingDuration } =
    useQuery({
      queryKey: ["service-duration", selectedServices],
      queryFn: () => {
        if (selectedServices.length === 0) return Promise.resolve(30);
        // Calculate duration from selected services
        return Promise.resolve(
          services
            .filter((service) => selectedServices.includes(service.id))
            .reduce((total, service) => total + service.time, 0)
        );
      },
      enabled: selectedServices.length > 0 && services.length > 0,
    });

  // Fetch available time slots when date is selected
  const {
    data: availableSlots = [],
    isLoading: isLoadingSlots,
    error: slotsError,
  } = useQuery({
    queryKey: [
      "available-slots",
      selectedBarber,
      selectedDate?.toISOString(),
      selectedServices,
    ],
    queryFn: async () => {
      if (!selectedBarber || !selectedDate) return [];
      try {
        // Only proceed if we have selected services
        if (selectedServices.length === 0) {
          return [];
        }

        const serviceIdsParam =
          selectedServices.length > 0
            ? `&serviceIds=${selectedServices.join(",")}`
            : "";

        console.log(
          `Fetching time slots with: barberId=${selectedBarber}, date=${format(
            selectedDate,
            "yyyy-MM-dd"
          )}, services=${selectedServices.join(",")}`
        );

        const response = await fetch(
          `/api/barber-available-slots?barberId=${selectedBarber}&date=${format(
            selectedDate,
            "yyyy-MM-dd"
          )}${serviceIdsParam}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(
            "Error response from time slots API:",
            response.status,
            errorData
          );
          throw new Error(
            errorData.error ||
              `Failed to fetch available slots: ${response.statusText}`
          );
        }

        const data = await response.json();
        return data as AvailableSlot[];
      } catch (error) {
        console.error("Error fetching available time slots:", error);
        throw error;
      }
    },
    enabled: !!selectedBarber && !!selectedDate && selectedServices.length > 0,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Client-side filter for last minute buffer and past times
  const filteredSlots = (() => {
    if (!selectedDate || availableSlots.length === 0) return availableSlots;
    const bufferMin = shopSettings?.buffer ?? 30;
    const now = new Date();
    const isSameDay = startOfDay(selectedDate).getTime() === startOfDay(now).getTime();
    if (!isSameDay) return availableSlots;
    const currentMinutes = now.getHours() * 60 + now.getMinutes() + bufferMin;
    return availableSlots.filter((slot) => {
      const [h, m] = slot.time_slot.split(":").map((n) => parseInt(n, 10));
      const mins = h * 60 + m;
      return mins >= currentMinutes;
    });
  })();

  // Handle barber selection
  const handleBarberSelect = (barberId: number) => {
    setSelectedBarber(barberId);
  };

  // Handle service selection
  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices((prev) => {
      const isSelected = prev.includes(serviceId);
      if (isSelected) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // Calculate end time based on start time and service duration
  const calculateEndTime = (startTime: string, duration: number) => {
    const start = dayjs(`2000-01-01 ${startTime}`);
    const end = start.add(duration, 'minutes');
    return end.format('HH:mm');
  };

  // Handle creating the appointment
  const handleCreateAppointment = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (
      !selectedBarber ||
      !selectedDate ||
      !selectedTime ||
      selectedServices.length === 0 ||
      !customerName.trim()
    ) {
      toast({
        title: "Incomplete selection",
        description: "Please complete all steps and enter customer name before booking",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/appointments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            barberId: selectedBarber,
            userId: userId,
            serviceIds: selectedServices,
            date: format(selectedDate, "yyyy-MM-dd"),
            time: selectedTime,
            name: customerName.trim(), // Customer name is now required
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create appointment");
        }

        // Call the server action to revalidate the data
        await revalidateAppointments();

        // Force router refresh for client-side navigation update
        router.refresh();

        toast({
          title: "Success",
          description: "Appointment created successfully",
          variant: "success",
        });

        setOpen(false);
      } catch (error) {
        console.error("Error creating appointment:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to create appointment",
          variant: "destructive",
        });
      }
    });
  };

  // Prefetch data for dates ahead
  const prefetchNextDates = useCallback(() => {
    if (selectedBarber && availableDates.length > 0) {
      const prefetchDates = availableDates
        .filter((date) => date.has_availability)
        .slice(0, 5)
        .map((date) => new Date(date.date_value));

      prefetchDates.forEach((date) => {
        const serviceIdsParam =
          selectedServices.length > 0
            ? `&serviceIds=${selectedServices.join(",")}`
            : "";

        queryClient.prefetchQuery({
          queryKey: [
            "available-slots",
            selectedBarber,
            date.toISOString(),
            selectedServices,
          ],
          queryFn: async () => {
            const response = await fetch(
              `/api/barber-available-slots?barberId=${selectedBarber}&date=${format(
                date,
                "yyyy-MM-dd"
              )}${serviceIdsParam}`
            );
            if (!response.ok) {
              throw new Error(
                `Failed to fetch available slots: ${response.statusText}`
              );
            }
            return await response.json();
          },
        });
      });
    }
  }, [selectedBarber, availableDates, selectedServices, queryClient]);

  // Prefetch data when selections change
  useEffect(() => {
    if (selectedBarber) {
      prefetchNextDates();
    }
  }, [selectedBarber, selectedServices, prefetchNextDates]);

  const isBookingDisabled =
    !selectedBarber ||
    !selectedDate ||
    !selectedTime ||
    selectedServices.length === 0 ||
    !customerName.trim() ||
    isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className="font-medium"
            onClick={() => setOpen(true)}
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[90vw] min-h-[50vh] max-w-[1400px] flex flex-col">
        <div className="flex flex-col h-full">
          <DialogHeader>
            <DialogTitle>Book an Appointment</DialogTitle>
            <DialogDescription>
              Select a barber, services, date and time to book your appointment
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 overflow-auto py-4">
            {/* Step 1: Barber Selection */}
            <Card className="flex flex-col h-[460px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Select Barber</CardTitle>
              </CardHeader>
              <div className="flex-1 overflow-hidden px-3 pb-3">
                <ScrollArea className="h-full w-full pr-3">
                  <div className="space-y-3">
                    {isLoadingBarbers ? (
                      <div className="flex items-center justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : barberError ? (
                      <div className="text-center py-4">
                        <div className="text-red-500 mb-2">
                          Failed to load barbers
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">
                          {barberError instanceof Error
                            ? barberError.message
                            : "An unknown error occurred"}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => refetchBarbers()}
                          type="button"
                        >
                          Retry
                        </Button>
                      </div>
                    ) : barbers.length === 0 ? (
                      <div className="text-center py-8">
                        No barbers available
                      </div>
                    ) : (
                      barbers.map((barber: Barber) => (
                        <Card
                          key={barber.id}
                          className={cn(
                            "cursor-pointer transition-all hover:bg-muted",
                            selectedBarber === barber.id &&
                              "border-primary bg-primary/10"
                          )}
                          onClick={() => handleBarberSelect(barber.id)}
                        >
                          <CardContent className="p-2 flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                <User className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-medium text-sm">
                                {barber.name}
                              </h3>
                              {barber.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {barber.description}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </Card>

            {/* Step 2: Service Selection */}
            <Card className="flex flex-col h-[460px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Choose Services</CardTitle>
              </CardHeader>
              <div className="flex-1 overflow-hidden px-3 pb-3">
                <ScrollArea className="h-full w-full pr-3">
                  <div className="space-y-3">
                    {!selectedBarber ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Please select a barber first
                      </div>
                    ) : isLoadingServices ? (
                      <div className="flex items-center justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : servicesError ? (
                      <div className="text-center py-4">
                        <div className="text-red-500 mb-2">
                          Failed to load services
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() =>
                            queryClient.invalidateQueries({
                              queryKey: ["barber-services", selectedBarber],
                            })
                          }
                        >
                          Retry
                        </Button>
                      </div>
                    ) : services.length === 0 ? (
                      <div className="text-center py-8">
                        No services available for this barber
                      </div>
                    ) : (
                      services.map((service) => (
                        <Card
                          key={service.id}
                          className={cn(
                            "cursor-pointer transition-all hover:bg-muted",
                            selectedServices.includes(service.id) &&
                              "border-primary bg-primary/10"
                          )}
                          onClick={() => handleServiceToggle(service.id)}
                        >
                          <CardContent className="p-2 flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-md overflow-hidden flex items-center justify-center bg-muted">
                              <Scissors className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium text-sm">
                                  {service.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">
                                    ${service.price}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {service.time} min
                                  </Badge>
                                </div>
                              </div>
                              {service.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {service.description}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </Card>

            {/* Step 3: Date Selection */}
            <Card className="flex flex-col h-[460px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Select Date</CardTitle>
              </CardHeader>
              <div className="flex-1 overflow-hidden px-3 pb-3">
                {!selectedBarber || selectedServices.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Select barber and at least one service first
                  </div>
                ) : isLoadingDates ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : datesError ? (
                  <div className="text-center py-4">
                    <div className="text-red-500 mb-2">
                      Failed to load available dates
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() =>
                        queryClient.invalidateQueries({
                          queryKey: [
                            "available-dates",
                            selectedBarber,
                            selectedServices,
                          ],
                        })
                      }
                    >
                      Retry
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-center h-full">
                    <Calendar
                      mode="single"
                      showOutsideDays={false}
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => {
                        // Disable dates that don't have availability
                        const dateStr = format(date, "yyyy-MM-dd");
                        const availableDate = availableDates.find(
                          (d) => d.date_value === dateStr
                        );

                        // Compare only dates, not datetime - this allows today's date
                        const today = startOfDay(new Date());
                        const targetDate = startOfDay(date);

                        const maxDays = shopSettings?.maxDays ?? 14;
                        const lastAllowed = new Date(today);
                        lastAllowed.setDate(today.getDate() + maxDays);

                        return (
                          isBefore(targetDate, today) ||
                          targetDate > lastAllowed ||
                          !availableDate?.has_availability
                        );
                      }}
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Step 4: Time Selection */}
            <Card className="flex flex-col h-[460px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Select Time</CardTitle>
              </CardHeader>
              <div className="flex-1 overflow-hidden px-3 pb-3">
                <ScrollArea className="h-full w-full pr-3">
                  {!selectedBarber ||
                  selectedServices.length === 0 ||
                  !selectedDate ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Complete previous selections first
                    </div>
                  ) : isLoadingSlots ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : slotsError ? (
                    <div className="text-center py-4">
                      <div className="text-red-500 mb-2">
                        Failed to load time slots
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() =>
                          queryClient.invalidateQueries({
                            queryKey: [
                              "available-slots",
                              selectedBarber,
                              selectedDate?.toISOString(),
                              selectedServices,
                            ],
                          })
                        }
                      >
                        Retry
                      </Button>
                    </div>
                  ) : filteredSlots.length === 0 ? (
                    <div className="text-center py-8">
                      No available times for this date
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-1">
                      {filteredSlots.map((slot, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant={
                            selectedTime === slot.time_slot
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handleTimeSelect(slot.time_slot)}
                          className="w-full justify-start text-left h-10"
                        >
                          {slot.time_slot.substring(0, 5)}
                        </Button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </Card>
          </div>

          <DialogFooter className="pt-4">
            <div className="w-full flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-3">
                <div className="sm:max-w-[200px] w-full">
                  <Input
                    id="customer-name"
                    placeholder="Customer Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="h-9"
                    required
                  />
                </div>
                <div className="text-sm text-muted-foreground hidden sm:block">
                  {selectedBarber &&
                  selectedDate &&
                  selectedTime &&
                  selectedServices.length > 0 &&
                  customerName.trim() ? (
                    <div className="flex gap-2">
                      {selectedDate && (
                        <Badge variant="secondary" className="text-sm">
                          {format(selectedDate, "PPP")}
                        </Badge>
                      )}
                      {selectedTime && (
                        <Badge variant="secondary" className="text-sm">
                          {formatTime(selectedTime)} - {calculateEndTime(selectedTime, serviceDuration)}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-sm">
                        {serviceDuration} min
                      </Badge>
                    </div>
                  ) : (
                    <p>Complete all selections and enter customer name to book</p>
                  )}
                </div>
              </div>
              <Button
                type="button"
                disabled={isBookingDisabled}
                onClick={handleCreateAppointment}
                className="sm:min-w-28 w-full sm:w-auto"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Book Appointment"
                )}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
