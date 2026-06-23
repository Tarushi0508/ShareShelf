/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1F2521',
        paper: '#F5F6F3',
        sage: {
          50: '#EEF2EE',
          100: '#D7E2D8',
          400: '#6E8E72',
          600: '#4C6B53',
          700: '#3B5641',
        },
        amber: {
          400: '#E3A464',
          500: '#D98F4D',
          600: '#BD7637',
        },
        clay: '#B5694A',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
