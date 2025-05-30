import { CalendarProvider } from "@/calendar/contexts/calendar-context";

import { ChangeBadgeVariantInput } from "@/calendar/components/change-badge-variant-input";

import { getUsers } from "@/calendar/requests";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  return (
    <CalendarProvider users={users}>
      <div className="h-[calc(100vh-6rem)] flex flex-col px-8 pt-4">
        {children}
        {/* <ChangeBadgeVariantInput /> */}
      </div>
    </CalendarProvider>
  );
}
