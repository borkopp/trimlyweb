"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  CalendarPlus,
  Search,
  Moon,
  Sun,
  Home,
  Users2,
  Scissors,
  LineChart,
  Clock,
  Bell,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

interface SpotlightCommandProps {
  userId?: string;
  barbershopId?: string;
}

export function SpotlightCommand({
  userId,
  barbershopId,
}: SpotlightCommandProps) {
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Trigger quick actions from other components
  const triggerBookAppointment = () => {
    const event = new CustomEvent("command-book-appointment");
    window.dispatchEvent(event);
  };

  const triggerSearchClient = () => {
    const event = new CustomEvent("command-search-client");
    window.dispatchEvent(event);
  };

  // Global keyboard shortcut for Cmd+J
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }

      // Quick dark mode toggle with Cmd+D
      if (e.key === "d" && (e.metaKey || e.ctrlKey) && !open) {
        e.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [theme, setTheme, open]);

  const navigateAndClose = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const executeAndClose = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem
              onSelect={() => executeAndClose(triggerBookAppointment)}
            >
              <CalendarPlus className="text-muted-foreground h-4 w-4" />
              <span>Book Appointment</span>
            </CommandItem>
            <CommandItem onSelect={() => executeAndClose(triggerSearchClient)}>
              <Search className="text-muted-foreground h-4 w-4" />
              <span>Search Client</span>
            </CommandItem>
            <CommandItem
              onSelect={() => navigateAndClose("/dashboard/calendar")}
            >
              <Calendar className="text-muted-foreground h-4 w-4" />
              <span>Today&apos;s Schedule</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick Actions">
            <CommandItem
              onSelect={() =>
                executeAndClose(() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                )
              }
            >
              {theme === "dark" ? (
                <Sun className="text-muted-foreground h-4 w-4" />
              ) : (
                <Moon className="text-muted-foreground h-4 w-4" />
              )}
              <span>Toggle {theme === "dark" ? "Light" : "Dark"} Mode</span>
              <CommandShortcut>⌘D</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => navigateAndClose("/dashboard")}>
              <Home className="text-muted-foreground h-4 w-4" />
              <span>Dashboard</span>
              <CommandShortcut>⌘H</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => navigateAndClose("/dashboard/analytics")}
            >
              <LineChart className="text-muted-foreground h-4 w-4" />
              <span>Analytics</span>
              <CommandShortcut>⌘A</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => navigateAndClose("/dashboard/clients")}
            >
              <User className="text-muted-foreground h-4 w-4" />
              <span>Clients</span>
            </CommandItem>
            <CommandItem
              onSelect={() => navigateAndClose("/dashboard/barbers")}
            >
              <Users2 className="text-muted-foreground h-4 w-4" />
              <span>Barbers</span>
            </CommandItem>
            <CommandItem
              onSelect={() => navigateAndClose("/dashboard/services")}
            >
              <Scissors className="text-muted-foreground h-4 w-4" />
              <span>Services</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem
              onSelect={() => navigateAndClose("/dashboard/settings")}
            >
              <User className="text-muted-foreground h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                navigateAndClose("/dashboard/settings?tab=payments")
              }
            >
              <CreditCard className="text-muted-foreground h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => navigateAndClose("/dashboard/settings")}
            >
              <Settings className="text-muted-foreground h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export function SpotlightCommandDemo() {
  return (
    <div className="flex items-center space-x-2">
      <p className="text-sm text-muted-foreground">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </p>
    </div>
  );
}
