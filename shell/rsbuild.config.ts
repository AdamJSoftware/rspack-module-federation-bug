import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 3000,
    publicDir: {
      name: "public",
      copyOnBuild: true,
    }
  },
  dev: {
    liveReload: true,
    hmr: true,
    assetPrefix: true,
  },
});
