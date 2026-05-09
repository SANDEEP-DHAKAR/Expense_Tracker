import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // safe for static hosting (Render / Netlify / GH Pages)
  base: "./",

  optimizeDeps: {
    include: ["react", "react-dom"],
  },

  build: {
    assetsDir: "assets",
    sourcemap: false,

    rollupOptions: {
      output: {
        // FIX: proper chunk splitting for performance
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },

    chunkSizeWarningLimit: 1000,
  },
});