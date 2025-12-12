import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 33731,
    host: true,
    hrm: {
      protocol: "ws",
      host: "localhost",
      port: 33731,
      clientPort: 33731,
    },
  },
});
