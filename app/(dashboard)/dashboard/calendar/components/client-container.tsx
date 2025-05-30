"use client";

import { useMemo } from "react";
import { isSameDay, parseISO } from "date-fns";

import { useCalendar } from "@/calendar/contexts/calendar-context";

import { CalendarHeader } from "@/calendar/components/header/calendar-header";
import { CalendarMonthView } from "@/calendar/components/month-view/calendar-month-view";
import { CalendarDayView } from "@/calendar/components/week-and-day-view/calendar-day-view";
import { CalendarWeekView } from "@/calendar/components/week-and-day-view/calendar-week-view";

import type { TCalendarView } from "@/calendar/types";

interface IProps {
  view: TCalendarView;
}

export function ClientContainer({ view }: IProps) {
  const {
    selectedDate,
    selectedUserId,
    events,
    loading,
    error,
    refetchEvents,
  } = useCalendar();

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const itemStartDate = new Date(event.startDate);
      const itemEndDate = new Date(event.endDate);

      const monthStart = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      );
      const monthEnd = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      );

      const isInSelectedMonth =
        itemStartDate <= monthEnd && itemEndDate >= monthStart;
      const isUserMatch =
        selectedUserId === "all" || event.user.id === selectedUserId;
      return isInSelectedMonth && isUserMatch;
    });
  }, [selectedDate, selectedUserId, events]);

  const singleDayEvents = filteredEvents.filter((event) => {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    return isSameDay(startDate, endDate);
  });

  const multiDayEvents = filteredEvents.filter((event) => {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    return !isSameDay(startDate, endDate);
  });

  if (loading) {
    return (
      <div className="flex flex-col rounded-xl border h-[calc(100vh-7rem)]">
        <div className="flex items-center justify-center flex-1">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">
              Loading appointments...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col rounded-xl border h-[calc(100vh-7rem)]">
        <div className="flex items-center justify-center flex-1">
          <div className="flex flex-col items-center gap-4 max-w-md text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                Failed to load appointments
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
            <button
              onClick={() => refetchEvents()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border h-[calc(100vh-7rem)]">
      <CalendarHeader view={view} events={filteredEvents} />
      <div className="flex-1 overflow-hidden">
        {view === "month" && (
          <CalendarMonthView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
        {view === "week" && (
          <CalendarWeekView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
        {view === "day" && (
          <CalendarDayView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
      </div>
    </div>
  );
}
