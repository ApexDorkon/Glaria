/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors: {
        glariaYellow: {
          DEFAULT: '#FFD97E',
          light: '#FFE4AA',
          dark: '#FFC850',
        },
      },},
  },
  plugins: [],
}
