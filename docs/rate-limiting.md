# Rate Limiting Configuration

## Overview

The application includes rate limiting to prevent abuse and ensure fair usage. Rate limiting is configured differently for development and production environments.

## Development vs Production

### Development Mode
- **Rate Limiting**: **DISABLED** for easier testing and development
- **Redirect Limiting**: **DISABLED** for easier testing and development
- **Debug Logging**: Enabled to help with debugging

### Production Mode
- **Rate Limiting**: **ENABLED** - 100 requests per minute per IP
- **Redirect Limiting**: **ENABLED** - 3 redirects per 30 seconds per IP
- **Debug Logging**: Disabled for performance

## Rate Limiting Details

### Request Rate Limiting
- **Window**: 1 minute (60 seconds)
- **Limit**: 100 requests per minute per IP (production)
- **Limit**: 500 requests per minute per IP (development - when enabled)
- **Storage**: In-memory Map (resets on server restart)

### Redirect Rate Limiting
- **Window**: 30 seconds
- **Limit**: 3 redirects per 30 seconds per IP
- **Purpose**: Prevents redirect loops and abuse

## Troubleshooting

### Getting 429 (Too Many Requests) Errors

1. **In Development**: Rate limiting is disabled, so this shouldn't happen
2. **In Production**: You've exceeded the rate limit

### Solutions

#### For Development
```bash
# Restart the development server
npm run dev

# Or clear the rate limit cache (if enabled)
npm run clear-rate-limit
```

#### For Production
- Wait for the rate limit window to reset (1 minute)
- Implement proper request throttling in your client code
- Consider implementing exponential backoff

## Configuration

Rate limiting settings are in `proxy.ts`:

```typescript
// Rate limiting - more lenient for development
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = process.env.NODE_ENV === 'development' ? 500 : 100;

// Redirect limiting
const REDIRECT_LIMIT_WINDOW = 30000; // 30 seconds
const MAX_REDIRECTS = 3; // Max 3 redirects per 30 seconds
```

## Monitoring

### Development
- Rate limit events are logged to console
- Use browser dev tools to monitor requests

### Production
- Monitor server logs for rate limit events
- Consider implementing proper logging and monitoring

## Best Practices

1. **Client-Side Throttling**: Implement request throttling in your client code
2. **Exponential Backoff**: Retry failed requests with increasing delays
3. **User Feedback**: Show appropriate error messages to users
4. **Monitoring**: Monitor rate limit hits in production

## Disabling Rate Limiting

### For Development
Rate limiting is automatically disabled in development mode.

### For Production (Not Recommended)
```typescript
// In proxy.ts, comment out the rate limit checks:
// if (process.env.NODE_ENV !== 'development' && !checkRateLimit(ip)) {
//   return new NextResponse('Too Many Requests', { status: 429 });
// }
```

**Warning**: Disabling rate limiting in production can lead to abuse and performance issues.

