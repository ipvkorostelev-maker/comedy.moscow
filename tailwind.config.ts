import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0C0C0F',
        surface: {
          DEFAULT: '#141418',
          2: '#1C1C22',
        },
        border: '#2A2A32',
        red: {
          DEFAULT: '#D4421E',
          hover: '#BF3A1A',
        },
        gold: '#F5C842',
        cream: '#F0EDE8',
        muted: {
          DEFAULT: '#6A6A7A',
          2: '#3A3A48',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease both',
        'zoom-out': 'zoomOut 12s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        zoomOut: {
          to: { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
