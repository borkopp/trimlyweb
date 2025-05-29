/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "rvrxlaqklacvhovaobel.supabase.co" },
      { hostname: "assets.aceternity.com" },
    ],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
