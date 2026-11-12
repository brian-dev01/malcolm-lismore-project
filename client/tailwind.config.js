/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#faf8f5',
          100: '#f0ebe3',
          200: '#e0d5c5',
          300: '#cdb9a0',
          400: '#b89a79',
          500: '#a8825e',
          600: '#9a7152',
          700: '#805c45',
          800: '#694c3d',
          900: '#574034',
          950: '#2e201a',
        },
        accent: {
          50:  '#f0f7f4',
          100: '#dbede4',
          200: '#b9dccc',
          300: '#8ac3ac',
          400: '#5ba68a',
          500: '#3a8b6f',
          600: '#2b7059',
          700: '#245a49',
          800: '#20483c',
          900: '#1c3c33',
          950: '#0e221d',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
