/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#f97316',
          600: '#ea580c',
        },
      },
      boxShadow: {
        glass: '0 18px 45px rgba(15,23,42,0.65)',
      },
    },
  },
  plugins: [],
};
