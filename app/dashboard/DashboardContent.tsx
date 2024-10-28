import Link from "next/link";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {Calendar, File, Home, LineChart, ListFilter, Scissors, Search, User, Users2} from "lucide-react";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList} from "@/components/ui/breadcrumb";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {Progress} from "@/components/ui/progress";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {getBarbers, getCurrentMonthRevenue, getDayAppointments, getServices, getTodayAppointments, getWeekAppointments} from "@/lib/supabase/queries";
import {AppointmentsProvider} from "@/components/dashboard/AppointmentsContext";
import AppointmentsSection from "@/components/dashboard/AppointmentsSection";
import {AppointmentDetails} from "@/components/dashboard/AppointmentDetails";
import {NewAppointmentDialog} from "@/components/NewAppointmentDialog";
import {formatTime} from "@/utils/dateUtils";
import {getDaysInMonth} from "date-fns";
import {LogoutButton} from "@/components/LogoutButton";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

async function getImageUrl(path: string) {
  const supabase = createClient();
  const {data} = await supabase.storage.from("barber-images").getPublicUrl(path);

  return data?.publicUrl || null;
}

export default async function DashboardContent() {
  const supabase = createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {data: profile} = await supabase.from("profiles").select("*").eq("id", user.id).single();

  const avatarUrl = profile?.avatar_url ? await getImageUrl(profile.avatar_url) : null;

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
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
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
                <TabsContent value="week">
                  <AppointmentsSection appointments={weekAppointments} />
                </TabsContent>
                <TabsContent value="today">
                  <AppointmentsSection appointments={dayAppointments} />
                </TabsContent>
              </Tabs>
            </div>
            <div>
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle>Select an appointment</CardTitle>
                  <CardDescription>Click on an appointment from the list to view its details.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AppointmentsProvider>
  );
}
