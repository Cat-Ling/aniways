import baseConfig, { restrictEnvAccess } from "@aniways/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".serverless/**", ".build/**", ".webpack/**"],
  },
  ...baseConfig,
  ...restrictEnvAccess,
];
