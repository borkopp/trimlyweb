import { redirect } from "next/navigation";

export default function CalendarPage() {
  // In Next.js app router, route groups (in parentheses) don't affect the URL path
  // So this redirects to the month-view page component inside the (calendar) group
  redirect("/dashboard/month-view");
} 