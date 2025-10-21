/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "horizonventures.ankurboyed.com" }],
        destination: "/horizonventures",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
