"use client";

import {useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {Calendar, Clock, Mail, Phone, Scissors, User} from "lucide-react";
import Link from "next/link";
import {formatDate, formatTime} from "@/utils/dateUtils";
import {Database} from "@/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Appointment = Database["public"]["Tables"]["appointments"]["Row"] & {
  barber: Database["public"]["Tables"]["barbers"]["Row"];
  services: Database["public"]["Tables"]["services"]["Row"][];
};

interface ClientProfilePageProps {
  profile: Profile;
  appointments: Appointment[];
}

export default function ClientProfilePage({profile, appointments}: ClientProfilePageProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate statistics
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter((apt) => !apt.is_cancelled && new Date(`${apt.date}T${apt.time}`) < new Date()).length;
  const cancelledAppointments = appointments.filter((apt) => apt.is_cancelled).length;
  const upcomingAppointments = appointments.filter((apt) => !apt.is_cancelled && new Date(`${apt.date}T${apt.time}`) > new Date()).length;

  // Calculate total spent
  const totalSpent = appointments
    .filter((apt) => !apt.is_cancelled && new Date(`${apt.date}T${apt.time}`) < new Date())
    .reduce((total, apt) => {
      return total + apt.services.reduce((sum, service) => sum + service.price, 0);
    }, 0);

  // Get next appointment
  const nextAppointment = appointments.find((apt) => !apt.is_cancelled && new Date(`${apt.date}T${apt.time}`) > new Date());

  return (
    <div className="container mx-auto py-10">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/clients">Clients</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{profile.full_name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-6">
        {/* Client Overview Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <h2 className="text-2xl font-bold">{profile.full_name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">Client since {formatDate(profile.updated_at || "")}</Badge>
                </div>
              </div>
              <Button asChild>
                <Link href={`/dashboard/appointments/new?client=${profile.id}`}>Book Appointment</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAppointments}</div>
              <p className="text-xs text-muted-foreground">All time appointments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Scissors className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAppointments}</div>
              <p className="text-xs text-muted-foreground">Successful visits</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Lifetime value</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {nextAppointment ? (
                <>
                  <div className="text-2xl font-bold">{formatDate(nextAppointment.date)}</div>
                  <p className="text-xs text-muted-foreground">{formatTime(nextAppointment.time)}</p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">No upcoming appointments</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Appointments History */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment History</CardTitle>
            <CardDescription>View all appointments and their details</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Barber</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="font-medium">{formatDate(appointment.date)}</div>
                        <div className="text-sm text-muted-foreground">{formatTime(appointment.time)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{appointment.barber.name}</div>
                            <div className="text-sm text-muted-foreground">{appointment.barber.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {appointment.services.map((service) => (
                            <Badge key={service.id} variant="secondary">
                              {service.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {appointment.is_cancelled ? (
                          <Badge variant="destructive">Cancelled</Badge>
                        ) : new Date(`${appointment.date}T${appointment.time}`) < new Date() ? (
                          <Badge variant="secondary">Completed</Badge>
                        ) : (
                          <Badge>Upcoming</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        €{appointment.services.reduce((sum, service) => sum + service.price, 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
