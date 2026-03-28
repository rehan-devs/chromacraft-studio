/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        surface: {
          bg: '#FAF9F7',
          card: '#FFFFFF',
        },
        ink: {
          primary: '#1A1A19',
          secondary: '#6B6965',
          muted: '#9C9890',
        },
      },
      maxWidth: {
        container: '72rem',
      },
    },
  },
  plugins: [],
};