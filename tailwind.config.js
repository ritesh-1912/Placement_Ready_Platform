/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(245, 58%, 51%)',
          dark: 'hsl(245, 58%, 41%)',
          light: 'hsl(245, 58%, 61%)',
        },
      },
    },
  },
  plugins: [],
}
