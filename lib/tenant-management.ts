import { createClient } from '@/utils/supabase/server';
import { tenantContext } from './tenant-context';

export interface TenantConfig {
  id: number;
  name: string;
  subdomain: string;
  settings: {
    slotInterval: number;
    serviceDuration: number;
    maxAdvanceBookingDays: number;
    lastMinuteBookingBuffer: number;
    openingTime: string;
    closingTime: string;
  };
  branding: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

export interface TenantStats {
  totalAppointments: number;
  activeBarbers: number;
  totalServices: number;
  monthlyRevenue: number;
  upcomingAppointments: number;
}

export class TenantManager {
  private async getSupabase() {
    return await createClient();
  }
  
  // Get tenant configuration
  async getTenantConfig(tenantId?: number): Promise<TenantConfig> {
    const tenant = tenantId ? { id: tenantId } : await tenantContext.getTenantContext();
    
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('barbershops')
      .select(`
        id,
        name,
        subdomain,
        slot_interval,
        service_duration,
        max_advance_booking_days,
        last_minute_booking_buffer,
        opening_time,
        closing_time,
        facebook,
        instagram,
        whatsapp
      `)
      .eq('id', tenant.id)
      .single();
    
    if (error || !data) {
      throw new Error('Tenant configuration not found');
    }
    
    return {
      id: data.id,
      name: data.name,
      subdomain: data.subdomain,
      settings: {
        slotInterval: data.slot_interval,
        serviceDuration: data.service_duration,
        maxAdvanceBookingDays: data.max_advance_booking_days,
        lastMinuteBookingBuffer: data.last_minute_booking_buffer,
        openingTime: data.opening_time,
        closingTime: data.closing_time,
      },
      branding: {
        // Add branding fields as needed
      },
      social: {
        facebook: data.facebook,
        instagram: data.instagram,
        whatsapp: data.whatsapp,
      }
    };
  }
  
  // Get tenant statistics
  async getTenantStats(tenantId?: number): Promise<TenantStats> {
    const tenant = tenantId ? { id: tenantId } : await tenantContext.getTenantContext();
    
    const supabase = await this.getSupabase();
    const [
      appointmentsResult,
      barbersResult,
      servicesResult,
      revenueResult,
      upcomingResult
    ] = await Promise.all([
      supabase
        .from('appointments')
        .select('id', { count: 'exact' })
        .eq('barbershop_id', tenant.id),
      
      supabase
        .from('barbers')
        .select('id', { count: 'exact' })
        .eq('barbershop_id', tenant.id),
      
      supabase
        .from('services')
        .select('id', { count: 'exact' })
        .eq('barbershop_id', tenant.id),
      
      supabase
        .from('appointments')
        .select('services(price)')
        .eq('barbershop_id', tenant.id)
        .gte('date', new Date().toISOString().split('T')[0])
        .eq('is_cancelled', false),
      
      supabase
        .from('appointments')
        .select('id', { count: 'exact' })
        .eq('barbershop_id', tenant.id)
        .gte('date', new Date().toISOString().split('T')[0])
        .eq('is_cancelled', false)
    ]);
    
    const monthlyRevenue = revenueResult.data?.reduce((sum, apt) => {
      return sum + (apt.services?.reduce((serviceSum, service) => 
        serviceSum + (service.price || 0), 0) || 0);
    }, 0) || 0;
    
    return {
      totalAppointments: appointmentsResult.count || 0,
      activeBarbers: barbersResult.count || 0,
      totalServices: servicesResult.count || 0,
      monthlyRevenue,
      upcomingAppointments: upcomingResult.count || 0,
    };
  }
  
  // Update tenant configuration
  async updateTenantConfig(updates: Partial<TenantConfig>): Promise<void> {
    const tenant = await tenantContext.getTenantContext();
    
    const updateData: any = {};
    
    if (updates.settings) {
      updateData.slot_interval = updates.settings.slotInterval;
      updateData.service_duration = updates.settings.serviceDuration;
      updateData.max_advance_booking_days = updates.settings.maxAdvanceBookingDays;
      updateData.last_minute_booking_buffer = updates.settings.lastMinuteBookingBuffer;
      updateData.opening_time = updates.settings.openingTime;
      updateData.closing_time = updates.settings.closingTime;
    }
    
    if (updates.social) {
      updateData.facebook = updates.social.facebook;
      updateData.instagram = updates.social.instagram;
      updateData.whatsapp = updates.social.whatsapp;
    }
    
    const supabase = await this.getSupabase();
    const { error } = await supabase
      .from('barbershops')
      .update(updateData)
      .eq('id', tenant.id);
    
    if (error) {
      throw new Error(`Failed to update tenant configuration: ${error.message}`);
    }
    
    // Clear tenant cache
    tenantContext.clearTenantCache(tenant.id);
  }
  
  // Create new tenant
  async createTenant(tenantData: {
    name: string;
    subdomain: string;
    ownerId: string;
  }): Promise<number> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('barbershops')
      .insert({
        name: tenantData.name,
        subdomain: tenantData.subdomain,
        slot_interval: 30,
        service_duration: 30,
        max_advance_booking_days: 30,
        last_minute_booking_buffer: 30,
        opening_time: '09:00',
        closing_time: '18:00'
      })
      .select('id')
      .single();
    
    if (error) {
      throw new Error(`Failed to create tenant: ${error.message}`);
    }
    
    // Update owner profile
    await supabase
      .from('profiles')
      .update({ 
        barbershop_id: data.id,
        role: 'admin',
        is_admin: true 
      })
      .eq('id', tenantData.ownerId);
    
    return data.id;
  }
  
  // Check if subdomain is available
  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('barbershops')
      .select('id')
      .eq('subdomain', subdomain)
      .single();
    
    return !data && !error;
  }
  
  // Get tenant by subdomain
  async getTenantBySubdomain(subdomain: string): Promise<TenantConfig | null> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('barbershops')
      .select('*')
      .eq('subdomain', subdomain)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      subdomain: data.subdomain,
      settings: {
        slotInterval: data.slot_interval,
        serviceDuration: data.service_duration,
        maxAdvanceBookingDays: data.max_advance_booking_days,
        lastMinuteBookingBuffer: data.last_minute_booking_buffer,
        openingTime: data.opening_time,
        closingTime: data.closing_time,
      },
      branding: {},
      social: {
        facebook: data.facebook,
        instagram: data.instagram,
        whatsapp: data.whatsapp,
      }
    };
  }
}

export const tenantManager = new TenantManager();
