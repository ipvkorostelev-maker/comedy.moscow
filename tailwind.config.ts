import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        surface: {
          DEFAULT: '#141414',
          2: '#1A1A1F',
        },
        border: '#2A2A33',
        red: {
          DEFAULT: '#FF4D00',
          hover: '#E64500',
        },
        gold: '#FFB800',
        cream: '#FFFFFF',
        muted: {
          DEFAULT: '#A0A0A0',
          2: '#3A3A3F',
        },
      },
      fontFamily: {
        serif: ['var(--font-oswald)', 'Impact', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        'card-hover': '0 8px 32px rgba(0,0,0,0.55)',
        red: '0 4px 24px rgba(255,77,0,0.35)',
        'red-sm': '0 2px 12px rgba(255,77,0,0.25)',
      },

      animation: {
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'fade-slide-up': 'fadeSlideUp 0.3s ease both',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.65' },
          '50%': { opacity: '1' },
        },
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
