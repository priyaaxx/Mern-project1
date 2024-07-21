/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: {
          light: '#ff80ab',  // Light pink from MUI theme
          DEFAULT: '#ff4081',  // Main pink from MUI theme
          dark: '#f50057', 
      },
    },
  },
},
  plugins: [],
  corePlugins:{
    preflight: false,
  },
}
