"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarPlus,
  Search,
  Home,
  Calendar,
  Users2,
  Scissors,
  LineChart,
  Settings,
  User,
  Clock,
  CreditCard,
  Bell,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command";
import { useCommandPalette, CommandAction } from "@/hooks/use-command-palette";

interface CommandPaletteProps {
  userId?: string;
  barbershopId?: string;
}

export function CommandPalette({ userId, barbershopId }: CommandPaletteProps) {
  const { isOpen, close, executeAction, navigateTo } = useCommandPalette();
  const router = useRouter();

  // Trigger quick actions
  const triggerBookAppointment = () => {
    const event = new CustomEvent("command-book-appointment");
    window.dispatchEvent(event);
  };

  const triggerSearchClient = () => {
    const event = new CustomEvent("command-search-client");
    window.dispatchEvent(event);
  };

  const commands: CommandAction[] = [
    // Quick Actions
    {
      id: "book-appointment",
      label: "Book Appointment",
      description: "Create a new appointment",
      shortcut: "⌘B",
      icon: <CalendarPlus className="h-4 w-4" />,
      action: triggerBookAppointment,
      group: "Quick Actions",
    },
    {
      id: "search-client",
      label: "Search Client",
      description: "Find and manage clients",
      shortcut: "⌘⇧F",
      icon: <Search className="h-4 w-4" />,
      action: triggerSearchClient,
      group: "Quick Actions",
    },
    {
      id: "today-schedule",
      label: "View Today's Schedule",
      description: "See appointments for today",
      icon: <Clock className="h-4 w-4" />,
      action: () => navigateTo("/dashboard/calendar/day-view"),
      group: "Quick Actions",
    },

    // Navigation
    {
      id: "dashboard",
      label: "Dashboard",
      description: "Go to main dashboard",
      shortcut: "⌘H",
      icon: <Home className="h-4 w-4" />,
      action: () => navigateTo("/dashboard"),
      group: "Navigation",
    },
    {
      id: "calendar",
      label: "Calendar",
      description: "View appointments calendar",
      shortcut: "⌘C",
      icon: <Calendar className="h-4 w-4" />,
      action: () => navigateTo("/dashboard/calendar/week-view"),
      group: "Navigation",
    },
    {
      id: "clients",
      label: "Clients",
      description: "Manage client information",
      icon: <User className="h-4 w-4" />,
      action: () => navigateTo("/dashboard/clients"),
      group: "Navigation",
    },
    {
      id: "barbers",
      label: "Barbers",
      description: "Manage barber profiles",
      icon: <Users2 className="h-4 w-4" />,
      action: () => navigateTo("/dashboard/barbers"),
      group: "Navigation",
    },
    {
      id: "services",
      label: "Services",
      description: "Manage barbershop services",
      icon: <Scissors className="h-4 w-4" />,
      action: () => navigateTo("/dashboard/services"),
      group: "Navigation",
    },
    {
      id: "analytics",
      label: "Analytics",
      description: "View business analytics",
      icon: <LineChart className="h-4 w-4" />,
      action: () => navigateTo("/dashboard/analytics"),
      group: "Navigation",
    },

    // Settings
    {
      id: "settings",
      label: "General Settings",
      description: "Configure barbershop settings",
      shortcut: "⌘G",
      icon: <Settings className="h-4 w-4" />,
      action: () => navigateTo("/dashboard/settings"),
      group: "Settings",
    },
    {
      id: "hours",
      label: "Opening Hours",
      description: "Set business hours",
      icon: <Clock className="h-4 w-4" />,
      action: () => navigateTo("/dashboard/settings?tab=hours"),
      group: "Settings",
    },
    {
      id: "notifications",
      label: "Notifications",
      description: "Configure notification preferences",
      icon: <Bell className="h-4 w-4" />,
      action: () => navigateTo("/dashboard/settings?tab=notifications"),
      group: "Settings",
    },
    {
      id: "payments",
      label: "Payment Settings",
      description: "Configure payment options",
      icon: <CreditCard className="h-4 w-4" />,
      action: () => navigateTo("/dashboard/settings?tab=payments"),
      group: "Settings",
    },
  ];

  // Group commands by category
  const groupedCommands = commands.reduce((acc, command) => {
    if (!acc[command.group]) {
      acc[command.group] = [];
    }
    acc[command.group].push(command);
    return acc;
  }, {} as Record<string, CommandAction[]>);

  return (
    <CommandDialog open={isOpen} onOpenChange={close}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {Object.entries(groupedCommands).map(
          ([group, groupCommands], index) => (
            <React.Fragment key={group}>
              {index > 0 && <CommandSeparator />}
              <CommandGroup heading={group}>
                {groupCommands.map((command) => (
                  <CommandItem
                    key={command.id}
                    onSelect={() => executeAction(command.action)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {command.icon}
                    <div className="flex-1">
                      <div className="font-medium">{command.label}</div>
                      {command.description && (
                        <div className="text-sm text-muted-foreground">
                          {command.description}
                        </div>
                      )}
                    </div>
                    {command.shortcut && (
                      <CommandShortcut>{command.shortcut}</CommandShortcut>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </React.Fragment>
          )
        )}
      </CommandList>
    </CommandDialog>
  );
}
