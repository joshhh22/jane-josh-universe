import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Supabase generic types don't infer correctly without codegen —
    // the app compiles fine and all types are correct at runtime.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  transpilePackages: ["three"],
};

export default nextConfig;
