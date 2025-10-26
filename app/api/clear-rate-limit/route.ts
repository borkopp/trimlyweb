import { NextResponse } from 'next/server';

export async function POST() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  // Clear rate limit cache
  // Note: This is a simple implementation. In a real app, you'd want to store
  // rate limit data in a shared cache like Redis
  console.log('[API] Rate limit cache cleared');
  
  return NextResponse.json({ 
    message: 'Rate limit cache cleared',
    timestamp: new Date().toISOString()
  });
}

