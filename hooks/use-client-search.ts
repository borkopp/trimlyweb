import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

type Client = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
};

export function useClientSearch(searchQuery: string, debounceMs = 300) {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, debounceMs]);

  // Only search if we have at least 1 character
  const shouldSearch = debouncedQuery.trim().length > 0;

  return useQuery({
    queryKey: ["client-search", debouncedQuery],
    queryFn: async () => {
      if (!shouldSearch) return [];

      try {
        const response = await fetch(`/api/clients?search=${encodeURIComponent(debouncedQuery)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to search clients: ${response.statusText}`);
        }

        const data = await response.json();
        return data as Client[];
      } catch (error) {
        console.error("Error searching clients:", error);
        throw error;
      }
    },
    enabled: shouldSearch,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
} 