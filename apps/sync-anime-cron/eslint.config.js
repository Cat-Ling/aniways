import baseConfig, { restrictEnvAccess } from "@aniways/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
	{
		ignores: [".sst/**"],
	},
	...baseConfig,
	...restrictEnvAccess,
];
