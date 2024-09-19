"use client";
import * as React from "react";
import {addDays, format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay} from "date-fns";
import {Calendar as CalendarIcon, ChevronLeft, ChevronRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Database} from "@/database.types";
import dayjs from "dayjs";
import {createClient} from "@supabase/supabase-js";
import {formatDate, formatTime} from "@/utils/dateUtils";

type Appointment = Database["public"]["Tables"]["appointments"]["Row"] & {
  client: Database["public"]["Tables"]["profiles"]["Row"];
  date: string;
  time: string;
  duration?: number;
};

export default function FullPageCalendar() {
  const [date, setDate] = React.useState<Date>(new Date());
  const [view, setView] = React.useState<"day" | "week">("week");
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);

  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  const daysInWeek = eachDayOfInterval({start: weekStart, end: weekEnd});

  const hours = Array.from({length: 12}, (_, i) => i + 8); // 8 AM to 7 PM
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  React.useEffect(() => {
    const fetchAppointments = async () => {
      if (view === "week") {
        const {data, error} = await supabase
          .from("appointments")
          .select(
            `
            *,
            client:profiles!appointments_user_id_fkey(full_name, email)
          `
          )
          .gte("date", dayjs(weekStart).format("YYYY-MM-DD"))
          .lte("date", dayjs(weekEnd).format("YYYY-MM-DD"))
          .order("date", {ascending: true})
          .order("time", {ascending: true});

        if (error) {
          console.error("Error fetching week appointments:", error);
          return;
        }

        setAppointments(data as Appointment[]);
      } else {
        const {data, error} = await supabase
          .from("appointments")
          .select(
            `
            *,
            client:profiles!appointments_user_id_fkey(full_name, email)
          `
          )
          .eq("date", dayjs(date).format("YYYY-MM-DD"))
          .order("time", {ascending: true});

        if (error) {
          console.error("Error fetching day appointments:", error);
          return;
        }

        setAppointments(data as Appointment[]);
      }
    };

    fetchAppointments();
  }, [view, date, supabase, weekStart, weekEnd]);

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate.getFullYear() === day.getFullYear() && aptDate.getMonth() === day.getMonth() && aptDate.getDate() === day.getDate();
    });
  };

  const formatAppointmentTime = (time: string) => {
    return dayjs(time, "HH:mm:ss").format("h:mm A");
  };

  return (
    <div className="flex h-screen">
      <aside className="border-r p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Barbershop Calendar</h2>
        <div className="mb-4">
          <Calendar mode="single" selected={date} onSelect={(newDate) => newDate && setDate(newDate)} className="rounded-md border" />
        </div>
        <Select value={view} onValueChange={(value: "day" | "week") => setView(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
          </SelectContent>
        </Select>
        <div className="mt-4 flex-1 overflow-auto">
          <h3 className="font-semibold mb-2">Upcoming Appointments</h3>
          {appointments.map((apt) => (
            <Card key={apt.id} className="mb-2">
              <CardHeader className="p-2">
                <CardTitle className="text-sm">{apt.client.full_name}</CardTitle>
                <CardDescription className="text-xs">
                  {formatDate(apt.date)} - {formatTime(apt.time)}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </aside>
      <main className="flex-1 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {format(weekStart, "MMMM d")} - {format(weekEnd, "MMMM d, yyyy")}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, -7))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, 7))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-2">
          <div className="col-span-1"></div>
          {daysInWeek.map((day) => (
            <div key={day.toString()} className="text-center font-semibold">
              {format(day, "EEE")}
              <br />
              {format(day, "d")}
            </div>
          ))}
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="text-right pr-2 text-sm text-muted-foreground">{format(new Date().setHours(hour, 0), "h a")}</div>
              {daysInWeek.map((day) => (
                <div key={`${day}-${hour}`} className="border relative h-16">
                  {getAppointmentsForDay(day).map((apt) => {
                    const aptDateTime = new Date(`${apt.date}T${apt.time}`);
                    const aptHour = aptDateTime.getHours();
                    const aptMinute = aptDateTime.getMinutes();
                    const duration = apt.duration || 60;

                    if (aptHour === hour) {
                      const topPosition = (aptMinute / 60) * 100;
                      const height = (duration / 60) * 100;

                      return (
                        <div
                          key={apt.id}
                          className="bg-[#EA580B] rounded p-1 text-xs absolute left-0 right-0 overflow-hidden z-10"
                          style={{
                            top: `${topPosition}%`,
                            height: `${height}%`,
                            minHeight: "16px", // Ensure very short appointments are still visible
                          }}>
                          <div className="font-semibold truncate">{apt.client.full_name}</div>
                          <div className="truncate">
                            {formatTime(apt.time)} - {formatTime(apt.end_time || "")}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </main>
    </div>
  );
}
