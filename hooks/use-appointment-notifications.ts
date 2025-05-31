"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/database.types";
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type AppointmentRow = Database["public"]["Tables"]["appointments"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export interface AppointmentNotification {
  id: number;
  clientName: string;
  date: string;
  time: string;
  serviceName?: string;
  isRead: boolean;
  createdAt: Date;
}

interface UseAppointmentNotificationsResult {
  notifications: AppointmentNotification[];
  unreadCount: number;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export function useAppointmentNotifications(
  currentUserId: string,
  barbershopId: number
): UseAppointmentNotificationsResult {
  const [notifications, setNotifications] = useState<AppointmentNotification[]>([]);
  const supabase = createClient();

  // Load notifications from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(`appointment-notifications-${currentUserId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt)
        }));
        setNotifications(parsed);
      } catch (error) {
        console.error('Error parsing stored notifications:', error);
      }
    }
  }, [currentUserId]);

  // Save notifications to sessionStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      sessionStorage.setItem(
        `appointment-notifications-${currentUserId}`,
        JSON.stringify(notifications)
      );
    }
  }, [notifications, currentUserId]);

  // Fetch client details for appointment
  const fetchClientDetails = useCallback(async (appointment: AppointmentRow) => {
    let clientName = "Walk-in Customer";
    
    if (appointment.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', appointment.user_id)
        .single();
      
      if (profile?.full_name) {
        clientName = profile.full_name;
      }
    } else if (appointment.name) {
      clientName = appointment.name;
    }

    return clientName;
  }, [supabase]);

  // Fetch service names for appointment
  const fetchServiceNames = useCallback(async (serviceIds: number[]) => {
    if (!serviceIds.length) return "Standard Service";

    const { data: services } = await supabase
      .from('services')
      .select('name')
      .in('id', serviceIds);

    if (services && services.length > 0) {
      return services.map(s => s.name).join(', ');
    }

    return "Standard Service";
  }, [supabase]);

  // Set up realtime subscription for new appointments
  useEffect(() => {
    if (!currentUserId || !barbershopId) return;

    console.log(`[AppointmentNotifications] Setting up realtime for barbershop ${barbershopId}, user ${currentUserId}`);

    const channel = supabase
      .channel(`appointment-notifications-${barbershopId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments',
          filter: `barbershop_id=eq.${barbershopId}`,
        },
        async (payload: RealtimePostgresChangesPayload<AppointmentRow>) => {
          const newAppointment = payload.new as AppointmentRow;
          
          console.log('[AppointmentNotifications] New appointment detected:', newAppointment);

          // Only show notification if appointment was NOT booked by current dashboard user
          if (newAppointment.user_id && newAppointment.user_id === currentUserId) {
            console.log('[AppointmentNotifications] Ignoring appointment booked by current user');
            return;
          }

          try {
            // Fetch client and service details
            const [clientName, serviceName] = await Promise.all([
              fetchClientDetails(newAppointment),
              fetchServiceNames(newAppointment.service_ids || [])
            ]);

            const notification: AppointmentNotification = {
              id: newAppointment.id,
              clientName,
              date: newAppointment.date,
              time: newAppointment.time,
              serviceName,
              isRead: false,
              createdAt: new Date(),
            };

            console.log('[AppointmentNotifications] Adding notification:', notification);

            setNotifications(prev => {
              // Prevent duplicates
              if (prev.some(n => n.id === notification.id)) {
                return prev;
              }
              // Keep only last 20 notifications
              const updated = [notification, ...prev].slice(0, 20);
              return updated;
            });
          } catch (error) {
            console.error('[AppointmentNotifications] Error processing notification:', error);
          }
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error('[AppointmentNotifications] Subscription error:', err);
        } else {
          console.log('[AppointmentNotifications] Subscription status:', status);
        }
      });

    return () => {
      console.log('[AppointmentNotifications] Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [currentUserId, barbershopId, supabase, fetchClientDetails, fetchServiceNames]);

  // Mark specific notification as read
  const markAsRead = useCallback((notificationId: number) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    sessionStorage.removeItem(`appointment-notifications-${currentUserId}`);
  }, [currentUserId]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
} 