import baseConfig, { restrictEnvAccess } from "@aniways/eslint-config/base";
import reactConfig from "@aniways/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
	{
		ignores: [".sst/**", "*.d.ts", "dist/**"],
	},
	...baseConfig,
	...reactConfig,
	...restrictEnvAccess,
];
