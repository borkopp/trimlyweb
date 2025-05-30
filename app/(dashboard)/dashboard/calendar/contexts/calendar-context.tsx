"use client";

import { createContext, useContext, useState } from "react";
import { useRealtimeAppointments } from "@/calendar/hooks/use-realtime-appointments";

import type { IEvent, IUser } from "@/calendar/interfaces";

interface ICalendarContext {
  selectedDate: Date;
  setSelectedDate: (date: Date | undefined) => void;
  selectedUserId: IUser["id"] | "all";
  setSelectedUserId: (userId: IUser["id"] | "all") => void;
  badgeVariant: "dot" | "colored";
  setBadgeVariant: (variant: "dot" | "colored") => void;
  users: IUser[];
  events: IEvent[];
  loading: boolean;
  error: string | null;
  refetchEvents: () => Promise<void>;
}

const CalendarContext = createContext({} as ICalendarContext);

export function CalendarProvider({
  children,
  users,
}: {
  children: React.ReactNode;
  users: IUser[];
}) {
  const [badgeVariant, setBadgeVariant] = useState<"dot" | "colored">("dot");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedUserId, setSelectedUserId] = useState<IUser["id"] | "all">(
    "all"
  );

  // Use the realtime appointments hook
  const {
    events,
    loading,
    error,
    refetch: refetchEvents,
  } = useRealtimeAppointments(selectedDate);

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
  };

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate: handleSelectDate,
        selectedUserId,
        setSelectedUserId,
        badgeVariant,
        setBadgeVariant,
        users,
        events,
        loading,
        error,
        refetchEvents,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): ICalendarContext {
  const context = useContext(CalendarContext);
  if (!context)
    throw new Error("useCalendar must be used within a CalendarProvider.");
  return context;
}
