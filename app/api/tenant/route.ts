import { NextRequest, NextResponse } from 'next/server';
import { tenantManager } from '@/lib/tenant-management';
import { createTenantClient } from '@/utils/supabase/tenant-client';

// GET /api/tenant - Get current tenant information
export async function GET(request: NextRequest) {
  try {
    const client = await createTenantClient();
    const tenant = await tenantManager.getTenantConfig();
    const stats = await tenantManager.getTenantStats();
    
    return NextResponse.json({
      tenant,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching tenant data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenant data' },
      { status: 500 }
    );
  }
}

// PUT /api/tenant - Update tenant configuration
export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json();
    await tenantManager.updateTenantConfig(updates);
    
    return NextResponse.json({ 
      success: true,
      message: 'Tenant configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating tenant:', error);
    return NextResponse.json(
      { error: 'Failed to update tenant configuration' },
      { status: 500 }
    );
  }
}

// POST /api/tenant - Create new tenant
export async function POST(request: NextRequest) {
  try {
    const { name, subdomain, ownerId } = await request.json();
    
    // Validate required fields
    if (!name || !subdomain || !ownerId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, subdomain, ownerId' },
        { status: 400 }
      );
    }
    
    // Check if subdomain is available
    const isAvailable = await tenantManager.isSubdomainAvailable(subdomain);
    if (!isAvailable) {
      return NextResponse.json(
        { error: 'Subdomain is already taken' },
        { status: 409 }
      );
    }
    
    // Create tenant
    const tenantId = await tenantManager.createTenant({
      name,
      subdomain,
      ownerId
    });
    
    return NextResponse.json({
      success: true,
      tenantId,
      message: 'Tenant created successfully'
    });
  } catch (error) {
    console.error('Error creating tenant:', error);
    return NextResponse.json(
      { error: 'Failed to create tenant' },
      { status: 500 }
    );
  }
}
