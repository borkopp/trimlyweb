/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{hostname: "rvrxlaqklacvhovaobel.supabase.co"}],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
