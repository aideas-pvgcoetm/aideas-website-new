import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals]),
        '@splinetool/react-spline',
        '@splinetool/runtime',
      ];
    }
    config.resolve.conditionNames = ['import', 'require', 'node', 'default', '...'];
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /(\.wasm|draco_decoder|draco_wasm_wrapper|boolean_wasm_bg)/,
      })
    );
    return config;
  },
};

export default nextConfig;
