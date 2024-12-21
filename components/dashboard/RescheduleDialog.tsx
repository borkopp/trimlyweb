'use client';

import { useState, useTransition } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getBarberAvailability, rescheduleAppointment } from '@/app/actions/appointment-actions';
import { toast } from '@/components/ui/use-toast';
import { Appointment } from '@/types/appointments';

interface RescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment;
  onReschedule: () => void;
}

export function RescheduleDialog({
  open,
  onOpenChange,
  appointment,
  onReschedule,
}: RescheduleDialogProps) {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  // Get available slots for the selected date
  const { data: availableSlots, isLoading } = useQuery({
    queryKey: ['barber-availability', appointment.barber_id, date?.toISOString()],
    queryFn: () =>
      getBarberAvailability(
        appointment.barber_id,
        date ? format(date, 'yyyy-MM-dd') : '',
      ),
    enabled: !!date,
  });

  const handleReschedule = () => {
    if (!date || !time) return;

    startTransition(async () => {
      const result = await rescheduleAppointment(
        appointment.id.toString(), 
        format(date, 'yyyy-MM-dd'),
        time,
      );

      if (result.success) {
        toast({
          title: 'Appointment Rescheduled',
          description: 'The appointment has been successfully rescheduled.',
        });
        onReschedule();
        onOpenChange(false);
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogDescription>
            Select a new date and time for this appointment.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-8 py-4">
          <div>
            <div className="space-y-2 mb-4">
              <Label>Date</Label>
            </div>
            <div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className="rounded-md border"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="space-y-2 mb-4">
              <Label className="text-lg font-semibold">Select Time</Label>
            </div>
            <div>
              <ScrollArea className="h-[300px] border rounded-md bg-background">
                <div className="">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : !date ? (
                    <div className="text-muted-foreground p-4">
                      Select a date to view available times
                    </div>
                  ) : !availableSlots?.length ? (
                    <div className="text-muted-foreground p-4">
                      No available slots for this date
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 p-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.slot_time}
                          variant={time === slot.slot_time ? 'secondary' : 'outline'}
                          className={cn(
                            'justify-center h-9 px-3',
                            time === slot.slot_time &&
                              'bg-muted hover:bg-muted',
                          )}
                          onClick={() => setTime(slot.slot_time)}
                        >
                          <Clock className="mr-1.5 h-3.5 w-3.5" />
                          {slot.slot_time.slice(0, 5)}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleReschedule}
            disabled={!date || !time || isPending}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white self-center"/>
                Rescheduling...
              </div>
            ) : (
              'Reschedule'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
