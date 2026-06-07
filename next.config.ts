import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  // Hide the framework fingerprint
  poweredByHeader: false,

  // Never expose source maps to the browser in production
  productionBrowserSourceMaps: false,

  // Security headers on every response
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Stop MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Basic XSS protection for older browsers
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // No referrer leakage to third parties
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Restrict powerful browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
