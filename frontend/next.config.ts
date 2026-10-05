import type { NextConfig } from "next";

// Polyfill Node 22 experimental broken localStorage global object
if (typeof globalThis !== 'undefined') {
  try {
    if (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== 'function') {
      const storageMap = new Map<string, string>();
      const mockLocalStorage = {
        getItem: (key: string) => storageMap.get(String(key)) ?? null,
        setItem: (key: string, value: string) => { storageMap.set(String(key), String(value)); },
        removeItem: (key: string) => { storageMap.delete(String(key)); },
        clear: () => { storageMap.clear(); },
        key: (index: number) => Array.from(storageMap.keys())[index] ?? null,
        get length() { return storageMap.size; },
      };
      Object.defineProperty(globalThis, 'localStorage', {
        value: mockLocalStorage,
        configurable: true,
        writable: true,
      });
    }
  } catch {}
}

const nextConfig: NextConfig = {
  // Turbopack configuration for Next.js 16
  turbopack: {},
  // Prevent worker memory crash during static export/page generation
  typescript: {
    ignoreBuildErrors: true,
  },
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