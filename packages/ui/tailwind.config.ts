import type { Config } from "tailwindcss";

import baseConfig from "@aniways/tailwind-config/web";

const config = {
	content: ["./src/**/*.{ts,tsx}"],
	presets: [baseConfig],
} satisfies Config;

export default config;
