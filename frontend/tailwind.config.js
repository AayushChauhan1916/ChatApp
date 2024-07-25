/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:"#00adb5",
        secondary:"#0bcbd4"
      },
      height: {
        '17': '4.25rem', // 17 * 0.25rem = 4.25rem
      },
      margin: {
        '18': '4.50rem', // 17 * 0.25rem = 4.25rem
        '18': '4.25rem', // 17 * 0.25rem = 4.25rem
      },
      bottom:{
        '15': '3.75rem'
      }
    },
  },
  plugins: [],
}

