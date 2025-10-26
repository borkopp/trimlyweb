# Production Deployment Guide

## Overview

This guide covers deploying the Fadely multi-tenant barbershop management application to production.

## Prerequisites

- Node.js 18+ 
- Supabase project with production database
- Domain with wildcard DNS configured
- SSL certificate (handled by hosting platform)

## Environment Setup

### 1. Environment Variables

Copy `.env.production.example` to `.env.production` and configure:

```bash
cp .env.production.example .env.production
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `NEXT_PUBLIC_APP_URL`: Your production domain (e.g., https://fadely.app)

### 2. Database Setup

Run the following migrations in your production Supabase database:

```sql
-- Apply the tenant functions migration
-- (Already applied during development)
```

### 3. DNS Configuration

Configure wildcard DNS for your domain:
- `*.fadely.app` → Your hosting platform
- `fadely.app` → Your hosting platform

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Add all variables from `.env.production` in Vercel dashboard
   - Set `NODE_ENV=production`

3. **Configure Domain**
   - Add `fadely.app` as custom domain
   - Configure wildcard subdomain support

### Option 2: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   
   # Install dependencies
   COPY package.json package-lock.json* ./
   RUN npm ci --only=production
   
   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   
   # Build the application
   RUN npm run build
   
   # Production image, copy all the files and run next
   FROM base AS runner
   WORKDIR /app
   
   ENV NODE_ENV production
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   
   EXPOSE 3000
   
   ENV PORT 3000
   
   CMD ["node", "server.js"]
   ```

2. **Build and Deploy**
   ```bash
   docker build -t fadely-app .
   docker run -p 3000:3000 fadely-app
   ```

## Production Optimizations

### 1. Performance

- **Caching**: Tenant cache is optimized with TTL and automatic cleanup
- **Static Assets**: Proper cache headers for images and static files
- **Rate Limiting**: 100 requests per minute per IP
- **Redirect Protection**: Max 3 redirects per 30 seconds

### 2. Security

- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Tenant Isolation**: Proper RLS policies in database
- **Cookie Security**: HttpOnly, SameSite, secure cookies

### 3. Monitoring

- **Error Logging**: Console errors are logged
- **Performance**: Vercel Analytics (if enabled)
- **User Analytics**: PostHog (if configured)

## Post-Deployment Checklist

- [ ] Verify main domain loads correctly
- [ ] Test subdomain creation and access
- [ ] Verify authentication flow
- [ ] Test rate limiting
- [ ] Check security headers
- [ ] Verify database connections
- [ ] Test file uploads (if applicable)
- [ ] Monitor error logs

## Troubleshooting

### Common Issues

1. **Subdomain not working**
   - Check DNS configuration
   - Verify wildcard DNS is set up
   - Check hosting platform subdomain support

2. **Database connection errors**
   - Verify Supabase credentials
   - Check database URL and keys
   - Ensure RLS policies are applied

3. **Rate limiting issues**
   - Adjust rate limits in `proxy.ts`
   - Check for legitimate traffic patterns
   - Monitor for abuse

### Monitoring

- Check Vercel/your hosting platform logs
- Monitor Supabase dashboard for database performance
- Set up alerts for error rates and response times

## Scaling Considerations

- **Database**: Consider read replicas for high traffic
- **Caching**: Implement Redis for distributed caching
- **CDN**: Use CloudFlare or similar for static assets
- **Load Balancing**: Multiple instances for high availability

## Security Best Practices

- Regular security updates
- Monitor for suspicious activity
- Implement proper backup strategies
- Use environment-specific configurations
- Regular security audits
