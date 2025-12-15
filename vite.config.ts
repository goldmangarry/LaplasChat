import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		react(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom"],
					ui: ["@radix-ui/react-slot", "class-variance-authority"],
					i18n: [
						"i18next",
						"react-i18next",
						"i18next-browser-languagedetector",
					],
				},
			},
		},
	},
	server: {
		proxy: {
			"/api": {
				target: process.env.VITE_API_URL,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
				secure: false,
				timeout: 300000, // 5 minutes
				proxyTimeout: 300000, // 5 minutes
			},
		},
	},
});
