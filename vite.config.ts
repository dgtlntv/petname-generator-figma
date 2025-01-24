import react from "@vitejs/plugin-react"
import fs from "fs"
import path from "path"
import { defineConfig, Plugin, UserConfig } from "vite"

// Shared configuration
const sharedConfig: UserConfig = {
    plugins: [react()],
    css: {
        modules: {
            localsConvention: "camelCase" as const,
        },
        preprocessorOptions: {
            scss: {},
        },
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
}

// Copy manifest plugin with customizable input and output paths
const createManifestPlugin = (
    inputPath: string,
    outputPath: string
): Plugin => ({
    name: "copy-manifest",
    closeBundle() {
        const manifestPath = path.resolve(__dirname, inputPath)

        if (fs.existsSync(manifestPath)) {
            const outputDir = path.dirname(outputPath)
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true })
            }
            fs.copyFileSync(manifestPath, outputPath)
        }
    },
})

// Configuration for Figma build
const getFigmaConfig = (): UserConfig => ({
    ...sharedConfig,
    plugins: [
        ...sharedConfig.plugins,
        createManifestPlugin(
            "plugin-manifests/figma.json",
            path.resolve(__dirname, "dist/figma/manifest.json")
        ),
    ],
    publicDir: false,
    root: path.resolve(__dirname, "src/app"), // Set root for UI
    build: {
        outDir: path.resolve(__dirname, "dist/figma"),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                index: path.resolve(__dirname, "src/app/index.html"),
                plugin: path.resolve(__dirname, "src/plugin/figma.ts"),
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name === "plugin") {
                        return "code.js"
                    }
                    return "[name].js"
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === "index.html") {
                        return "[name][extname]"
                    }
                    return "assets/[name][extname]"
                },
            },
        },
    },
})

// Configuration for Penpot build
const getPenpotConfig = (): UserConfig => ({
    ...sharedConfig,
    plugins: [
        ...sharedConfig.plugins,
        createManifestPlugin(
            "plugin-manifests/penpot.json",
            path.resolve(__dirname, "dist/penpot/manifest.json")
        ),
    ],
    publicDir: path.resolve(__dirname, "public"),
    root: path.resolve(__dirname, "src/app"), // Set root for UI
    build: {
        outDir: path.resolve(__dirname, "dist/penpot"),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                index: path.resolve(__dirname, "src/app/index.html"),
                plugin: path.resolve(__dirname, "src/plugin/penpot.ts"),
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name === "plugin") {
                        return "code.js"
                    }
                    return "[name].js"
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === "index.html") {
                        return "[name][extname]"
                    }
                    return "assets/[name][extname]"
                },
            },
        },
    },
})

// Development server configuration
const getDevConfig = (): UserConfig => ({
    ...sharedConfig,
    plugins: [
        ...sharedConfig.plugins,
        createManifestPlugin(
            "plugin-manifests/figma.json",
            path.resolve(__dirname, "public/manifest.json")
        ),
    ],
    publicDir: path.resolve(__dirname, "public"),
    root: path.resolve(__dirname, "src/app"),
    server: {
        port: 3000,
    },
    preview: {
        port: 4402,
    },
})

// Export configuration based on command and mode
export default defineConfig(({ command, mode }) => {
    if (command === "serve") {
        return getDevConfig()
    }

    // For build command, use mode to determine which config to use
    if (command === "build") {
        switch (mode) {
            case "figma":
                return getFigmaConfig()
            case "penpot":
                return getPenpotConfig()
            default:
                throw new Error(
                    'Please specify build mode: "figma" or "penpot"'
                )
        }
    }

    return getDevConfig()
})
