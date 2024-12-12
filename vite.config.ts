import { defineConfig } from "vite";

export default defineConfig({
    build: {
        minify: true,
        lib: {
            formats: ["es", "cjs", "umd"],
            name: "deck-day-night",
            entry: 'src/geo-circle/deck-day-night.ts',
        },
        rollupOptions: {
            external: ["deck.gl", "luma.gl"]
        }
    }
})