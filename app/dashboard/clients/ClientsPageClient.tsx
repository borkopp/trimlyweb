"use client";

import {useState, useMemo} from "react";
import {Input} from "@/components/ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {Mail, Search, User} from "lucide-react";
import Link from "next/link";
import {formatDate} from "@/utils/dateUtils";
import {Database} from "@/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  appointments: (Database["public"]["Tables"]["appointments"]["Row"] & {
    services: Database["public"]["Tables"]["services"]["Row"][];
  })[];
};

interface ClientsPageClientProps {
  initialClients: Profile[];
}

export default function ClientsPageClient({initialClients}: ClientsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort clients based on search query
  const filteredClients = useMemo(() => {
    const filtered = initialClients.filter((client) => {
      const searchLower = searchQuery.toLowerCase();
      return client.full_name?.toLowerCase().includes(searchLower) || client.email?.toLowerCase().includes(searchLower);
    });

    return filtered.sort((a, b) => {
      // Sort by name by default
      return (a.full_name || "").localeCompare(b.full_name || "");
    });
  }, [initialClients, searchQuery]);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Clients</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
            <p className="text-muted-foreground">Manage and view all your clients in one place.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search clients..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Total Visits</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => {
              const completedAppointments = client.appointments.filter(
                (apt) => !apt.is_cancelled && new Date(`${apt.date}T${apt.time}`) < new Date()
              ).length;

              const lastAppointment = client.appointments
                .filter((apt) => !apt.is_cancelled)
                .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime())[0];

              const nextAppointment = client.appointments
                .filter((apt) => !apt.is_cancelled && new Date(`${apt.date}T${apt.time}`) > new Date())
                .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())[0];

              return (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={client.avatar_url || ""} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{client.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {client.email}
                    </div>
                  </TableCell>
                  <TableCell>{completedAppointments}</TableCell>
                  <TableCell>{lastAppointment ? formatDate(lastAppointment.date) : "No visits yet"}</TableCell>
                  <TableCell>
                    {nextAppointment ? (
                      <Badge>Upcoming Visit</Badge>
                    ) : lastAppointment ? (
                      <Badge variant="secondary">Regular</Badge>
                    ) : (
                      <Badge variant="outline">New</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/clients/${client.id}`}>View Profile</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredClients.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-3 font-semibold">No clients found</h2>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? `No clients match your search "${searchQuery}"` : "You haven't added any clients yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
