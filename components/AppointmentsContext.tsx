"use client";

import React, {createContext, useContext, useState, ReactNode} from "react";
import {Database} from "@/database.types";

type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type AppointmentWithClient = Appointment & {client: Profile};

type AppointmentsContextType = {
  selectedAppointment: AppointmentWithClient | null;
  setSelectedAppointment: (appointment: AppointmentWithClient | null) => void;
};

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

export function AppointmentsProvider({children}: {children: ReactNode}) {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithClient | null>(null);

  return <AppointmentsContext.Provider value={{selectedAppointment, setSelectedAppointment}}>{children}</AppointmentsContext.Provider>;
}

export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error("useAppointments must be used within an AppointmentsProvider");
  }
  return context;
}
