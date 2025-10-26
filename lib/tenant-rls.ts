import { createClient } from '@/utils/supabase/server';

// Enhanced RLS policies for multi-tenant isolation
export class TenantRLSManager {
  private async getSupabase() {
    return await createClient();
  }
  
  // Apply tenant context to RLS policies
  async applyTenantContext(barbershopId: number) {
    // Set the barbershop_id in the request context
    const supabase = await this.getSupabase();
    await supabase.rpc('set_tenant_context', { 
      tenant_id: barbershopId 
    });
  }
  
  // Create tenant-specific policies
  async createTenantPolicies() {
    const policies = [
      // Barbershops - only accessible by tenant members
      {
        table: 'barbershops',
        policy: 'tenant_isolation_barbershops',
        command: 'ALL',
        definition: `barbershop_id = current_setting('app.current_tenant_id')::int`
      },
      
      // Profiles - tenant isolation
      {
        table: 'profiles', 
        policy: 'tenant_isolation_profiles',
        command: 'ALL',
        definition: `barbershop_id = current_setting('app.current_tenant_id')::int`
      },
      
      // Appointments - tenant isolation
      {
        table: 'appointments',
        policy: 'tenant_isolation_appointments', 
        command: 'ALL',
        definition: `barbershop_id = current_setting('app.current_tenant_id')::int`
      },
      
      // Services - tenant isolation
      {
        table: 'services',
        policy: 'tenant_isolation_services',
        command: 'ALL', 
        definition: `barbershop_id = current_setting('app.current_tenant_id')::int`
      },
      
      // Barbers - tenant isolation
      {
        table: 'barbers',
        policy: 'tenant_isolation_barbers',
        command: 'ALL',
        definition: `barbershop_id = current_setting('app.current_tenant_id')::int`
      }
    ];
    
    for (const policy of policies) {
      await this.createRLSPolicy(policy);
    }
  }
  
  private async createRLSPolicy(policy: any) {
    const supabase = await this.getSupabase();
    const { error } = await supabase.rpc('create_tenant_policy', {
      table_name: policy.table,
      policy_name: policy.policy,
      command: policy.command,
      definition: policy.definition
    });
    
    if (error) {
      console.error(`Failed to create policy for ${policy.table}:`, error);
    }
  }
}

// Database functions for tenant context
export const tenantRLSFunctions = `
-- Function to set tenant context
CREATE OR REPLACE FUNCTION set_tenant_context(tenant_id int)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', tenant_id::text, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current tenant
CREATE OR REPLACE FUNCTION get_current_tenant()
RETURNS int AS $$
BEGIN
  RETURN current_setting('app.current_tenant_id')::int;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create tenant policies
CREATE OR REPLACE FUNCTION create_tenant_policy(
  table_name text,
  policy_name text, 
  command text,
  definition text
)
RETURNS void AS $$
BEGIN
  EXECUTE format('
    DROP POLICY IF EXISTS %I ON %I;
    CREATE POLICY %I ON %I FOR %s TO authenticated USING (%s);
  ', policy_name, table_name, policy_name, table_name, command, definition);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

export const tenantRLSManager = new TenantRLSManager();
