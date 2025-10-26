/** @type {import('next').NextConfig} */
const nextConfig = {
  // cacheComponents: true, // Temporarily disabled due to dynamic data access issues
  images: {
    remotePatterns: [
      { hostname: "rvrxlaqklacvhovaobel.supabase.co" },
      { hostname: "assets.aceternity.com" },
    ],
  },
  poweredByHeader: false,
  compress: true,
  // PostHog disabled - uncomment to re-enable
  // async rewrites() {
  //   return [
  //     {
  //       source: "/ingest/static/:path*",
  //       destination: "https://eu-assets.i.posthog.com/static/:path*",
  //     },
  //     {
  //       source: "/ingest/:path*",
  //       destination: "https://eu.i.posthog.com/:path*",
  //     },
  //   ];
  // },
  // This is required to support PostHog trailing slash API requests
  // skipTrailingSlashRedirect: true,
};

export default nextConfig;
