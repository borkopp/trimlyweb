"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Loader2, Phone, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useClientSearch } from "@/hooks/use-client-search";

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
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const router = useRouter();

  const { data: clients = [], isLoading, error } = useClientSearch(searchQuery);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSearchQuery("");
        setSelectedClient(null);
      }, 300);
    }
  }, [open]);

  // Handle client selection
  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
  };

  // Handle client actions
  const handleViewProfile = () => {
    if (selectedClient) {
      router.push(`/dashboard/clients/${selectedClient.id}`);
      setOpen(false);
    }
  };

  const handleBookAppointment = () => {
    if (selectedClient) {
      // This could trigger the AppointmentDialog with pre-selected client
      // For now, navigate to appointments page with client filter
      router.push(`/dashboard/appointments?clientId=${selectedClient.id}`);
      setOpen(false);
    }
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="w-full">
            <Search className="mr-2 h-4 w-4" />
            Search Client
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Clients</DialogTitle>
          <DialogDescription>
            Search for clients by name, email, or phone number
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Results */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-2 pr-4">
                {searchQuery.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>Start typing to search for clients</p>
                  </div>
                ) : isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <div className="text-red-500 mb-2">
                      Failed to search clients
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {error instanceof Error
                        ? error.message
                        : "An unknown error occurred"}
                    </p>
                  </div>
                ) : clients.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <User className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No clients found matching &ldquo;{searchQuery}&rdquo;</p>
                  </div>
                ) : (
                  clients.map((client: Client) => (
                    <Card
                      key={client.id}
                      className={cn(
                        "cursor-pointer transition-all hover:bg-muted",
                        selectedClient?.id === client.id &&
                          "border-primary bg-primary/10"
                      )}
                      onClick={() => handleClientSelect(client)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={client.avatar_url || undefined} />
                            <AvatarFallback className="bg-primary/10">
                              {getInitials(client.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-base truncate">
                              {client.full_name || "Unknown Client"}
                            </h3>
                            <div className="space-y-1 mt-1">
                              {client.email && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
                                  <span className="truncate">
                                    {client.email}
                                  </span>
                                </div>
                              )}
                              {client.phone && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
                                  <span className="truncate">
                                    {client.phone}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Action Buttons */}
          {selectedClient && (
            <div className="border-t pt-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleViewProfile}
                  className="flex-1"
                  variant="outline"
                >
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
                <Button onClick={handleBookAppointment} className="flex-1">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
