import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: mode === "production" ? "0.0.0.0" : "127.0.0.1",
    port: 8080,
    strictPort: false,
    open: mode === "development", // Only open in development
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "date-fns",
      "@radix-ui/react-progress",
      "@radix-ui/react-context",
      "@radix-ui/react-compose-refs",
    ],
    force: true, // Force re-optimization
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: mode === "production" ? false : true, // No sourcemaps in production
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: mode === "production", // Remove console.logs in production
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));
