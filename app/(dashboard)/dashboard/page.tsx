import {Suspense} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {AppointmentDetailsOverview} from "@/components/dashboard/AppointmentDetailsOverview";
import {AppointmentsProvider} from "@/components/dashboard/AppointmentsContext";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import {ListFilter, File} from "lucide-react";
import {Progress} from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {getBarbers, getCurrentMonthRevenue, getDayAppointments, getServices, getTodayAppointments, getWeekAppointments} from "@/lib/supabase/queries";
import {NewAppointmentDialog} from "@/components/NewAppointmentDialog";
import {formatTime} from "@/utils/dateUtils";
import {getDaysInMonth} from "date-fns";
import AppointmentsSection from "@/components/dashboard/AppointmentsSection";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {Skeleton} from "@/components/ui/skeleton";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const supabase = createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const todayAppointments = await getTodayAppointments();
  const currentMonthRevenue = await getCurrentMonthRevenue();
  const weekAppointments = await getWeekAppointments();
  const dayAppointments = await getDayAppointments(new Date().toISOString().split("T")[0]);
  const barbers = await getBarbers();
  const services = await getServices();

  const nextAppointment = dayAppointments.find((appointment) => new Date(`${appointment.date}T${appointment.time}`) > new Date());
  const daysOfMonthLeft = getDaysInMonth(new Date().getMonth()) - new Date().getDate();

  return (
    <AppointmentsProvider>
      <main className="grid flex-1 items-start gap-2 p-10 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Barbershop Overview</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  Manage appointments, clients, barbers and services with ease.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <NewAppointmentDialog initialBarbers={barbers} initialServices={services} user_id={user.id} />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Today&apos;s Appointments</CardDescription>
                <CardTitle className="text-4xl">{todayAppointments.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {nextAppointment ? `Next appointment at ${formatTime(nextAppointment.time)}` : "No next appointment"}
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
          <Tabs defaultValue="today">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>Haircuts</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Beard Trims</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Shaves</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Export</span>
                </Button>
              </div>
            </div>
            <TabsContent value="today" className="mt-4">
              <AppointmentsSection appointments={dayAppointments} />
            </TabsContent>
            <TabsContent value="week" className="mt-4">
              <AppointmentsSection appointments={weekAppointments} />
            </TabsContent>
          </Tabs>
          <div className="col-span-4 space-y-4 lg:col-span-1 lg:hidden">
            <AppointmentDetailsOverview />
          </div>
        </div>
        <div className="col-span-4 hidden space-y-4 lg:col-span-1 lg:block">
          <AppointmentDetailsOverview />
        </div>
      </main>
    </AppointmentsProvider>
  );
}

function DashboardSkeleton() {
  return (
    <AppointmentsProvider>
      <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Barbershop Overview</CardTitle>
                <CardDescription className="max-w-xl text-balance leading-relaxed">
                  Manage appointments, clients, barbers and services with ease.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-10 w-[200px]" />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Today&apos;s Appointments</CardDescription>
                <Skeleton className="h-10 w-16 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-[180px]" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-2 w-full" />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Estimated Revenue</CardDescription>
                <Skeleton className="h-10 w-24 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-[120px]" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-2 w-full" />
              </CardFooter>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <div className="flex gap-1">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Skeleton className="h-7 w-7" />
                  <Skeleton className="h-7 w-7" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {Array.from({length: 3}).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-4 hidden space-y-4 lg:col-span-1 lg:block">
          <AppointmentDetailsOverview />
        </div>
      </main>
    </AppointmentsProvider>
  );
}
