const { resolve } = require('path')
const tailwindConfig = require("../core-app-elements/tailwind.config.cjs")

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...tailwindConfig,
  content: tailwindConfig.content.map(content => resolve(__dirname, '../core-app-elements', content))
}
