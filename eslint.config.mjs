import { defineConfig } from 'eslint/config';
// import mateAcademyConfig from '@mate-academy/eslint-config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import css from '@eslint/css';
import js from '@eslint/js';

import { readFileSync } from 'fs';

const gitignorePatterns = readFileSync('.gitignore', 'utf8')
  .split('\n')
  .filter((line) => line.trim() && !line.startsWith('#'));

export default defineConfig([
  {
    ignores: [
      '**/node_modules/**', // Стандартне ігнорування
      ...gitignorePatterns, // Додаємо шаблони з .gitignore
    ],
  },
  // {
  //   files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
  //   languageOptions: {
  //     globals: {
  //       ...globals.browser,
  //       ...globals.node,
  //     },
  //     parserOptions: {
  //       ecmaVersion: 'latest',
  //       sourceType: 'module',
  //     },
  //   },
  //   rules: {
  //     'max-len': [
  //       'error',
  //       {
  //         code: 100,
  //         comments: 100,
  //         ignoreTemplateLiterals: true,
  //       },
  //     ],
  //     semi: ['error', 'always'],
  //     'semi-style': ['error', 'last'],
  //     'space-before-function-paren': 0,
  //     'no-var': 'error',
  //     'prefer-const': 'error',
  //     'comma-dangle': ['error', 'always-multiline'],
  //     curly: ['error', 'all'],
  //     'no-shadow': ['error', { builtinGlobals: true, hoist: 'all', allow: [] }],
  //     'no-redeclare': ['error', { builtinGlobals: true }],
  //     'no-param-reassign': 'error',
  //     'operator-linebreak': 0,
  //     'no-console': 'error',
  //     'standard/no-callback-literal': 0,
  //     'import/prefer-default-export': 0,
  //     'padding-line-between-statements': [
  //       'error',
  //       { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
  //       {
  //         blankLine: 'always',
  //         prev: '*',
  //         next: ['return', 'block-like', 'multiline-expression'],
  //       },
  //       { blankLine: 'always', prev: '*', next: ['const', 'let', 'var'] },
  //       {
  //         blankLine: 'any',
  //         prev: ['const', 'let', 'var'],
  //         next: ['const', 'let', 'var'],
  //       },
  //     ],
  //     'brace-style': ['error', '1tbs'],
  //     'object-curly-newline': [
  //       2,
  //       {
  //         ObjectExpression: {
  //           consistent: true,
  //           minProperties: 4,
  //         },
  //       },
  //     ],
  //     'no-prototype-builtins': 0,
  //   },
  //   ignores: [...gitignorePatterns],
  // },

    {
      files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
      plugins: { js },
      extends: ['js/recommended'],
    },
    {
      files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
      languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
  
  tseslint.configs.recommended,

  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
    ignores: [
      ...gitignorePatterns,
    ],
  },
  {
    files: ['**/*.jsonc'],
    plugins: { json },
    language: 'json/jsonc',
    extends: ['json/recommended'],
    ignores: [
      ...gitignorePatterns,
    ],
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended'],
    ignores: [
      ...gitignorePatterns,
    ],
  },
]);
