import { dirname } from "path";
import { fileURLToPath } from "url";
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { ignores: ["eslint.config.mjs"] },
  {
    // Add this configuration object for parserOptions
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"], // Apply to relevant files
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json", // Point to your tsconfig.json
        tsconfigRootDir: __dirname, // Specify the root directory for tsconfig.json resolution
        ecmaFeatures: {
          jsx: true, // Enable JSX for React projects
        },
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
];

export default eslintConfig;
