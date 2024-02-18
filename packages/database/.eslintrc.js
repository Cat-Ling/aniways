/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@aniways/eslint-config/library.js'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-redeclare': 'off',
  },
};
