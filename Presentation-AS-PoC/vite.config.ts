import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // Cambiado de "::" para compatibilidad con Docker
    port: 8080, // Mantén tu puerto original
    watch: {
      usePolling: true, // Necesario para hot-reload en Docker
    },
    hmr: {
      host: 'localhost',
      port: 8080,
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));