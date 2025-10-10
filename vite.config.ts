import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    host: true, // Permite acesso de qualquer host
    port: 5173,
    strictPort: false,
  },
  preview: {
    host: true, // Permite acesso de qualquer host
    port: 5173,
    strictPort: false,
  },
});
