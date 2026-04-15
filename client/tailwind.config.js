/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a56db',
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
