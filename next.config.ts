import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      // Medusa's demo seed data serves product images from this S3 bucket.
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      // Self-hosted Medusa backends commonly serve uploaded product images
      // directly from the backend itself.
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
      },
      // No Medusa file-storage provider is configured yet (see the
      // integration report), so the seeded Saturn V poster product
      // references its images directly from the already-cloned frontend
      // assets served by this Next.js app itself, rather than uploading
      // them into Medusa. Dev-only convenience — see report for the
      // production-readiness note.
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ],
    // Both localhost:3000 and localhost:9000 (Medusa's file-local provider,
    // used for the imported poster images — see IMPORT.md in the backend
    // repo) resolve to the loopback IP 127.0.0.1. Next.js blocks the image
    // optimizer from fetching any private/loopback IP by default as an SSRF
    // guard, independent of remotePatterns. This is purely a local-dev
    // artifact of frontend and backend both running on localhost; a real
    // deployment would serve images from a public S3/CDN URL (a public IP),
    // which never hits this check, so this flag would not be needed there.
    dangerouslyAllowLocalIP: true,
  },
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
