import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { tenantContext } from "@/lib/tenant-context";

// Enhanced Supabase client with tenant context
export async function createTenantClient() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Extract domain for cookie settings
  const domain = isDevelopment ? 'localhost' : host.split(':')[0].split('.').slice(-2).join('.');
  
  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              domain: isDevelopment ? undefined : `.${domain}`,
              secure: !isDevelopment,
              httpOnly: true,
              sameSite: 'lax',
              path: '/',
            });
          } catch (error) {
            // Ignore errors in server components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value: "",
              ...options,
              domain: isDevelopment ? undefined : `.${domain}`,
              secure: !isDevelopment,
              httpOnly: true,
              sameSite: 'lax',
              path: '/',
              maxAge: 0,
            });
          } catch (error) {
            // Ignore errors in server components
          }
        },
      },
    }
  );
  
  // Apply tenant context if available
  try {
    const tenant = await tenantContext.getTenantContext();
    if (!tenant.isMainDomain) {
      await client.rpc('set_tenant_context', { 
        tenant_id: tenant.id 
      });
    }
  } catch (error) {
    // Tenant context not available, continue without it
    console.warn('Tenant context not available:', error);
  }
  
  return client;
}

// Tenant-aware query builder
export class TenantQueryBuilder {
  private client: any;
  private tenantId: number | null = null;
  
  constructor(client: any, tenantId?: number) {
    this.client = client;
    this.tenantId = tenantId || null;
  }
  
  // Automatically add tenant filter to queries
  from(table: string) {
    const query = this.client.from(table);
    
    if (this.tenantId) {
      return query.eq('barbershop_id', this.tenantId);
    }
    
    return query;
  }
  
  // Get appointments for current tenant
  async getAppointments(filters?: any) {
    const query = this.from('appointments')
      .select(`
        *,
        client:profiles!appointments_user_id_fkey(*),
        barber:barbers!appointments_barber_id_fkey(*),
        services:service_appointments(
          services(*)
        )
      `);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query.eq(key, value);
      });
    }
    
    return query;
  }
  
  // Get services for current tenant
  async getServices() {
    return this.from('services').select('*').order('name');
  }
  
  // Get barbers for current tenant
  async getBarbers() {
    return this.from('barbers').select('*').order('name');
  }
  
  // Get clients for current tenant
  async getClients() {
    return this.from('profiles')
      .select(`
        *,
        appointments(
          id,
          date,
          time,
          is_cancelled
        )
      `)
      .not('id', 'in', `(SELECT user_id FROM barbers WHERE barbershop_id = ${this.tenantId})`)
      .order('full_name');
  }
}

// Factory function for tenant-aware queries
export async function createTenantQueryBuilder() {
  const client = await createTenantClient();
  const tenant = await tenantContext.getTenantContext();
  
  return new TenantQueryBuilder(client, tenant.isMainDomain ? undefined : tenant.id);
}
