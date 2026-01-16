import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // outputFileTracingRoot moved out of experimental per Next.js warning
  outputFileTracingRoot: path.join(__dirname, ".."),
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };
    return config;
  },
};

function withBundleAnalyzer(config: NextConfig): NextConfig {
  if (process.env.ANALYZE === "true") {
    const requireFn = eval("require");
    const analyzer = requireFn("@next/bundle-analyzer")({ enabled: true });
    return analyzer(config);
  }
  return config;
}

export default withBundleAnalyzer(nextConfig);
