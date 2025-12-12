import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  darkMode: "class",
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  // Barcha fayllar uchun nisbiy (relative) yo'l
  base: "./", 

  define: {
    "process.env": {}, 
  },
  plugins: [
    vue(), 
  ],
  resolve: {
    alias: [
      {
        find: /^~(.*)/, 
        replacement: (_, s1) => s1,
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: ["emoji-mart-vue-fast/data/all.json"],
    },
  },
});