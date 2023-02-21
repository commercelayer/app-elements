const path = require('path')

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@commercelayer/eslint-config-ts-react'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.resolve(__dirname, 'tsconfig.json'),
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  }
}
