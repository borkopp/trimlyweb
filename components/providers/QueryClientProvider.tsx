'use client'

import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export default function QueryClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // During development, invalidate queries every 5 seconds
        staleTime: process.env.NODE_ENV === 'development' ? 5000 : 30000,
        // Keep cached data for 5 minutes
        gcTime: 300000,
      },
    },
  }))

  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  )
}
