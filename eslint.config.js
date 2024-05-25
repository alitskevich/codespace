import eslint from '@eslint/js';
import importPlugin from "eslint-plugin-import";
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['**/dist/**', '**/vendor/**', '**/.tmp/**'],
  },
  {
    plugins: {
      'import': importPlugin,
    },
    rules: {
      "comma-dangle": "off",
      "prefer-template": "error",

      "import/no-anonymous-default-export": "off",
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
          },
          "newlines-between": "always",
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_",
          "vars": "all",
          "args": "after-used",
          "ignoreRestSiblings": true,
        }
      ],

      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/promise-function-async": "off"
    }
  },
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
      globals: {
        ...globals.browser,
        'console': 'readonly',
        'chrome': 'readonly',
      }
    },
  },
  {
    files: ['*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
);