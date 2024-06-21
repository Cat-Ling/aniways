import type { Config } from "tailwindcss";

import baseConfig from "@aniways/tailwind-config/web";

export default {
  content: [...baseConfig.content, "../../packages/ui/**/*.{ts,tsx}"],
  presets: [baseConfig],
} satisfies Config;
