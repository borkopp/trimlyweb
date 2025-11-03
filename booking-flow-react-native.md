# Booking Flow Analysis

This document provides a complete breakdown of the booking flow, detailing which functionality is handled by Supabase and which is implemented in the app code.

## Booking Flow Overview

The booking process follows a 4-step wizard:

1. **Barber Selection** - User selects a barber
2. **Service Selection** - User selects one or more services
3. **Date & Time Selection** - User selects appointment date and time slot
4. **Review & Book** - User reviews details and confirms booking

---

## Step-by-Step Flow Breakdown

### Step 1: Barber Selection

**App Code Logic:**
- `app/(client)/booking/index.tsx` - Main booking screen orchestrator
- `app/(client)/booking/screens/barber-selection.tsx` - UI for barber selection
- `contexts/BookingContext.tsx` - Context provider for managing booking state

**Supabase Functions/Queries:**

1. **Fetch All Barbers**
   - Function: `fetchBarbers()` in `lib/booking-api.ts`
   - Query:
     ```typescript
     supabase
       .from('barbers')
       .select('*')
       .eq('barbershop_id', BARBERSHOP_ID)
     ```
   - Returns: Array of barber objects (id, name, image, description)
   - Image URL handling: Uses `getBarberImageUrl()` which calls `supabase.storage.from('barber-images').getPublicUrl()`

2. **Filter Barbers by Available Services** (optional, when services pre-selected)
   - Function: `fetchBarbersForServices(serviceIds)` in `lib/booking-api.ts`
   - Query:
     ```typescript
     supabase
       .from('barber_services')
       .select('barber_id')
       .in('service_id', serviceIds)
     ```

**App Logic:**
- Pre-fetching services when barber is selected (line 72-89 in booking/index.tsx)
- State management via React Context
- Barber filtering based on available services

---

### Step 2: Service Selection

**App Code Logic:**
- `app/(client)/booking/screens/service-selection.tsx` - UI for service selection

**Supabase Functions/Queries:**

1. **Fetch Services for Selected Barber**
   - Function: `fetchBarberServices(barberId)` in `lib/booking-api.ts`
   - Query:
     ```typescript
     supabase
       .from('barber_services')
       .select('*, services(*)')
       .eq('barber_id', barberId)
     ```
   - Returns: Array of services with details (id, name, price, time/duration, description, image)
   - Image URL: Uses `getServiceImageUrl()` for Supabase Storage

**App Logic:**
- Service selection/deselection toggle
- Multiple service selection
- Total price calculation (sum of selected services)
- Total duration calculation (sum of selected service durations)
- Caching services in BookingContext to avoid re-fetching

---

### Step 3: Date & Time Selection

**App Code Logic:**
- `app/(client)/booking/screens/date-time-selection.tsx` - UI for date/time selection

**Supabase Functions/Queries:**

1. **Fetch Available Time Slots**
   - Function: `fetchAvailableTimeSlots(barberId, date, duration)` in `lib/booking-api.ts`
   - **Supabase RPC Call:**
     ```typescript
     supabase.rpc('available_time_slots', {
       p_barber_id: barberId,
       p_date: date,        // YYYY-MM-DD format
       p_duration: serviceDuration  // in minutes
     })
     ```
   - Returns: Array of available time slots with `{ time_slot: string, is_available: boolean }`

2. **Fetch Last Minute Booking Buffer**
   - Function: `fetchLastMinuteBookingBuffer(barberId)` in `lib/booking-api.ts`
   - Queries:
     ```typescript
     // Get barbershop_id from barber
     supabase
       .from('barbers')
       .select('barbershop_id')
       .eq('id', barberId)
       .single()
     
     // Get buffer setting
     supabase
       .from('barbershops')
       .select('last_minute_booking_buffer')
       .eq('id', barbershop_id)
       .single()
     ```
   - Returns: Number of minutes required before appointment time (default: 30)

**App Logic:**
- Generate next 14 days for date selection
- Calculate total service duration from selected services
- Filter time slots based on:
  - Availability (from Supabase function)
  - Last minute booking buffer (prevents booking too close to current time)
  - Past time slots (filtered out client-side)
- Format time slots from "HH:MM:SS" to "HH:MM" for display
- Clear selected time if it becomes unavailable when date changes

---

### Step 4: Review & Book

**App Code Logic:**
- `app/(client)/booking/index.tsx` - Handles final booking action
- `app/(client)/booking/screens/review-book.tsx` - UI for review screen

**Supabase Functions/Queries:**

1. **Create Appointment**
   - Function: `createAppointment(bookingData)` in `lib/booking-api.ts`
   - **Supabase RPC Call:**
     ```typescript
     supabase.rpc('book_appointment_v2_text', {
       p_barber_id: bookingData.barber.id,
       p_user_id: user.id,              // From supabase.auth.getUser()
       p_service_ids: serviceIds,        // Array of service IDs
       p_date: formattedDate,             // YYYY-MM-DD format
       p_time: formattedTime,           // HH:MM:SS format
       p_check_only: false,              // true = check availability, false = book
       p_client_name: null               // For registered users, null is fine
     })
     ```
   - Returns: JSON with `{ success: boolean, appointment_id?: number, message?: string }`

2. **Get Current User**
   - Query:
     ```typescript
     supabase.auth.getUser()
     ```

**App Logic:**
- Data validation before booking:
  - Check barber is selected
  - Check at least one service is selected
  - Check date/time is selected
- Date formatting: Convert Date object to "YYYY-MM-DD" string
- Time formatting: Convert "HH:MM" to "HH:MM:SS" format
- Error handling and user feedback
- Navigation to completion screen on success

