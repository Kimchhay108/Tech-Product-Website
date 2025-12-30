/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add any other config options here
  images: {
    domains: ['res.cloudinary.com'], // add your Cloudinary hostname here
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
