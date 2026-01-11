/** @type {import('next').NextConfig} */
const nextConfig = {
  // Run on port 3001 to avoid conflict with backend
  async redirects() {
    return [];
  },
};

export default nextConfig;
