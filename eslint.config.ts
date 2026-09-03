import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import { defineConfig } from "eslint/config";
import * as path from "node:path";
import tseslint from "typescript-eslint";

export default defineConfig(
  includeIgnoreFile(path.join(import.meta.dirname, ".gitignore")),

  ...nextVitals,

  {
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strict,
      ...tseslint.configs.stylistic,
    ],

    rules: {
      "no-empty": ["error", { allowEmptyCatch: true }],
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
    },
  },
  {
    files: ["src/lib/fluid.ts", "src/lib/sketches/**"],
    rules: {
      "prefer-const": "off",
    },
  },
  {
    files: ["scripts/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
);
