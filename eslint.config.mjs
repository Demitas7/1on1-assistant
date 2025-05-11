import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals", 
    "next/typescript",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended"
  ),
  
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    rules: {
      "react/jsx-key": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/no-array-index-key": "warn",
      "react/jsx-no-constructed-context-values": "warn",
      "react/jsx-no-bind": ["warn", {
        "allowArrowFunctions": true
      }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    }
  }
];

export default eslintConfig;
