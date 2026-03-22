import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_INTERNAL_URL || "http://flight_dashboard_backend:8001"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
