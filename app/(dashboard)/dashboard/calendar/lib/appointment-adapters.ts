import type { IEvent, IUser } from "@/calendar/interfaces";
import type { TEventColor } from "@/calendar/types";

// Database types based on Supabase schema
export interface DatabaseAppointment {
  id: number;
  user_id: string | null;
  barber_id: number;
  date: string;
  time: string;
  end_time: string | null;
  duration: number | null;
  service_ids: number[];
  is_cancelled: boolean;
  is_cancelled_by_barber: boolean;
  cancellation_reason: string | null;
  barbershop_id: number;
  name: string | null; // For walk-in customers
  barber_name: string;
  barber_image: string | null;
  customer_name: string | null;
  customer_avatar: string | null;
  services?: DatabaseService[];
}

export interface DatabaseService {
  id: number;
  name: string;
  description: string | null;
  time: number;
  price: string;
}

export interface DatabaseBarber {
  id: number;
  name: string;
  image: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
  user_id: string | null;
  barbershop_id: number;
}

// Color mapping for different appointment types/services
const COLOR_MAPPING: Record<string, TEventColor> = {
  "Haircut": "blue",
  "Hair Color": "purple", 
  "Beard Trim": "green",
  "Hair Wash": "yellow",
  "Eyebrows": "orange",
  "default": "red"
};

/**
 * Get color based on primary service or appointment characteristics
 */
function getAppointmentColor(services: DatabaseService[] = []): TEventColor {
  if (services.length === 0) return "red";
  
  // Use the first service to determine color
  const primaryService = services[0];
  return COLOR_MAPPING[primaryService.name] || COLOR_MAPPING.default;
}

/**
 * Generate appointment title from services
 */
function generateAppointmentTitle(services: DatabaseService[] = []): string {
  if (services.length === 0) return "Appointment";
  if (services.length === 1) return services[0].name;
  if (services.length === 2) return `${services[0].name} + ${services[1].name}`;
  return `${services[0].name} + ${services.length - 1} more`;
}

/**
 * Generate appointment description from services
 */
function generateAppointmentDescription(services: DatabaseService[] = []): string {
  if (services.length === 0) return "No services specified";
  
  const serviceDescriptions = services
    .map(service => `${service.name} (${service.time}min - $${service.price})`)
    .join(", ");
  
  return serviceDescriptions;
}

/**
 * Convert database barber to calendar user format
 */
export function transformBarberToUser(barber: DatabaseBarber): IUser {
  return {
    id: barber.id.toString(),
    name: barber.name,
    picturePath: barber.image || null,
  };
}

/**
 * Convert database appointment to calendar event format
 */
export function transformAppointmentToEvent(
  appointment: DatabaseAppointment,
  services: DatabaseService[] = []
): IEvent {
  // Create start and end date-time strings
  const startDateTime = `${appointment.date}T${appointment.time}`;
  const endDateTime = appointment.end_time 
    ? `${appointment.date}T${appointment.end_time}`
    : (() => {
        // Calculate end time from duration if end_time is not provided
        const startDate = new Date(startDateTime);
        const durationMs = (appointment.duration || 30) * 60 * 1000; // Default 30 min
        const endDate = new Date(startDate.getTime() + durationMs);
        return endDate.toISOString();
      })();

  // Determine customer name (registered user or walk-in)
  const customerName = appointment.customer_name || appointment.name || "Walk-in Customer";
  
  return {
    id: appointment.id,
    startDate: startDateTime,
    endDate: endDateTime,
    title: generateAppointmentTitle(services),
    color: getAppointmentColor(services),
    description: generateAppointmentDescription(services),
    user: {
      id: appointment.barber_id.toString(),
      name: appointment.barber_name,
      picturePath: appointment.barber_image || null,
    },
  };
}

/**
 * Transform array of database appointments to calendar events
 */
export function transformAppointmentsToEvents(
  appointments: DatabaseAppointment[],
  servicesMap: Record<number, DatabaseService> = {}
): IEvent[] {
  return appointments.map(appointment => {
    // Get services for this appointment
    const appointmentServices = appointment.service_ids
      .map(serviceId => servicesMap[serviceId])
      .filter(Boolean);
    
    return transformAppointmentToEvent(appointment, appointmentServices);
  });
}

/**
 * Transform array of database barbers to calendar users
 */
export function transformBarbersToUsers(barbers: DatabaseBarber[]): IUser[] {
  return barbers.map(transformBarberToUser);
} 