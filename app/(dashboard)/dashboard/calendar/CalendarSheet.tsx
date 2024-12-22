"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AppointmentDetails } from "@/components/dashboard/AppointmentDetails";

type Props = {
  selectedAppointmentId: string | null;
  onClose: () => void;
};

export function CalendarSheet({ selectedAppointmentId, onClose }: Props) {
  const isOpen = Boolean(selectedAppointmentId);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        <AppointmentDetails
          appointmentId={selectedAppointmentId}
          variant="dialog"
          onClose={onClose}
        />
      </SheetContent>
    </Sheet>
  );
}
