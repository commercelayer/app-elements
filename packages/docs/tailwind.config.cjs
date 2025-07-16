const { resolve } = require("node:path")
const tailwindConfig = require("../app-elements/tailwind.config.cjs")

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...tailwindConfig,
  content: tailwindConfig.content.map((content) =>
    resolve(__dirname, "../app-elements", content),
  ),
}
