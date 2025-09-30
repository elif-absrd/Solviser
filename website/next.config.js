/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  
  // We need to add a custom headers configuration to allow the Google OAuth popup to work.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups', // This is the key to fixing the issue
          },
        ],
      },
    ];
  },
};