/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add any other config options here
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
