const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const jest = require("eslint-plugin-jest");
const prettier = require("eslint-config-prettier");

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    ...jest.configs["flat/recommended"],
    languageOptions: {
      ...jest.configs["flat/recommended"].languageOptions,
      parserOptions: {
        project: "./tsconfig.eslint.json",
      },
    },
  },
  prettier,
  {
    ignores: ["node_modules/", "dist/", "lib/"]
  }
);
