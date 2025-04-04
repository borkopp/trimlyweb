import { redirect } from "next/navigation";

export default function CalendarPage() {
  // Redirect from /dashboard/calendar to the month view
  redirect("/dashboard/month-view");
} 