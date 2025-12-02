/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        magnum: {
          50: '#fbf8eb',
          100: '#f5eccd',
          200: '#ebd695',
          300: '#e0bd5e',
          400: '#d6a534',
          500: '#bfa523', // Base Gold
          600: '#a17d1a',
          700: '#825e16',
          800: '#6b4a18',
          900: '#583d19',
          950: '#32200a',
        },
        dark: {
          900: '#0a0a0a',
          800: '#121212',
          700: '#1e1e1e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
