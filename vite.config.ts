import react from "@vitejs/plugin-react"
import fs from "fs"
import path from "path"
import { defineConfig, Plugin, UserConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

// Shared configuration
const sharedConfig: UserConfig = {
    plugins: [react()],
    css: {
        modules: {
            localsConvention: "camelCase" as const,
        },
        preprocessorOptions: {
            scss: {
                quietDeps: true,
                logger: {
                    warn: () => {},
                    debug: () => {},
                },
            },
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

// Configuration for Figma UI build
const getFigmaUIConfig = (): UserConfig => ({
    ...sharedConfig,
    plugins: [
        ...sharedConfig.plugins,
        viteSingleFile(),
        createManifestPlugin(
            "plugin-manifests/figma.json",
            path.resolve(__dirname, "dist/figma/manifest.json")
        ),
    ],
    publicDir: false,
    root: path.resolve(__dirname, "src/app"),
    build: {
        ...sharedConfig.build,
        outDir: path.resolve(__dirname, "dist/figma"),
        emptyOutDir: true,
        rollupOptions: {
            input: path.resolve(__dirname, "src/app/index.html"),
        },
    },
})

// Configuration for Figma plugin code build
const getFigmaPluginConfig = (): UserConfig => ({
    ...sharedConfig,
    plugins: [],
    publicDir: false,
    build: {
        ...sharedConfig.build,
        outDir: path.resolve(__dirname, "dist/figma"),
        emptyOutDir: false, // Don't empty since UI was built here
        lib: {
            entry: path.resolve(__dirname, "src/plugin/figma.ts"),
            formats: ["iife"],
            name: "plugin",
            fileName: () => "code.js",
        },
    },
})

// Configuration for Penpot UI build
const getPenpotUIConfig = (): UserConfig => ({
    ...sharedConfig,
    plugins: [
        ...sharedConfig.plugins,
        viteSingleFile(),
        createManifestPlugin(
            "plugin-manifests/penpot.json",
            path.resolve(__dirname, "dist/penpot/manifest.json")
        ),
    ],
    publicDir: path.resolve(__dirname, "public"),
    root: path.resolve(__dirname, "src/app"),
    build: {
        ...sharedConfig.build,
        outDir: path.resolve(__dirname, "dist/penpot"),
        emptyOutDir: true,
        rollupOptions: {
            input: path.resolve(__dirname, "src/app/index.html"),
        },
    },
})

// Configuration for Penpot plugin code build
const getPenpotPluginConfig = (): UserConfig => ({
    ...sharedConfig,
    plugins: [],
    publicDir: path.resolve(__dirname, "public"),
    build: {
        ...sharedConfig.build,
        outDir: path.resolve(__dirname, "dist/penpot"),
        emptyOutDir: false, // Don't empty since UI was built here
        lib: {
            entry: path.resolve(__dirname, "src/plugin/penpot.ts"),
            formats: ["iife"],
            name: "plugin",
            fileName: () => "code.js",
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
            case "figma-ui":
                return getFigmaUIConfig()
            case "figma-plugin":
                return getFigmaPluginConfig()
            case "penpot-ui":
                return getPenpotUIConfig()
            case "penpot-plugin":
                return getPenpotPluginConfig()
            default:
                throw new Error(
                    'Please specify build mode: "figma-ui", "figma-plugin", "penpot-ui", or "penpot-plugin"'
                )
        }
    }

    return getDevConfig()
})
