/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class", // To toggle dark mode manually by applying class="dark" to <html> tag
  plugins: [require("flowbite/plugin")],
};
