"use client";

import {useState} from "react";
import {format, isBefore, isSameDay, set} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {createClient} from "@/utils/supabase/client";
import {Database} from "@/database.types";
import {toast} from "./ui/use-toast";

type Barber = Database["public"]["Tables"]["barbers"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];

type Props = {
  initialBarbers: Barber[];
  initialServices: Service[];
  user_id: string;
};

export function NewAppointmentDialog({initialBarbers, initialServices, user_id}: Props) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [barber, setBarber] = useState("");
  const [service, setService] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const supabase = createClient();

    if (!date || !barber || !service || !time) {
      return;
    }

    const {data, error} = await supabase.from("appointments").insert({
      barber_id: parseInt(barber),
      service_ids: [parseInt(service)],
      date: date.toISOString().split("T")[0],
      time: time,
      user_id: user_id,
    });

    if (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating the appointment.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Appointment created",
        description: "The appointment has been created successfully.",
      });
      setOpen(false);
      setDate(undefined);
      setBarber("");
      setService("");
      setTime("");
    }
    setLoading(false);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      for (let minute of [0, 30]) {
        slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
      }
    }
    return slots;
  };

  const isTimeSlotAvailable = (timeSlot: string) => {
    if (!date) return true;
    const [hours, minutes] = timeSlot.split(":").map(Number);
    const slotDate = set(date, {hours, minutes});
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
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Appointment</DialogTitle>
            <DialogDescription>Fill in the details to schedule a new appointment.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="barber" className="text-right">
                Barber
              </Label>
              <Select onValueChange={setBarber} value={barber}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a barber" />
                </SelectTrigger>
                <SelectContent>
                  {initialBarbers.map((barber) => (
                    <SelectItem key={barber.id} value={barber.id.toString()}>
                      {barber.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">
                Service
              </Label>
              <Select onValueChange={setService} value={service}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {initialServices.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={`col-span-3 justify-start text-left font-normal ${!date && "text-muted-foreground"}`}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} fromDate={new Date()} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Select onValueChange={setTime} value={time}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeSlots().map(
                    (t) =>
                      isTimeSlotAvailable(t) && (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button disabled={loading || !date || !barber || !service || !time} type="submit">
              {loading ? "Creating..." : "Create Appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
