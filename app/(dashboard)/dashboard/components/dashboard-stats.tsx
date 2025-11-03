import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {AppointmentDialog} from "@/components/appointment-dialog";
import {Progress} from "@/components/ui/progress";
import {formatTime} from "@/utils/dateUtils";
import {getDaysInMonth} from "date-fns";
import {getTodayAppointments, getCurrentMonthRevenue, getDayAppointments} from "@/lib/supabase/queries";

export default async function DashboardStats({userId, barbershopId}: {userId: string; barbershopId: string}) {
  // Fetch data
  const todayAppointments = await getTodayAppointments();
  const currentMonthRevenue = await getCurrentMonthRevenue();
  const dayAppointments = await getDayAppointments(new Date().toISOString().split("T")[0]);

  // Calculate stats
  const nextAppointment = dayAppointments.find((appointment) => new Date(`${appointment.date}T${appointment.time}`) > new Date());
  const daysOfMonthLeft = getDaysInMonth(new Date().getMonth()) - new Date().getDate();

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Barbershop Overview</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            Manage appointments, clients, barbers and services with ease.
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-6">
          <AppointmentDialog userId={userId} />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Today&apos;s Appointments</CardDescription>
          <CardTitle className="text-4xl">{todayAppointments.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {nextAppointment ? `Next at ${formatTime(nextAppointment.time)}` : "No next appointment"}
          </div>
        </CardContent>
        <CardFooter>
          <Progress value={(todayAppointments.length / 20) * 100} aria-label={`${todayAppointments.length} appointments today`} />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Estimated Revenue</CardDescription>
          <CardTitle className="text-4xl">€ {currentMonthRevenue.toFixed(2)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">{daysOfMonthLeft} days left</div>
        </CardContent>
        <CardFooter>
          <Progress value={(currentMonthRevenue / 1000) * 100} aria-label={`${currentMonthRevenue} revenue this month`} />
        </CardFooter>
      </Card>
    </div>
  );
}
