/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#061c18',
          900: '#092d25',
          850: '#0b342b',
          800: '#0e3b31',
          700: '#155245',
          600: '#1e6d5d',
        },
        emerald: {
          500: '#13a879',
          600: '#0f8e65',
          700: '#0c7352',
        },
        mint: {
          100: '#e6faf2',
          200: '#cbf6e3',
          300: '#a6f2d0',
          400: '#75e8b5',
        },
        ivory: {
          50: '#ffffff',
          100: '#f7f8f3',
          200: '#eef2ec',
          300: '#e2e9e3',
        },
        charcoal: {
          900: '#192822',
          800: '#2b3d35',
          700: '#485c53',
          500: '#73827a',
          400: '#95a39c',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
