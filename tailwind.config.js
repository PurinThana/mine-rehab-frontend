/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Forest — the reclaimed cover, from deep canopy to fresh sprout
        forest: {
          50: '#EEF4EF',
          100: '#D8E7DA',
          200: '#AECEB2',
          400: '#4E8F66',
          500: '#3F8F5F',
          600: '#2C6B47',
          700: '#1F4D3A',
          800: '#183C2D',
          900: '#122F24',
        },
        // Sand — the paper / working surface, warm not white
        sand: {
          50: '#F7F4EC',
          100: '#EFE9D9',
          200: '#E3DAC2',
        },
        // Clay — exposed earth, the accent that stands for "before"
        clay: {
          400: '#CB8354',
          500: '#C1723C',
          600: '#B4622E',
          700: '#95501F',
        },
        // Soil — body text and quiet structure
        soil: {
          400: '#9C8778',
          500: '#8A6B54',
          600: '#6E5340',
          700: '#5B4636',
          900: '#3A2C22',
        },
        // Bloom gold — pending / attention state
        bloom: {
          400: '#E6BD6E',
          500: '#D9A441',
          600: '#B9862C',
        },
      },
      fontFamily: {
        display: ['"Kanit"', 'sans-serif'],
        body: ['"Sarabun"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(58,44,34,0.06), 0 8px 24px -12px rgba(31,77,58,0.18)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
