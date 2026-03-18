import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0D0D11',
        surface: {
          DEFAULT: '#16161B',
          2: '#1F1F27',
        },
        border: '#2A2A36',
        red: {
          DEFAULT: '#E8432A',
          hover: '#D03B24',
        },
        gold: '#F5C842',
        cream: '#F0EDE8',
        muted: {
          DEFAULT: '#7C7C8E',
          2: '#3A3A48',
        },
      },
      fontFamily: {
        serif: ['var(--font-oswald)', 'Impact', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.6)',
        red: '0 4px 24px rgba(232,67,42,0.35)',
        'red-sm': '0 2px 12px rgba(232,67,42,0.25)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease both',
        'zoom-out': 'zoomOut 12s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
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
