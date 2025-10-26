import { NextRequest, NextResponse } from 'next/server';
import { tenantManager } from '@/lib/tenant-management';

// GET /api/tenant/check-subdomain?subdomain=example
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain');
    
    if (!subdomain) {
      return NextResponse.json(
        { error: 'Subdomain parameter is required' },
        { status: 400 }
      );
    }
    
    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    if (!subdomainRegex.test(subdomain) || subdomain.length < 3 || subdomain.length > 30) {
      return NextResponse.json({
        available: false,
        error: 'Invalid subdomain format. Must be 3-30 characters, lowercase letters, numbers, and hyphens only.'
      });
    }
    
    // Check reserved subdomains
    const reservedSubdomains = [
      'www', 'api', 'admin', 'app', 'dashboard', 'login', 'register',
      'support', 'help', 'docs', 'blog', 'news', 'mail', 'email',
      'ftp', 'smtp', 'pop', 'imap', 'webmail', 'cpanel', 'whm',
      'ns1', 'ns2', 'ns3', 'ns4', 'dns', 'mx', 'mail', 'pop3',
      'smtp', 'imap', 'webmail', 'cpanel', 'whm', 'ns1', 'ns2'
    ];
    
    if (reservedSubdomains.includes(subdomain.toLowerCase())) {
      return NextResponse.json({
        available: false,
        error: 'This subdomain is reserved and cannot be used.'
      });
    }
    
    // Check availability
    const isAvailable = await tenantManager.isSubdomainAvailable(subdomain);
    
    return NextResponse.json({
      available: isAvailable,
      subdomain,
      message: isAvailable 
        ? 'Subdomain is available' 
        : 'Subdomain is already taken'
    });
  } catch (error) {
    console.error('Error checking subdomain:', error);
    return NextResponse.json(
      { error: 'Failed to check subdomain availability' },
      { status: 500 }
    );
  }
}
