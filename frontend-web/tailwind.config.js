/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16A34A',
          dark: '#15803d',
        },
        secondary: {
          DEFAULT: '#22C55E',
          dark: '#16a34a',
        },
        accent: '#84CC16',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        darkBg: '#0F172A',
        cardDark: '#1E293B',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
