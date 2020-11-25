// https://eslint.org/docs/user-guide/configuring
// "off" or 0 - turn the rule off
// "warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
// "error" or 2 - turn the rule on as an error (exit code will be 1)

module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/prop-types': 'off',
    'linebreak-style': ['error', 'unix'],
    'no-var': 'error',
    'prefer-const': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prettier/prettier': 'warn',
    // fix https://github.com/yannickcr/eslint-plugin-react/issues/2834
    'react/react-in-jsx-scope': 'off',
  },
}
