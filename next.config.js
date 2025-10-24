/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  output: 'standalone',
  transpilePackages: ['jira.js'],
};

module.exports = nextConfig;
