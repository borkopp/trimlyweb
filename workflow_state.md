# workflow_state.md

_Last updated: 2025-05-30_

## State

Phase: VALIDATE  
Status: COMPLETED  
CurrentItem: Replace calendar dummy data with real barbershop appointments using Supabase realtime

## Plan

### Task: Replace @calendar dummy data with real barbershop appointments using Supabase realtime

**Objective:** Integrate real appointment data from the existing Supabase database while maintaining the same UI/styling and adding realtime updates when new appointments are created/modified.

**Database Analysis:**

- `appointments` table: Contains appointment data with date, time, end_time, duration, barber_id, user_id, service_ids
- `barbers` table: Contains barber information (name, image)
- `profiles` table: Contains user/customer information (full_name, avatar_url)
- `services` table: Contains service information (name, description, time, price)

**Implementation Steps:**

1. **Create appointment data transformation utilities**

   - Create `app/(dashboard)/dashboard/calendar/lib/appointment-adapters.ts`
   - Transform database appointment format to calendar IEvent format
   - Handle multiple services per appointment for title/description
   - Map barber data to calendar user format
   - Generate appropriate colors for different appointment types

2. **Update calendar interfaces for real data**

   - Modify `interfaces.ts` to align with database schema if needed
   - Ensure backward compatibility with existing calendar components

3. **Create Supabase appointment queries**

   - Create `app/(dashboard)/dashboard/calendar/lib/supabase-queries.ts`
   - Implement function to fetch appointments with joined barber/customer/service data
   - Include proper date range filtering for calendar views
   - Add barbershop filtering if needed

4. **Create realtime hook for appointments**

   - Create `app/(dashboard)/dashboard/calendar/hooks/use-realtime-appointments.ts`
   - Set up Supabase realtime subscription for appointments table
   - Handle insert/update/delete events for appointments
   - Return loading states and error handling

5. **Update calendar requests layer**

   - Modify `requests.ts` to fetch real appointment data instead of mocks
   - Keep the same function signatures for backward compatibility
   - Add proper error handling and loading states

6. **Update calendar context for realtime**

   - Modify `calendar-context.tsx` to use realtime appointment data
   - Integrate the realtime hook for live updates
   - Maintain existing context API for components

7. **Update calendar layout for real data loading**
   - Modify `layout.tsx` to handle async real data loading
   - Add proper loading and error states
   - Ensure smooth user experience during data fetching

**Key Technical Considerations:**

- Maintain exact same component interfaces to avoid breaking existing UI
- Use Supabase realtime for live appointment updates
- Handle appointment time zones properly
- Map service information to appointment titles/descriptions
- Preserve existing calendar filtering and view functionality
- Add proper error boundaries and loading states

**Expected File Changes:**

- `app/(dashboard)/dashboard/calendar/lib/appointment-adapters.ts` (new)
- `app/(dashboard)/dashboard/calendar/lib/supabase-queries.ts` (new)
- `app/(dashboard)/dashboard/calendar/hooks/use-realtime-appointments.ts` (new)
- `app/(dashboard)/dashboard/calendar/requests.ts` (modify)
- `app/(dashboard)/dashboard/calendar/contexts/calendar-context.tsx` (modify)
- `app/(dashboard)/dashboard/calendar/layout.tsx` (modify)
- `app/(dashboard)/dashboard/calendar/interfaces.ts` (potentially modify)

## Rules

> **Keep every major section under an explicit H2 (`##`) heading so the agent can locate them unambiguously.**

### [PHASE: ANALYZE]

1. Read **project_config.md**, relevant code & docs.
2. Summarize requirements. _No code or planning._

### [PHASE: BLUEPRINT]

1. Decompose task into ordered steps.
2. Write pseudocode or file-level diff outline under **## Plan**.
3. Set `Status = NEEDS_PLAN_APPROVAL` and await user confirmation.

### [PHASE: CONSTRUCT]

1. Follow the approved **## Plan** exactly.
2. After each atomic change:
   - fix linters if any
   - capture tool output in **## Log**
3. On success of all steps, set `Phase = VALIDATE`.

### [PHASE: VALIDATE]

1. If no linter errors, set `Status = COMPLETED`.
2. Trigger **RULE_ITERATE_01** when applicable.

---

### RULE_INIT_01

Trigger ▶ `Phase == INIT`  
Action ▶ Ask user for first high-level task → `Phase = ANALYZE, Status = RUNNING`.

### RULE_ITERATE_01

Trigger ▶ `Status == COMPLETED && Items contains unprocessed rows`  
Action ▶

1. Set `CurrentItem` to next unprocessed row in **## Items**.
2. Clear **## Log**, reset `Phase = ANALYZE, Status = READY`.

### RULE_LOG_ROTATE_01

Trigger ▶ `length(## Log) > 5 000 chars`  
Action ▶ Summarise the top 5 findings from **## Log** into **## ArchiveLog**, then clear **## Log**.

### RULE_SUMMARY_01

Trigger ▶ `Phase == VALIDATE && Status == COMPLETED`  
Action ▶

1. Read `project_config.md`.
2. Construct the new changelog line: `- <One-sentence summary of completed work>`.
3. Find the `## Changelog` heading in `project_config.md`.
4. Insert the new changelog line immediately after the `## Changelog` heading and its following newline (making it the new first item in the list).

---

## Items

| id  | description | status |
| --- | ----------- | ------ |

## Log

✅ **Step 1: Created appointment data transformation utilities**

- Created `app/(dashboard)/dashboard/calendar/lib/appointment-adapters.ts`
- Implemented functions to transform database appointment format to calendar IEvent format
- Added proper color mapping for different service types
- Added title/description generation from multiple services
- Added barber-to-user transformation functions

✅ **Step 2: Created Supabase appointment queries**

- Created `app/(dashboard)/dashboard/calendar/lib/supabase-queries.ts`
- Implemented `fetchAppointments()` with proper joins for barber/customer data
- Implemented `fetchBarbers()` and `fetchServices()` functions
- Added date range filtering for calendar views
- Fixed TypeScript errors with proper typing

✅ **Step 3: Created realtime hook for appointments**

- Created `app/(dashboard)/dashboard/calendar/hooks/use-realtime-appointments.ts`
- Set up Supabase realtime subscription for appointments table
- Added automatic refetch on appointment changes
- Included loading states and error handling
- Added barbershop filtering support

✅ **Step 4: Updated calendar requests layer**

- Modified `app/(dashboard)/dashboard/calendar/requests.ts`
- Replaced mock data with real Supabase queries
- Maintained backward compatibility with existing function signatures
- Added proper error handling

✅ **Step 5: Updated calendar context for realtime**

- Modified `app/(dashboard)/dashboard/calendar/contexts/calendar-context.tsx`
- Integrated useRealtimeAppointments hook
- Added loading, error states, and refetch function to context
- Removed events parameter from provider (now handled by realtime hook)

✅ **Step 6: Updated calendar layout**

- Modified `app/(dashboard)/dashboard/calendar/layout.tsx`
- Removed events fetching (now handled by realtime hook)
- Kept users fetching for barber selection

✅ **Step 7: Added loading and error states**

- Modified `app/(dashboard)/dashboard/calendar/components/client-container.tsx`
- Added loading spinner during data fetch
- Added error display with retry functionality
- Maintained existing UI structure for successful states

## ArchiveLog

<!-- RULE_LOG_ROTATE_01 stores condensed summaries here -->
