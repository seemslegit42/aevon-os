/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'https://6000-firebase-studio-1750373577120.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev',
    ],
  },
};

module.exports = nextConfig;
