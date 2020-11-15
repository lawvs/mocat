# ESLint Configuration

This package contains the [ESLint](https://eslint.org/) configuration for Mocat. It enables lint rules which enforce code style conventions.

## Usages

Enable this configuration in your ESLint configuration file (e.g. `.eslintrc.js`):

```js
/** @type { import('eslint').Linter.Config } */
module.exports = {
  root: true,
  extends: ['./packages/eslint-config'],
  ignorePatterns: ['*.js'],
}
```

## Visual Studio Code

If you use [Visual Studio Code](https://github.com/microsoft/vscode/), install the [dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) plugin to lint your code in the editor. We recommend enabling these global VSCode settings:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```
