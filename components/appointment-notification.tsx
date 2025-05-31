"use client";

import { useState } from "react";
import { Bell, Calendar, Clock, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  useAppointmentNotifications,
  type AppointmentNotification,
} from "@/hooks/use-appointment-notifications";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface AppointmentNotificationProps {
  currentUserId: string;
  barbershopId: number;
}

export function AppointmentNotificationComponent({
  currentUserId,
  barbershopId,
}: AppointmentNotificationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useAppointmentNotifications(currentUserId, barbershopId);

  // Mark all as read when dropdown opens
  const handleDropdownOpen = (open: boolean) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const formatNotificationTime = (date: string, time: string) => {
    try {
      const appointmentDateTime = parseISO(`${date}T${time}`);
      const appointmentDate = parseISO(date);
      const today = new Date();

      // Check if appointment is today
      if (
        format(appointmentDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
      ) {
        return `Today at ${format(appointmentDateTime, "h:mm a")}`;
      }

      // Check if appointment is tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (
        format(appointmentDate, "yyyy-MM-dd") === format(tomorrow, "yyyy-MM-dd")
      ) {
        return `Tomorrow at ${format(appointmentDateTime, "h:mm a")}`;
      }

      // Otherwise show full date
      return `${format(appointmentDate, "MMM d")} at ${format(
        appointmentDateTime,
        "h:mm a"
      )}`;
    } catch (error) {
      return `${date} at ${time}`;
    }
  };

  const formatButtonTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(":");
      const hour24 = parseInt(hours, 10);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const ampm = hour24 >= 12 ? "PM" : "AM";
      return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
      return time;
    }
  };

  // Get the latest notification for the button display (prioritize unread, then most recent)
  const latestNotification =
    notifications.find((n) => !n.isRead) || notifications[0];

  // If no notifications at all, don't render anything
  if (!latestNotification) {
    return null;
  }

  // Check if there are any unread notifications
  const hasUnread = unreadCount > 0;

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 px-3 relative transition-colors hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-primary/20 dark:hover:border-primary/20",
            hasUnread
              ? "bg-primary/5 border-primary/20 hover:bg-primary/10 dark:hover:bg-primary/10"
              : "bg-muted/5 border-muted/20 hover:bg-muted/10 dark:hover:bg-muted/10"
          )}
          aria-label={`${
            hasUnread ? "New appointment notification" : "Recent appointment"
          }: ${latestNotification.clientName} ${
            unreadCount > 1 ? `and ${unreadCount - 1} more` : ""
          }`}
        >
          <Badge
            variant="default"
            className={cn(
              "h-2 w-2 p-0 mr-2 flex-shrink-0",
              hasUnread ? "bg-primary" : "bg-muted"
            )}
          />
          <span className="text-sm font-medium truncate max-w-[200px]">
            {latestNotification.serviceName || "Appointment"}{" "}
            {formatButtonTime(latestNotification.time)}
          </span>
          {unreadCount > 1 && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 w-5 flex items-center justify-center text-xs"
            >
              +{unreadCount - 1}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 max-h-96" sideOffset={4}>
        <div className="flex items-center justify-between p-3">
          <DropdownMenuLabel className="p-0 font-semibold">
            New Appointments
          </DropdownMenuLabel>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                clearNotifications();
              }}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No new appointment notifications</p>
            <p className="text-xs mt-1">
              You&apos;ll be notified when clients book appointments via mobile
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-64">
            <div className="space-y-1 p-1">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={() => markAsRead(notification.id)}
                  formatTime={formatNotificationTime}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface NotificationItemProps {
  notification: AppointmentNotification;
  onMarkRead: () => void;
  formatTime: (date: string, time: string) => string;
}

function NotificationItem({
  notification,
  onMarkRead,
  formatTime,
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
        "hover:bg-muted/50",
        !notification.isRead && "bg-primary/5 border border-primary/20"
      )}
      onClick={onMarkRead}
    >
      {/* Notification indicator */}
      <div className="flex-shrink-0 mt-1">
        {!notification.isRead ? (
          <Badge variant="default" className="h-2 w-2 p-0 bg-primary" />
        ) : (
          <div className="h-2 w-2 rounded-full bg-muted" />
        )}
      </div>

      {/* Notification content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <p className="font-medium text-sm truncate">
            {notification.clientName}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">
            {formatTime(notification.date, notification.time)}
          </span>
        </div>

        {notification.serviceName && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{notification.serviceName}</span>
          </div>
        )}
      </div>
    </div>
  );
}
