/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data:; " +
              "connect-src 'self' https://*.thirdweb.com wss://*.thirdweb.com https://rpc.base.org https://sepolia.base.org; " +
              "frame-src 'self' https://*.thirdweb.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
