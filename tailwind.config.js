/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html"],
  theme: {
    extend: {},
    screens: {
        'xsm': {'max': '383px'},
        'smx': {'max': '530px'}
    }
  },
  plugins: [],
}