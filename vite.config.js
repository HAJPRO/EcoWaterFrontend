import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  darkMode: "class", // yoki 'media'
  server: {
    host: "0.0.0.0",
    port: 5173, // kerakli port
  },
  base: "/", // bu to‘g‘ri
  define: {
    "process.env": {}, // yoki "import.meta.env" ni ishlatishingiz mumkin
  },
  plugins: [
    vue(), // JSON uchun alohida plugin kerak emas
  ],
  resolve: {
    alias: [
      {
        find: /^~(.*)/, // ~ prefiksni olib tashlaydi
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
      // katta JSON fayllarni external qilish mumkin
      external: ["emoji-mart-vue-fast/data/all.json"],
    },
  },
});