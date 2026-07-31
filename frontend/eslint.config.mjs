import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ข้ามการตรวจ ESLint ตอนกด Build บน Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ข้ามการตรวจ TypeScript Error ตอนกด Build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;