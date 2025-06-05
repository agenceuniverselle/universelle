import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { viteStaticCopy } from 'vite-plugin-static-copy'; // 👈

export default defineConfig(({ mode }) => ({
  base: "/",
  build: {
    outDir: "dist",
    sourcemap: true,
  },

  server: mode === "development"
    ? {
        host: "localhost",
        port: 8080,
        proxy: {
          "/api": {
            target: "http://localhost:8000",
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/api/, "/api"),
          },
        },
      }
    : undefined,

  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/_redirects',
          dest: '.', // 👈 copie dans dist/
        },
      ],
    }),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
