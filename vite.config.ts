import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  // server.proxy is a dev-server-only option — Vite strips this entire block from
  // production builds. In production, /api/* is handled by the Cloudflare edge
  // function (functions/api/[[route]].js), which injects the Authorization header
  // and forwards to Railway. Locally, Spring Boot allows all requests under the
  // "local" profile (LocalSecurityConfig), so no auth header is needed here.
  server: {
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
});
