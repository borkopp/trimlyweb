'use client';

import { createClient } from "@/utils/supabase/client";

/**
 * Checks if Supabase Realtime is properly configured for a table
 * @param table The table name to check
 * @returns A promise that resolves to true if Realtime is enabled, false otherwise
 */
export async function checkRealtimeEnabled(table: string): Promise<boolean> {
  const supabase = createClient();
  
  try {
    // Create a temporary channel to test Realtime capability
    const channel = supabase
      .channel(`check-realtime-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
        },
        () => {}
      )
      .subscribe();
      
    // Wait for the channel to connect
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check channel status
    const status = channel.state;
    
    // Clean up temporary channel
    channel.unsubscribe();
    
    return status === 'joined';
  } catch (error) {
    console.error('Error checking Realtime status:', error);
    return false;
  }
} 