/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'modelscope.cn',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    MODELSCOPE_API_TOKEN: process.env.MODELSCOPE_API_TOKEN,
  },
}

module.exports = nextConfig