import { CalendarProvider } from "@/calendar/contexts/calendar-context";

import { ChangeBadgeVariantInput } from "@/calendar/components/change-badge-variant-input";

import { getEvents, getUsers } from "@/calendar/requests";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const [events, users] = await Promise.all([getEvents(), getUsers()]);

  return (
    <CalendarProvider users={users} events={events}>
      <div className="h-[calc(100vh-6rem)] flex flex-col px-8 pt-4">
        {children}
        {/* <ChangeBadgeVariantInput /> */}
      </div>
    </CalendarProvider>
  );
}
