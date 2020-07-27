// https://eslint.org/docs/user-guide/configuring
// "off" or 0 - turn the rule off
// "warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
// "error" or 2 - turn the rule on as an error (exit code will be 1)

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    browser: true,
    jest: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
    'prettier',
    'prettier/react',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/member-delimiter-style': [
      'error',
      { multiline: { delimiter: 'none' } },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'linebreak-style': ['error', 'unix'],
    'no-var': 'error',
    'prefer-const': 'error',
    'no-unused-vars': ['warn', { args: 'none' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prettier/prettier': 'warn',
  },
  settings: {
    react: {
      version: require('react').version,
    },
  },
}
