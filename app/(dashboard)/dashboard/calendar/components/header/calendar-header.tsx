import Link from "next/link";
import { CalendarPlus, Columns, Grid3X3, List, Plus } from "lucide-react";

import { Button } from "@/components/ui-calendar/button";

import { UserSelect } from "@/calendar/components/header/user-select";
import { TodayButton } from "@/calendar/components/header/today-button";
import { DateNavigator } from "@/calendar/components/header/date-navigator";
import { AddEventDialog } from "@/calendar/components/dialogs/add-event-dialog";

import type { IEvent } from "@/calendar/interfaces";
import type { TCalendarView } from "@/calendar/types";

interface IProps {
  view: TCalendarView;
  events: IEvent[];
}

export function CalendarHeader({ view, events }: IProps) {
  return (
    <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <TodayButton />
        <DateNavigator view={view} events={events} />
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex rounded-md border overflow-hidden">
          <Button
            asChild
            className={`rounded-none border-r ${
              view === "day"
                ? "bg-primary text-white font-medium"
                : "bg-backgroundMuted hover:bg-accent text-foreground"
            }`}
            aria-label="View by day"
          >
            <Link href="/dashboard/calendar/day-view">
              <List className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            className={`rounded-none border-r hidden md:flex ${
              view === "week"
                ? "bg-primary text-white font-medium"
                : "bg-backgroundMuted hover:bg-accent text-foreground"
            }`}
            aria-label="View by week"
          >
            <Link href="/dashboard/calendar/week-view">
              <Columns className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            className={`rounded-none ${
              view === "month"
                ? "bg-primary text-white font-medium"
                : "bg-backgroundMuted hover:bg-accent text-foreground"
            }`}
            aria-label="View by month"
          >
            <Link href="/dashboard/calendar/month-view">
              <Grid3X3 className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <UserSelect />

          <Button size="sm">
            <CalendarPlus />
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}
