'use server';

/**
 * A utility function to make fetch requests with Next.js cache tags
 * This allows us to easily revalidate specific data with revalidateTag
 */
export async function fetchWithTags<T>(url: string, options: RequestInit = {}, tags: string[] = []): Promise<T> {
  const response = await fetch(url, {
    ...options,
    next: {
      tags: tags,
      revalidate: 0 // Disable caching for this route
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
  }

  return await response.json() as T;
} 