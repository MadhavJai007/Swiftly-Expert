module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        darkCustom: "#1c1c1c",
      }
    },
  },
  variants: {
    extend: {

    },
  },
  plugins: [],
}
