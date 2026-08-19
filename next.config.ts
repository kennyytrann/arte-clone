import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/collections/best-sellers/products/saturn-v-beige",
        destination: "/products/saturn-v-beige",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
