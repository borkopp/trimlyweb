# Optimized Appointment System Database Design

This directory contains the optimized SQL functions and TypeScript helpers for the appointment scheduling system.

## Overview

The appointment system follows a step-by-step process:

1. **Barber Selection**: Users select a barber from the available barbers
2. **Service Selection**: Users select one or more services from the barber's available services
3. **Date Selection**: Users select a date that has available time slots for the barber
4. **Time Selection**: Users select a specific time slot based on service duration

## Database Functions

### `get_barber_available_dates`

Determines which dates a barber has availability within a given range.

- Parameters:
  - `p_barber_id`: The barber's ID
  - `p_days_ahead`: How many days to look ahead (default: 30)
- Returns: Table of dates with availability status

### `get_barber_available_slots`

Gets available time slots for a specific barber on a date, considering service duration.

- Parameters:
  - `p_barber_id`: The barber's ID
  - `p_date`: The date to check
  - `p_service_ids`: Array of service IDs to calculate total duration
- Returns: Table of time slots with availability status

### `book_appointment_v2`

Books an appointment with comprehensive validation.

- Parameters:
  - `p_barber_id`: The barber's ID
  - `p_user_id`: The user's ID
  - `p_service_ids`: Array of service IDs
  - `p_date`: The appointment date
  - `p_time`: The appointment start time
  - `p_is_guest`: Whether the user is a guest (default: false)
  - `p_temporary_user_id`: Optional guest user ID
  - `p_check_only`: Whether to only check availability without booking (default: false)
- Returns: JSON object with success/failure status and details

## TypeScript Helper Functions

These server action functions provide an interface between the front-end and the database:

- `getBarbers()`: Fetches all barbers for the current barbershop
- `getBarberServices(barberId)`: Gets services provided by a specific barber
- `getBarberAvailableDates(barberId, daysAhead)`: Gets dates with availability
- `getBarberAvailableSlots(barberId, date, serviceIds)`: Gets available time slots
- `createAppointment(...)`: Creates a new appointment
- `checkTimeSlotAvailability(...)`: Checks if a time slot is available
- `calculateServicesDuration(serviceIds)`: Calculates total duration for selected services
- `getBarberServiceImages(barbers, services)`: Prefetches image URLs

## Performance Optimizations

1. **Batched Queries**: Database functions perform multiple checks in a single query
2. **Prefetching**: React components prefetch data for likely user actions
3. **Properly Typed**: Full TypeScript support with proper types
4. **Server-Side Validation**: All business logic runs on the server/in the database
5. **React Query Caching**: Efficient caching of database results

## Implementation

To implement this system:

1. Execute the SQL functions in the Supabase SQL Editor
2. Install the TypeScript helper files in your project
3. Use the `AppointmentDialog` component in your application

## Integration with React Native

This system works across platforms - the core logic is in the database functions, which can be called from any client platform.

For React Native integration:
- Use the same database functions
- Create equivalent React Native components
- Ensure proper error handling and loading states 