import Image from "next/image";
import Link from "next/link";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {Calendar, File, Home, LineChart, ListFilter, Scissors, Search, Settings, Users2} from "lucide-react";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {Progress} from "@/components/ui/progress";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {getBarbers, getCurrentMonthRevenue, getServices, getTodayAppointments, getWeekAppointments} from "@/lib/supabase/queries";
import {AppointmentsProvider} from "@/components/AppointmentsContext";
import AppointmentsSection from "@/components/AppointmentsSection";
import {AppointmentDetails} from "@/components/AppointmentDetails";
import {NewAppointmentDialog} from "@/components/NewAppointmentDialog";

export default async function DashboardPage() {
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

  const barbers = await getBarbers();
  const services = await getServices();

  return (
    <AppointmentsProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40 pt-14">
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-14 flex-col border-r bg-background sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link href="#" className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
              <Scissors className="h-4 w-4 transition-all group-hover:scale-110" />
              <span className="sr-only">Barbershop Dashboard</span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="#" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                  <Calendar className="h-5 w-5" />
                  <span className="sr-only">Appointments</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Appointments</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="#" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                  <Users2 className="h-5 w-5" />
                  <span className="sr-only">Clients</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Clients</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="#" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                  <LineChart className="h-5 w-5" />
                  <span className="sr-only">Analytics</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Analytics</TooltipContent>
            </Tooltip>
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="#" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </nav>
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <Scissors className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link href="#" className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
                    <Scissors className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">Barbershop Dashboard</span>
                  </Link>
                  <Link href="#" className="flex items-center gap-4 px-2.5 text-foreground">
                    <Home className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                    <Calendar className="h-5 w-5" />
                    Appointments
                  </Link>
                  <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                    <Users2 className="h-5 w-5" />
                    Clients
                  </Link>
                  <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                    <LineChart className="h-5 w-5" />
                    Analytics
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="#">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search clients..." className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                  <Image src="/placeholder-user.jpg" width={36} height={36} alt="Avatar" className="overflow-hidden rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                <Card className="sm:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle>Barbershop Overview</CardTitle>
                    <CardDescription className="max-w-lg text-balance leading-relaxed">Welcome to your barbershop dashboard. Manage appointments, clients, and analytics with ease.</CardDescription>
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
                    <div className="text-xs text-muted-foreground">{todayAppointments.length > 0 ? `Next appointment at ${todayAppointments[0].time}` : "No appointments today"}</div>
                  </CardContent>
                  <CardFooter>
                    <Progress value={(todayAppointments.length / 20) * 100} aria-label={`${todayAppointments.length} appointments today`} />
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>This Month&apos;s Revenue</CardDescription>
                    <CardTitle className="text-4xl">€ {currentMonthRevenue.toFixed(2)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">Revenue from services</div>
                  </CardContent>
                  <CardFooter>
                    <Progress value={(currentMonthRevenue / 1000) * 100} aria-label={`${currentMonthRevenue} revenue this month`} />
                  </CardFooter>
                </Card>
              </div>
              <Tabs defaultValue="week">
                <div className="flex items-center">
                  <TabsList>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
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
              </Tabs>
            </div>
            <div>
              <AppointmentDetails />
            </div>
          </main>
        </div>
      </div>
    </AppointmentsProvider>
  );
}
