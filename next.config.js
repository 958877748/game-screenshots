/** @type {import('next').NextConfig} */
const nextConfig = {
  regions: ['iad1'], // 强制所有函数在单个区域运行
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