import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
      "/auth": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
      "/register": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
      "/actuator": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
    },
  },
});
