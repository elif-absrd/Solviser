module.exports = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  outputFileTracingRoot: process.cwd(),
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
}
