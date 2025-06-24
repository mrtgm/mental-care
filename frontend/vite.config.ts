import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, path.resolve(__dirname, "../"), "");

	return {
		plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
		resolve:
			mode === "development"
				? {}
				: {
						alias: {
							"react-dom/server": "react-dom/server.node",
						},
					},

		// 開発用ポート
		server: {
			host: "0.0.0.0",
			port: env.FRONTEND_PORT ? parseInt(env.FRONTEND_PORT, 10) : 3000,
		},
	};
});
