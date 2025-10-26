# PostHog Setup Guide

## Current Status
PostHog is currently **disabled** in the application.

## To Re-enable PostHog

### 1. Uncomment Configuration Files

**`next.config.mjs`**
```javascript
// Uncomment these lines:
async rewrites() {
  return [
    {
      source: "/ingest/static/:path*",
      destination: "https://eu-assets.i.posthog.com/static/:path*",
    },
    {
      source: "/ingest/:path*",
      destination: "https://eu.i.posthog.com/:path*",
    },
  ];
},
skipTrailingSlashRedirect: true,
```

**`instrumentation-client.ts`**
```typescript
// Uncomment these lines:
import posthog from "posthog-js"

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://eu.posthog.com",
  defaults: "2025-05-24",
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
});
```

### 2. Set Environment Variables

**`.env.local` (for development)**
```bash
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

**`.env.production` (for production)**
```bash
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

### 3. Restart Development Server

```bash
npm run dev
```

## PostHog Features

When enabled, PostHog provides:
- **User Analytics**: Track user behavior and engagement
- **Event Tracking**: Monitor custom events and conversions
- **Error Tracking**: Automatic exception capture
- **Session Recording**: Record user sessions for debugging
- **Feature Flags**: A/B testing and feature rollouts
- **Heatmaps**: Visual user interaction analysis

## Privacy Considerations

- PostHog is GDPR compliant
- Data is stored in EU servers (eu.i.posthog.com)
- Users can opt-out of tracking
- No personally identifiable information is collected by default

## Cost

- **Free tier**: Up to 1M events/month
- **Paid plans**: Start at $0.00045 per event
- **Self-hosted**: Available for enterprise customers
