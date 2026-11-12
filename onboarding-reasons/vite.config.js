import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Relative asset paths so the build works under GitHub Pages' /<repo>/ subpath.
  base: "./",
  plugins: [react(), tailwindcss()],
  // The homepage lives in ../traveler-mode; use this app's React for it and let the dev server read it.
  resolve: { dedupe: ["react", "react-dom"] },
  server: { fs: { allow: [".."] } },
});
