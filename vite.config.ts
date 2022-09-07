import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/interactive-rating-component/",
    resolve: {
      alias: {
        "@components": resolve(__dirname, "src/components"),
        "@images": resolve(__dirname, "src/images"),
        "@styles": resolve(__dirname, "src/styles"),
      },
    },
});