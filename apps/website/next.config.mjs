/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@aniways/ui"],
  experimental: {
    ppr: true,
  },
};

export default nextConfig;
