'use server';

import { headers } from 'next/headers';

/**
 * Server action to get the current barbershop ID
 * This can be safely called from client components
 */
export async function getCurrentBarbershopId(): Promise<string> {
  const headersList = await headers();
  return headersList.get('x-barbershop-id') || '1';
} 