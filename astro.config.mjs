// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    build: {
      target: "esnext",
      charset: "utf-8", // 👈 fuerza la codificación UTF-8 en el build
    },
    plugins: [tailwindcss()],
  },
});
