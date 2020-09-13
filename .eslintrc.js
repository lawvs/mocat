/** @type { import('eslint').Linter.Config } */
module.exports = {
  root: true,
  extends: ['./packages/eslint-config'],
  ignorePatterns: ['*.js', 'packages/*/build/**/*.ts'],
  settings: {
    react: {
      version: require('react').version,
    },
  },
}
