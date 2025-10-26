#!/usr/bin/env node

// Simple script to clear rate limit cache in development
// Usage: node scripts/clear-rate-limit.js

const fetch = require('node-fetch');

async function clearRateLimit() {
  try {
    const response = await fetch('http://localhost:3000/api/clear-rate-limit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Rate limit cache cleared:', data.message);
    } else {
      console.error('❌ Failed to clear rate limit cache:', response.statusText);
    }
  } catch (error) {
    console.error('❌ Error clearing rate limit cache:', error.message);
  }
}

clearRateLimit();

