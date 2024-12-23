"use client";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {createClient} from "@/utils/supabase/client";
import {useToast} from "@/components/ui/use-toast";
import {CalendarSheet} from "./CalendarSheet";
import {AppointmentsProvider} from "@/components/dashboard/AppointmentsContext";
import {Card} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";
import {EventContentArg} from "@fullcalendar/core";
import {Database} from "@/database.types";
import {useBarbershop} from "@/contexts/BarbershopContext";

type AppointmentRow = Database["public"]["Tables"]["appointments"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type BarberRow = Database["public"]["Tables"]["barbers"]["Row"];

interface Appointment extends AppointmentRow {
  client: ProfileRow;
  barber: BarberRow;
  services: ServiceRow[];
}

type Props = {
  initialAppointments: Appointment[];
};

async function getImageUrl(path: string) {
  if (!path) return null;
  const supabase = createClient();
  const {data} = await supabase.storage.from("barber-images").getPublicUrl(path);
  return data?.publicUrl || null;
}

export default function CalendarClient({initialAppointments}: Props) {
  const {toast} = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrls, setAvatarUrls] = useState<Record<string, string>>({});
  const supabase = createClient();
  const {barbershop} = useBarbershop();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    async function loadAvatarUrls() {
      const urls: Record<string, string> = {};
      for (const apt of appointments) {
        if (apt.client?.avatar_url) {
          const url = await getImageUrl(apt.client.avatar_url);
          if (url) {
            urls[`client_${apt.client.id}`] = url;
          }
        }
        if (apt.barber?.image) {
          const url = await getImageUrl(apt.barber.image);
          if (url) {
            urls[`barber_${apt.barber.id}`] = url;
          }
        }
      }
      setAvatarUrls(urls);
    }

    loadAvatarUrls();
  }, [appointments]);

  const fetchAppointments = useCallback(
    async (start: Date, end: Date) => {
      if (initialLoad) {
        setInitialLoad(false);
        return;
      }

      setIsLoading(true);
      const startDate = start.toISOString().split("T")[0];
      const endDate = end.toISOString().split("T")[0];

      console.log("Fetching appointments for date range:", {startDate, endDate});

      try {
        const {data, error, status, statusText} = await supabase
          .from("appointments")
          .select(
            `
            *,
            client:profiles!appointments_user_id_fkey(id, full_name, email, avatar_url),
            barber:barbers(id, name, email, image),
            services:service_appointments(
              services(*)
            )
          `
          )
          .eq("barbershop_id", barbershop?.id)
          .gte("date", startDate)
          .lte("date", endDate)
          .order("date", {ascending: true})
          .order("time", {ascending: true});

        if (error) {
          console.error("Supabase error details:", {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });
          throw error;
        }

        // Transform the data to flatten the services array
        const transformedData = (data || []).map((apt) => {
          console.log("Processing appointment:", {
            id: apt.id,
            date: apt.date,
            services: apt.services?.length || 0,
          });
          return {
            ...apt,
            services: apt.services?.map((s: {services: ServiceRow}) => s.services).flat() || [],
          };
        });

        console.log("Transformed data:", {
          count: transformedData.length,
          firstRecord: transformedData[0],
        });

        setAppointments(transformedData);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        if (error instanceof Error) {
          console.error("Error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
          });
        }
        toast({
          title: "Error",
          description: "Failed to load appointments. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [supabase, toast, barbershop]
  );

  const events = useMemo(() => {
    console.log("Creating events from appointments:", appointments);
    const calendarEvents = appointments.map((apt) => {
      // Create a start date object
      const startDate = new Date(`${apt.date}T${apt.time}`);

      // Create an end date object
      let endDate;
      if (apt.end_time) {
        endDate = new Date(`${apt.date}T${apt.end_time}`);
      } else if (apt.duration) {
        endDate = new Date(startDate.getTime() + apt.duration * 60000); // duration in minutes to milliseconds
      } else {
        endDate = new Date(startDate.getTime() + 60 * 60000); // default 1 hour
      }

      const eventData = {
        id: apt.id.toString(),
        title: apt.client?.full_name || "No Name",
        start: startDate,
        end: endDate,
        extendedProps: {
          appointment: apt,
        },
        display: "block",
        className: cn("cursor-pointer transition-colors", apt.is_cancelled && "opacity-50"),
      };
      console.log("Created event:", eventData);
      return eventData;
    });
    console.log("Final events array:", calendarEvents);
    return calendarEvents;
  }, [appointments]);

  const CustomEventContent = ({event}: EventContentArg) => {
    const apt = event.extendedProps.appointment as Appointment;
    return (
      <div className="flex flex-col h-full bg-primary/10 border-l-2 border-primary rounded-sm">
        <div className="flex items-start gap-2 p-1 min-h-[24px]">
          <div className="w-5 h-5 flex-shrink-0">
            <Avatar className="h-full w-full">
              <AvatarImage src={apt.client?.id ? avatarUrls[`client_${apt.client.id}`] : ""} />
              <AvatarFallback>{apt.client?.full_name?.[0] || "?"}</AvatarFallback>
            </Avatar>
          </div>
          <span className="font-medium text-sm truncate">{apt.client?.full_name}</span>
        </div>
        <div className="flex flex-wrap gap-1 p-1 overflow-y-auto">
          {apt.services?.map((service) => (
            <Badge key={service.id} variant="outline" className="text-xs whitespace-nowrap">
              {service.name}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AppointmentsProvider>
      <div className="flex h-[calc(100vh-4rem)]">
        <main className={cn("flex-1 p-6", isLoading && "opacity-50")}>
          <div className="fc-custom dark h-full">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "timeGridDay,timeGridWeek",
              }}
              events={events}
              eventContent={CustomEventContent}
              slotMinTime="08:00:00"
              slotMaxTime="20:00:00"
              allDaySlot={false}
              height="100%"
              eventClick={(info) => {
                setSelectedAppointmentId(info.event.id);
              }}
              datesSet={({start, end}) => {
                fetchAppointments(start, end);
              }}
              slotDuration="00:30:00"
              slotLabelInterval="01:00"
              expandRows={true}
              stickyHeaderDates={true}
              dayMaxEvents={true}
              nowIndicator={true}
              editable={false}
              selectable={false}
              selectMirror={true}
              dayHeaderFormat={{weekday: "short", day: "numeric", omitCommas: true}}
              eventDisplay="block"
              eventOverlap={false}
              forceEventDuration={true}
            />
          </div>
        </main>
        <aside className="w-80 border-l p-4 hidden lg:block">
          <h3 className="font-semibold mb-4">Today&apos;s Appointments</h3>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            {appointments
              .filter((apt) => apt.date === new Date().toISOString().split("T")[0])
              .map((apt) => (
                <Card
                  key={apt.id}
                  className="mb-2 p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedAppointmentId(apt.id.toString())}>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={apt.client?.id ? avatarUrls[`client_${apt.client.id}`] : ""} />
                      <AvatarFallback>{apt.client?.full_name?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{apt.client?.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {apt.time.slice(0, 5)} - {apt.end_time?.slice(0, 5)}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {apt.services?.map((service) => (
                          <Badge key={service.id} variant="outline" className="text-xs">
                            {service.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </ScrollArea>
        </aside>
        <CalendarSheet selectedAppointmentId={selectedAppointmentId} onClose={() => setSelectedAppointmentId(null)} />
      </div>
      <style jsx global>{`
        /* Main calendar container variables */
        .fc-custom.fc {
          --fc-border-color: hsl(var(--border) / 0.6); /* Main border color for the calendar */
          --fc-page-bg-color: hsl(var(--background)); /* Background color of the calendar */
          --fc-neutral-bg-color: hsl(var(--secondary) / 0.4); /* Secondary background color */
          --fc-list-event-hover-bg-color: hsl(var(--accent)); /* Hover color for list view events */
          --fc-today-bg-color: transparent; /* Remove background color for today's column */
        }

        /* Time slots in the calendar */
        .fc-custom .fc-timegrid-slot {
          height: 1.5rem !important; /* Height of each time slot */
          border-color: hsl(var(--border) / 0.3) !important; /* Color of time slot borders */
        }

        /* Time labels on the left side */
        .fc-custom .fc-timegrid-slot-label {
          font-size: 0.875rem; /* Size of time labels */
          color: hsl(var(--muted-foreground)); /* Color of time labels */
          border-color: hsl(var(--border) / 0.6) !important; /* Border color for time labels */
        }

        /* Header cells (days of the week) */
        .fc-custom .fc-col-header-cell {
          padding: 0.5rem; /* Padding around header cells */
          font-weight: 500; /* Font weight for header text */
          background-color: hsl(var(--background)) !important; /* Background color of header cells */
          border-color: hsl(var(--background)) !important; /* Border color for header cells */
        }

        /* Today's header cell specific styling */
        .fc-custom .fc-col-header-cell.fc-day-today {
          background-color: hsl(var(--background)) !important;
          color: hsl(var(--primary)) !important;
        }

        /* Fix header border colors */
        .fc-custom .fc-col-header {
          border-color: hsl(var(--background)) !important;
        }

        .fc-custom .fc-col-header-cell {
          border-right-color: hsl(var(--background)) !important;
        }

        .fc-custom .fc-scrollgrid-section-header {
          background-color: hsl(var(--background)) !important;
        }

        /* Left axis column styling */
        .fc-custom .fc-timegrid-axis {
          padding: 0.5rem; /* Padding for axis column */
          background-color: hsl(var(--background)); /* Background color of axis */
          border-color: hsl(var(--background)) !important; /* Border color for axis */
        }

        /* Right axis column styling */
        .fc-custom .fc-timegrid-col:last-child,
        .fc-custom .fc-timegrid-col:last-child .fc-timegrid-col-frame {
          border-right-color: hsl(var(--background)) !important;
        }

        /* Current time indicator container */
        .fc-custom .fc-media-screen .fc-timegrid-now-indicator-container {
          position: unset;
        }

        /* Current time indicator line */
        .fc-custom .fc-timegrid-now-indicator-line {
          border-bottom-width: 1px;
          border-top-width: 1px;
          border-color: hsl(var(--primary)) !important;
          background-color: hsl(var(--primary)) !important;
        }

        /* Day view arrow */
        .fc-custom .fc-timeGridDay-view .fc-timegrid-now-indicator-arrow {
          position: absolute;
          border: none;
          left: unset;
          right: -6px;
          display: none;
          width: 12px;
          height: 12px;
          background-color: hsl(var(--primary)) !important;
          border-radius: 50%;
          transform: translateY(-50%) !important;
          margin-top: 0 !important;
        }

        /* Week view arrow */
        .fc-custom .fc-timeGridWeek-view .fc-timegrid-now-indicator-arrow {
          display: none;
        }

        /* Week view line circle */
        .fc-custom .fc-timeGridWeek-view .fc-timegrid-now-indicator-line::before {
          content: "";
          position: absolute;
          top: -6px;
          left: -6px;
          width: 12px;
          height: 12px;
          background-color: hsl(var(--primary)) !important;
          border-radius: 50%;
        }

        /* Calendar buttons (today, prev, next, etc.) */
        .fc-custom .fc-button {
          background-color: hsl(var(--background)); /* Button background color */
          border: 1px solid hsl(var(--border) / 0.6); /* Button border */
          color: hsl(var(--foreground)); /* Button text color */
          font-weight: 500; /* Button text weight */
          text-transform: capitalize; /* Capitalize first letter */
          padding: 0.25rem 0.75rem; /* Reduced padding */
          border-radius: 0.375rem; /* Button corner radius */
          font-size: 0.875rem; /* Smaller font size */
          height: 2rem; /* Fixed height */
          min-width: 2rem; /* Minimum width */
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
        }

        /* Button hover state */
        .fc-custom .fc-button:hover {
          background-color: hsl(var(--secondary)); /* Button hover background */
        }

        /* Active button state */
        .fc-custom .fc-button-active {
          background-color: hsl(var(--secondary)) !important; /* Active button background */
          border-color: hsl(var(--border) / 0.6) !important; /* Active button border */
        }

        /* Active button states for primary buttons */
        .fc-custom .fc-button-primary:not(:disabled):active,
        .fc-custom .fc-button-primary:not(:disabled).fc-button-active {
          background-color: hsl(var(--secondary)); /* Active primary button background */
          border-color: hsl(var(--border) / 0.6); /* Active primary button border */
        }

        /* Calendar title styling */
        .fc-custom .fc-toolbar-title {
          font-size: 1.125rem; /* Smaller title size */
          font-weight: 600; /* Title text weight */
          padding: 0 0.5rem; /* Add some padding */
        }

        /* Toolbar container */
        .fc-custom .fc-toolbar {
          gap: 0.5rem;
          padding: 0.5rem;
          align-items: center;
        }

        /* Button group spacing */
        .fc-custom .fc-button-group {
          gap: 0.25rem; /* Reduced gap between grouped buttons */
        }

        /* Prev/Next button icons */
        .fc-custom .fc-prev-button,
        .fc-custom .fc-next-button {
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }

        /* Today button specific styling */
        .fc-custom .fc-today-button {
          background-color: hsl(var(--background)) !important;
          border: 1px solid hsl(var(--border) / 0.6) !important;
          color: hsl(var(--foreground)) !important;
          padding: 0.25rem 0.75rem !important;
          height: 2rem !important;
        }

        .fc-custom .fc-today-button:disabled {
          background-color: hsl(var(--primary)) !important;
          border-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          opacity: 1 !important;
        }

        /* Remove all event-related borders and backgrounds */
        .fc-custom .fc-event,
        .fc-custom .fc-event-main,
        .fc-custom .fc-event-main-frame,
        .fc-custom .fc-timegrid-event,
        .fc-custom .fc-timegrid-more-link,
        .fc-custom .fc-daygrid-event,
        .fc-custom .fc-daygrid-dot-event,
        .fc-custom .fc-timegrid-event-harness,
        .fc-custom .fc-timegrid-event-harness-inset,
        .fc-custom .fc-timegrid-more-link,
        .fc-custom .fc-daygrid-more-link,
        .fc-custom .fc-event-title,
        .fc-custom .fc-event-time,
        .fc-custom .fc-event-resizer {
          border: 0 !important;
          background: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        /* Event container */
        .fc-custom .fc-event {
          overflow: hidden !important;
          margin: 0 1px !important;
        }

        /* Event content wrapper */
        .fc-custom .fc-event > div {
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Custom event content */
        .fc-custom .fc-event .flex {
          box-sizing: border-box !important;
          height: 100% !important;
          margin: 0 !important;
        }

        /* Ensure the background of the event harness is transparent */
        .fc-custom .fc-timegrid-event-harness {
          background: transparent !important;
        }

        /* Remove any box shadows */
        .fc-custom .fc-event,
        .fc-custom .fc-event * {
          box-shadow: none !important;
        }

        /* Force the event to take full width/height */
        .fc-custom .fc-event,
        .fc-custom .fc-event-main,
        .fc-custom .fc-event-main-frame {
          width: 100% !important;
          height: 100% !important;
        }

        /* Main calendar grid container */
        .fc-custom .fc-scrollgrid {
          border-radius: 0.5rem; /* Rounded corners for calendar */
          border: 1px solid hsl(var(--border) / 0.6); /* Main calendar border */
        }

        /* Remove right border from last column */
        .fc-custom .fc-scrollgrid td:last-of-type {
          border-right: 0; /* Remove rightmost border */
        }

        /* Time grid divider lines */
        .fc-custom .fc-timegrid-divider {
          border-color: hsl(var(--border) / 0.6) !important; /* Color for divider lines */
        }

        /* Time grid columns container */
        .fc-custom .fc-timegrid-cols {
          border-color: hsl(var(--border) / 0.6) !important; /* Border color for columns container */
        }

        /* Individual time grid columns */
        .fc-custom .fc-timegrid-col {
          border-color: hsl(var(--border) / 0.4) !important; /* Border color for columns */
        }

        /* Table cell borders */
        .fc-custom td {
          border-color: hsl(var(--border) / 0.4) !important; /* Border color for all cells */
        }

        /* Today button specific styling */
        .fc-custom .fc-today-button {
          background-color: hsl(var(--background)) !important;
          border: 1px solid hsl(var(--border) / 0.6) !important;
          color: hsl(var(--foreground)) !important;
        }

        .fc-custom .fc-today-button:disabled {
          background-color: hsl(var(--primary)) !important;
          border-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          opacity: 1 !important;
        }

        /* Remove today's column highlight */
        .fc-custom .fc-day-today {
          background: none !important;
        }
      `}</style>
    </AppointmentsProvider>
  );
}
