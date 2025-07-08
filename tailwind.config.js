/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'google-blue': '#1976d2',
        'google-blue-dark': '#1565c0',
        'google-blue-light': '#42a5f5',
      },
    },
  },
  plugins: [],
} 