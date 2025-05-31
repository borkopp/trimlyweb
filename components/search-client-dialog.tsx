"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Loader2, Phone, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useClientSearch } from "@/hooks/use-client-search";
import { EnterIcon } from "@radix-ui/react-icons";

type Client = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
};

interface SearchClientDialogProps {
  children?: ReactNode;
}

export function SearchClientDialog({ children }: SearchClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const { data: clients = [], isLoading, error } = useClientSearch(searchQuery);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSearchQuery("");
      }, 300);
    }
  }, [open]);

  // Handle client actions
  const handleViewProfile = (client: Client) => {
    router.push(`/dashboard/clients/${client.id}`);
    setOpen(false);
  };

  const handleBookAppointment = (client: Client) => {
    // This could trigger the AppointmentDialog with pre-selected client
    // For now, navigate to appointments page with client filter
    router.push(`/dashboard/appointments?clientId=${client.id}`);
    setOpen(false);
  };

  // Generate initials from full name
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {children || (
          <Button variant="outline" className="w-full">
            <Search className="mr-2 h-4 w-4" />
            Search Client
          </Button>
        )}
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Search clients by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
        </div>
        <CommandList>
          {searchQuery.length === 0 ? (
            <CommandEmpty>Start typing to search for clients</CommandEmpty>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <CommandEmpty>
              <div className="text-center">
                <div className="text-red-500 mb-1">
                  Failed to search clients
                </div>
                <p className="text-muted-foreground text-xs">
                  {error instanceof Error
                    ? error.message
                    : "An unknown error occurred"}
                </p>
              </div>
            </CommandEmpty>
          ) : clients.length === 0 ? (
            <CommandEmpty>
              No clients found matching &ldquo;{searchQuery}&rdquo;
            </CommandEmpty>
          ) : (
            <CommandGroup heading="Clients">
              {clients.map((client: Client) => (
                <CommandItem
                  key={client.id}
                  onSelect={() => handleViewProfile(client)}
                  className="flex items-center gap-3 px-2 py-3 cursor-pointer"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={client.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-xs">
                      {getInitials(client.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">
                      {client.full_name || "Unknown Client"}
                    </div>
                    <div className="flex items-center gap-4 mt-0.5">
                      {client.email && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Mail className="h-3 w-3 mr-1" />
                          <span>{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center ">
                    <div className="text-lg border border-muted-foreground/20 rounded-md px-2 py-0 text-muted-foreground">
                      ↵
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
