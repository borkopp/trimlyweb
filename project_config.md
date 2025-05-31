# project_config.md

Last-Updated: 2025-05-30

## Project Goal

Modern Dashboard for barbershop management, where the user can manage appointments, barbers, services, and see a lot of analytics, clients, with real-time updates that use the same backend/database as the react-native app (where the clients book their appointments)

## Tech Stack

- **Framework(s):** Next.js 15, React 19, Tailwind CSS, shadcn, Supabase
- **Build:** bun run build

## Critical Patterns & Conventions

- Focus on clean UI and smooth UX. All components are based on shadcn
- If you are unsure about the database structure, use the Supabase MCP, project id: rvrxlaqklacvhovaobel
- If you need any docs use context7 MCP
- Favour using React Server Components and Next.js SSR features where possible
- Minimize the usage of client components ('use client') to small, isolated components
- Always add loading and error states to data fetching components
- Implement error handling and error logging
- Always use kebab-case for component names (e.g. my-component.tsx)

## Constraints

- dont run build command
- dont run run dev command

## Tokenization Settings

- Estimated chars-per-token: 3.5
- Max tokens per message: 8 000
- Plan for summary when **workflow_state.md** exceeds ~12 K chars.

---

## Changelog

- Implemented spotlight-like command palette with Cmd+J toggle featuring dark mode toggle (Cmd+D), quick navigation, and useful dashboard actions using exact shadcn/ui styling
- Implemented shadcn/ui Command palette with global keyboard shortcuts for Quick Actions (Cmd/Ctrl+B for Book Appointment, Cmd/Ctrl+Shift+F for Search Client) and comprehensive navigation commands throughout dashboard
- Implemented real-time appointment notification system in dashboard header with Bell icon, unread count badge, and dropdown showing appointments booked via mobile app
- Created SearchClientDialog component with smooth UX, debounced search, profile pictures/initials fallback, and integrated it into QuickActions for seamless client search throughout the app
- Replaced calendar dummy data with real barbershop appointments using Supabase realtime for live updates without page refresh