---

## Summary: Supabase vs App Code

### Supabase Functions (Database RPC Functions)

1. **`available_time_slots`**
   - Input: `p_barber_id`, `p_date`, `p_duration`
   - Returns: Available time slots for a specific barber, date, and duration
   - Logic in Supabase: Checks existing appointments, barber schedule, calculates available slots

2. **`book_appointment_v2_text`**
   - Input: `p_barber_id`, `p_user_id`, `p_service_ids`, `p_date`, `p_time`, `p_check_only`, `p_client_name`
   - Returns: Booking result with success status and appointment ID
   - Logic in Supabase: 
     - Validates time slot availability
     - Calculates total duration from services
     - Checks for conflicts with existing appointments
     - Creates appointment record
     - Returns success/error status

### Supabase Queries (Standard Database Queries)

1. **Barbers Table**
   - Read: `SELECT * FROM barbers WHERE barbershop_id = ?`
   - Used for: Fetching all barbers

2. **Barber Services Junction Table**
   - Read: `SELECT * FROM barber_services WHERE barber_id = ?`
   - Used for: Fetching services available to a specific barber

3. **Services Table**
   - Read: `SELECT * FROM services WHERE id IN (...)`
   - Used for: Fetching service details (name, price, duration)

4. **Barbershops Table**
   - Read: `SELECT last_minute_booking_buffer FROM barbershops WHERE id = ?`
   - Used for: Getting booking buffer configuration

5. **Supabase Storage**
   - Read: `getPublicUrl()` from `barber-images` bucket
   - Used for: Getting image URLs for barbers and services

### App Code Logic

1. **State Management**
   - React Context (`BookingContext`) for:
     - Barbers list caching
     - Services caching per barber
     - Selected services state
     - Available barber filtering

2. **UI Orchestration**
   - Multi-step wizard navigation
   - Step validation (enable/disable next button)
   - Form data persistence across steps

3. **Data Transformation**
   - Date formatting (Date object → YYYY-MM-DD string)
   - Time formatting (HH:MM → HH:MM:SS)
   - Image URL construction from storage paths
   - Price/duration calculations (sum of selected services)

4. **Business Logic**
   - Last minute booking buffer enforcement (client-side filtering)
   - Past time slot filtering
   - Pre-fetching services when barber is selected
   - Service selection validation (at least one required)
   - Barber filtering based on available services

5. **Error Handling**
   - Try/catch blocks around async operations
   - User-friendly error messages
   - Retry mechanisms

---

## Data Flow Diagram

```
User Selects Barber
    ↓
App: Pre-fetch services (cached in context)
    ↓
User Selects Services
    ↓
App: Calculate total duration
    ↓
User Selects Date
    ↓
App: Calculate duration from services
    ↓
Supabase: available_time_slots RPC (with duration)
    ↓
App: Filter slots by buffer and past times
    ↓
User Selects Time
    ↓
User Clicks Book
    ↓
App: Validate data, format date/time
    ↓
App: Get current user (supabase.auth.getUser())
    ↓
Supabase: book_appointment_v2_text RPC
    ↓
Supabase: Validates availability, creates appointment
    ↓
App: Handle response, navigate to completion
```

---

## Key Database Tables

1. **`barbers`** - Barber information
   - Columns: id, name, image, description, barbershop_id, user_id

2. **`services`** - Service catalog
   - Columns: id, name, price, time (duration), description, image, barbershop_id

3. **`barber_services`** - Junction table (many-to-many)
   - Columns: barber_id, service_id
   - Links barbers to services they offer

4. **`appointments`** - Appointment records
   - Columns: id, barber_id, user_id, date, time, duration, service_ids[], barbershop_id, is_cancelled, etc.

5. **`barbershops`** - Shop configuration
   - Columns: id, last_minute_booking_buffer, etc.

---

## Replication Guide for Web App

### Required Supabase Setup

1. **Database Functions** (must exist in Supabase):
   - `available_time_slots(p_barber_id, p_date, p_duration)` - Returns available time slots
   - `book_appointment_v2_text(...)` - Handles appointment booking

2. **Database Tables** (with proper relationships):
   - `barbers`, `services`, `barber_services`, `appointments`, `barbershops`

3. **Storage Bucket**:
   - `barber-images` - For storing barber and service images

4. **Authentication**:
   - Supabase Auth enabled
   - User authentication required for booking

### App Implementation Checklist

- [ ] Create booking context/state management
- [ ] Implement `fetchBarbers()` - Query barbers table
- [ ] Implement `fetchBarberServices()` - Query barber_services junction
- [ ] Implement `fetchAvailableTimeSlots()` - Call Supabase RPC
- [ ] Implement `fetchLastMinuteBookingBuffer()` - Query barbershops table
- [ ] Implement date/time slot filtering (buffer, past times)
- [ ] Implement `createAppointment()` - Call Supabase RPC
- [ ] Add image URL handling for Supabase Storage
- [ ] Add error handling and validation
- [ ] Add service duration/price calculations
- [ ] Implement caching strategy for barbers/services

---

## Notes

- The app uses React Context for state management - consider similar state management approach
- Services are cached per barber to avoid redundant API calls
- Date selection is limited to next 14 days (client-side logic)
- Time slots are filtered client-side for past times and buffer enforcement, even though Supabase returns availability
- The booking RPC function (`book_appointment_v2_text`) handles all the complex validation and conflict checking server-side
- Image URLs are constructed using Supabase Storage's `getPublicUrl()` method

