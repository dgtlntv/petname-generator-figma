import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
    plugins: [react(), viteSingleFile()],

    build: {
        rollupOptions: {
            input: {
                ui: path.resolve(__dirname, "src/app/index.html"),
                code: path.resolve(__dirname, "src/plugin/controller.ts"),
            },
            output: {
                entryFileNames: "[name].js",
            },
        },
        outDir: "dist",
        cssCodeSplit: false,
        assetsInlineLimit: Infinity,
    },

    css: {
        modules: {
            localsConvention: "camelCase",
        },
        preprocessorOptions: {
            scss: {},
        },
    },

    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js"],
    },

    server: {
        port: 3000,
    },
})
