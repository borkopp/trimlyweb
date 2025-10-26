import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export interface TenantContext {
  id: number;
  subdomain: string;
  name: string;
  isMainDomain: boolean;
}

export interface TenantUser {
  id: string;
  barbershopId: number;
  role: string;
  isAdmin: boolean;
  fullName?: string;
  email?: string;
}

// Enhanced tenant context with caching
class TenantContextManager {
  private static instance: TenantContextManager;
  private cache = new Map<string, { context: TenantContext; expires: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): TenantContextManager {
    if (!TenantContextManager.instance) {
      TenantContextManager.instance = new TenantContextManager();
    }
    return TenantContextManager.instance;
  }

  async getTenantContext(): Promise<TenantContext> {
    const headersList = await headers();
    const hostname = headersList.get('host') || '';
    const barbershopId = headersList.get('x-barbershop-id');
    const subdomain = headersList.get('x-tenant-subdomain');
    
    // Check if it's main domain
    const isMainDomain = ['fadely.app', 'www.fadely.app', 'localhost:3000', 'localhost'].includes(hostname);
    
    if (isMainDomain) {
      return {
        id: 0,
        subdomain: 'main',
        name: 'Fadely',
        isMainDomain: true
      };
    }
    
    if (!barbershopId || !subdomain) {
      throw new Error('Tenant context not found');
    }
    
    const cacheKey = `tenant:${barbershopId}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() < cached.expires) {
      return cached.context;
    }
    
    // Fetch tenant data
    const supabase = await createClient();
    const { data: tenant, error } = await supabase
      .from('barbershops')
      .select('id, name, subdomain')
      .eq('id', parseInt(barbershopId))
      .single();
    
    if (error || !tenant) {
      throw new Error('Tenant not found');
    }
    
    const context: TenantContext = {
      id: tenant.id,
      subdomain: tenant.subdomain,
      name: tenant.name,
      isMainDomain: false
    };
    
    this.cache.set(cacheKey, {
      context,
      expires: Date.now() + this.CACHE_TTL
    });
    
    return context;
  }
  
  async getTenantUser(): Promise<TenantUser | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, barbershop_id, role, is_admin, full_name, email')
      .eq('id', user.id)
      .single();
    
    if (!profile) {
      return null;
    }
    
    return {
      id: profile.id,
      barbershopId: profile.barbershop_id,
      role: profile.role,
      isAdmin: profile.is_admin || false,
      fullName: profile.full_name,
      email: profile.email
    };
  }
  
  clearCache() {
    this.cache.clear();
  }
  
  clearTenantCache(barbershopId: number) {
    this.cache.delete(`tenant:${barbershopId}`);
  }
}

export const tenantContext = TenantContextManager.getInstance();

// Hook for components to access tenant context
export async function useTenantContext(): Promise<TenantContext> {
  return await tenantContext.getTenantContext();
}

export async function useTenantUser(): Promise<TenantUser | null> {
  return await tenantContext.getTenantUser();
}

// Utility functions
export function isMainDomain(hostname: string): boolean {
  return ['fadely.app', 'www.fadely.app', 'localhost:3000', 'localhost'].includes(hostname);
}

export function extractSubdomain(hostname: string): string | null {
  if (hostname.includes('.fadely.app') || hostname.includes('.localhost')) {
    const subdomain = hostname.split('.')[0];
    return subdomain === 'www' ? null : subdomain;
  }
  return null;
}
