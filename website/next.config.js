/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "horizonventures.ankurboyed.com" }],
        destination: "/horizonventures/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
