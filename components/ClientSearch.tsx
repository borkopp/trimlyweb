"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Clock, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/utils/dateUtils";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type Appointment = {
  id: number;
  date: string;
  time: string;
  is_cancelled: boolean;
  service_ids: number[];
};

type ClientWithHistory = Profile & {
  appointments: Appointment[];
};

export function ClientSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState<ClientWithHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const searchClients = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setClients([]);
      return;
    }

    setLoading(true);
    const supabase = await createClient();

    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .limit(5);

      if (profilesError) throw profilesError;

      const clientsWithHistory = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: appointments } = await supabase
            .from("appointments")
            .select("id, date, time, is_cancelled, service_ids")
            .eq("user_id", profile.id)
            .order("date", { ascending: false })
            .order("time", { ascending: false })
            .limit(3);

          return {
            ...profile,
            appointments: appointments || [],
          };
        })
      );

      setClients(clientsWithHistory);
    } catch (error) {
      console.error("Error searching clients:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      searchClients(query);
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query, searchClients]);

  const handleSelect = (clientId: string) => {
    setOpen(false);
    router.push(`/dashboard/clients/${clientId}`);
  };

  return (
    <>
      <div
        className="relative w-full md:w-[200px] lg:w-[336px]"
        onClick={() => setOpen(true)}
      >
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          className="w-full pl-8 rounded-lg bg-background"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-w-2xl">
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search clients..."
              value={query}
              onValueChange={setQuery}
              className="border-none focus:ring-0"
            />
            <CommandList>
              <CommandEmpty>
                {loading ? "Searching..." : "No clients found."}
              </CommandEmpty>
              <CommandGroup heading="Clients">
                <ScrollArea className="h-[300px]">
                  {clients.map((client) => (
                    <div key={client.id} className="px-4 py-2 hover:bg-accent">
                      <CommandItem
                        value={client.id}
                        onSelect={() => handleSelect(client.id)}
                        className="gap-2 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {client.full_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {client.email}
                            </div>
                          </div>
                        </div>
                      </CommandItem>
                      {client.appointments.length > 0 && (
                        <div className="mt-2 pl-10 space-y-1">
                          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1">
                            <Clock className="h-3 w-3" />
                            Recent Appointments
                          </div>
                          {client.appointments.map((appointment) => (
                            <div
                              key={appointment.id}
                              className="flex items-center justify-between text-sm text-muted-foreground"
                            >
                              <div className="flex items-center gap-2">
                                <div>{formatDate(appointment.date)}</div>
                                <div>{formatTime(appointment.time)}</div>
                              </div>
                              <Badge
                                variant={
                                  appointment.is_cancelled
                                    ? "destructive"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {appointment.is_cancelled
                                  ? "Cancelled"
                                  : "Completed"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                      <CommandSeparator />
                    </div>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
