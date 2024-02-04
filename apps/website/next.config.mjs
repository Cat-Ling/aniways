/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@aniways/ui'],
  experimental: {
    ppr: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
