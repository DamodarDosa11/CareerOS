/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: "#eef0ff", 100: "#e0e3ff", 500: "#6c5ce7",
          600: "#5b4bd6", 700: "#4c3fc0",
        },
      },
    },
  },
  plugins: [],
};
