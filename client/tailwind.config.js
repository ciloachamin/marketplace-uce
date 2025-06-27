/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: "class",
  theme: {
    extend: {
      colors:{
        primary: " #BD0003",
        secundary: "#F8F8F8",
        espeshopverde: "#08215"
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '3rem',
        },
      },
      fontFamily: {
        'rubik-doodle': ['"Rubik Doodle Shadow"', 'system-ui'],
        'sedgwick': ['"Sedgwick Ave"', 'cursive'],
        'road-rage': ['"Road Rage"', 'sans-serif'],
        'kalam': ['"Kalam"', 'cursive'],
        'sriracha': ['"Sriracha"', 'cursive'],
        'neucha': ['"Neucha"', 'cursive'],
      },
      fontWeight: {
        'kalam-light': 300,
        'kalam-regular': 400,
        'kalam-bold': 700,
      }
    },
  },
};
