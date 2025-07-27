/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        brand: {
          background: '#F2EFE7',
          light: '#9ACBD0',
          medium: '#48A6A7',
          dark: '#006A71',
        },
        // Legacy colors for reference, should be replaced
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        }
      }
    }
  },
  plugins: [],
};
