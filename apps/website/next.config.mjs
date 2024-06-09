/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: '**',
      },
    ],
  },
  experimental: {
    ppr: true,
    reactCompiler: true,
  },
};

export default nextConfig;
