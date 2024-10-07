"use client";

import React from "react";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {Database} from "@/database.types";
import {Appointment} from "@/types/appointments";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {Button} from "@/components/ui/button";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {formatDate, formatTime} from "@/utils/dateUtils";
import "./calendar-dark.css";

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

type Props = {
  initialAppointments: Appointment[];
};

export default function CalendarClient({initialAppointments}: Props) {
  const [date, setDate] = React.useState<Date>(new Date());
  const [view, setView] = React.useState<"day" | "week">("day");
  const [appointments, setAppointments] = React.useState<Appointment[]>(initialAppointments);

  const supabase = createClientComponentClient<Database>();

  const fetchAppointments = React.useCallback(async () => {
    const startDate = moment(date).startOf(view).format("YYYY-MM-DD");
    const endDate = moment(date).endOf(view).format("YYYY-MM-DD");

    try {
      const {data, error} = await supabase
        .from("appointments")
        .select(
          `
          *,
          client:profiles!appointments_user_id_fkey(full_name, email)
        `
        )
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", {ascending: true})
        .order("time", {ascending: true});

      if (error) throw error;

      setAppointments(data as Appointment[]);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }, [view, date, supabase]);

  React.useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: "day" | "week") => {
    setView(newView);
  };

  const events = appointments.map((apt) => ({
    id: apt.id,
    title: apt.client.full_name,
    start: new Date(`${apt.date}T${apt.time}`),
    end: new Date(
      `${apt.date}T${
        apt.end_time ||
        moment(`${apt.date}T${apt.time}`)
          .add(apt.duration || 60, "minutes")
          .format("HH:mm:ss")
      }`
    ),
    resource: apt,
  }));

  const CustomToolbar = ({label, onNavigate, onView}: any) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => onNavigate("PREV")}>
          &lt;
        </Button>
        <Button variant="outline" size="icon" onClick={() => onNavigate("NEXT")}>
          &gt;
        </Button>
        <Button className="w-20" variant="outline" size="icon" onClick={() => onNavigate("TODAY")}>
          Today
        </Button>
      </div>
      <h2 className="text-2xl font-bold">{label}</h2>
      <div className="flex w-24">
        <Select
          value={view}
          onValueChange={(newView: "day" | "week") => {
            onView(newView);
            handleViewChange(newView);
          }}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      <aside className="border-r p-4 w-64 flex flex-col">
        <div className="mb-4 flex-1 overflow-auto">
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
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={handleViewChange as any}
          date={date}
          onNavigate={handleNavigate}
          style={{height: "calc(100vh - 2rem)"}}
          components={{
            toolbar: CustomToolbar,
          }}
          min={new Date(0, 0, 0, 9, 0, 0)} // Set start time to 09:00
          max={new Date(0, 0, 0, 20, 0, 0)} // Set end time to 20:00
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: "#27272A",
              borderLeft: "5px solid #EA580C",
              borderTop: "none",
              borderBottom: "none",
              borderRight: "none",
              borderRadius: "0px",
              fontFamily: "Inter, sans-serif",
            },
          })}
        />
      </main>
    </div>
  );
}
