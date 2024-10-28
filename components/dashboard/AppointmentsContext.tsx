"use client";

import React, {createContext, useContext, useState} from "react";
import {Appointment} from "@/types/appointments";

interface AppointmentsContextType {
  selectedAppointmentId: number | null;
  setSelectedAppointmentId: (id: number | null) => void;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  removeAppointment: (id: number) => void;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

export function AppointmentsProvider({children}: {children: React.ReactNode}) {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const removeAppointment = (id: number) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    if (selectedAppointmentId === id) {
      setSelectedAppointmentId(null);
    }
  };

  return (
    <AppointmentsContext.Provider
      value={{
        selectedAppointmentId,
        setSelectedAppointmentId,
        appointments,
        setAppointments,
        removeAppointment,
      }}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error("useAppointments must be used within an AppointmentsProvider");
  }
  return context;
}
