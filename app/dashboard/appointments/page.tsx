"use client";

import {useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {CalendarIcon, MenuIcon} from "lucide-react";

export default function Component() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const appointments = [
    {
      title: "John Doe - Haircut",
      start: "2023-06-15T10:00:00",
      end: "2023-06-15T11:00:00",
      extendedProps: {
        name: "John Doe",
        email: "john@example.com",
        services: "Haircut",
        barber: "Mike Johnson",
      },
    },
    {
      title: "Jane Smith - Color & Style",
      start: "2023-06-15T14:00:00",
      end: "2023-06-15T16:00:00",
      extendedProps: {
        name: "Jane Smith",
        email: "jane@example.com",
        services: "Color & Style",
        barber: "Sarah Williams",
      },
    },
    {
      title: "Bob Brown - Beard Trim",
      start: "2023-06-16T11:30:00",
      end: "2023-06-16T12:00:00",
      extendedProps: {
        name: "Bob Brown",
        email: "bob@example.com",
        services: "Beard Trim",
        barber: "Mike Johnson",
      },
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white w-64 min-h-screen overflow-y-auto transition-all duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:w-64 absolute z-10`}>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Barbershop Dashboard</h1>
          <nav>
            <Button variant="ghost" className="w-full justify-start mb-2">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Calendar
            </Button>
            {/* Add more navigation items here */}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <MenuIcon className="h-6 w-6" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={appointments}
                height="100%"
                eventContent={(eventInfo) => (
                  <div className="p-1 text-xs">
                    <div className="font-semibold">{eventInfo.event.extendedProps.name}</div>
                    <div>{eventInfo.event.extendedProps.services}</div>
                    <div>Barber: {eventInfo.event.extendedProps.barber}</div>
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
