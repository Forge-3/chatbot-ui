const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
})

const withPWA = require("next-pwa")({
  dest: "public"
})

module.exports = withBundleAnalyzer(
  withPWA({
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost"
        },
        {
          protocol: "http",
          hostname: "127.0.0.1"
        },
        {
          protocol: "https",
          hostname: "**"
        }
      ]
    },
    experimental: {
      serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
      workerThreads: true,
      cpus: 1
    },
    staticPageGenerationTimeout: 180,
    output: 'standalone',
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          module: false,
        };
      }
      return config;
    }
  })
)
