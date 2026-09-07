/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
        },
        godrej: {
          red: '#c9142c',
          navy: '#0f2942',
          blue: '#1e4b75',
          gold: '#d4af37',
          gray: '#f4f6f8'
        }
      }
    },
  },
  plugins: [],
};
