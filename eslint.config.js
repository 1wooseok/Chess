import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  {
    "rules": {
      'semi': ['error', 'always'],
      "@typescript-eslint/explicit-function-return-type": "error"
    },
  },
  ...tseslint.configs.recommended,
];