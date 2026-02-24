/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        https: false,
        http: false,
      };

      // Handle node: protocol using the provided webpack instance
      if (webpack) {
        config.plugins.push(
          new webpack.NormalModuleReplacementPlugin(
            /^node:/,
            (resource) => {
              resource.request = resource.request.replace(/^node:/, '');
            }
          )
        );
      }
    }
    return config;
  },
};

export default nextConfig;
