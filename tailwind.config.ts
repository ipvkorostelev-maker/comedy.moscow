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
        'fade-up': 'fadeUp 0.6s ease both',
        'gradient-xy': 'gradientXY 8s ease infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        gradientXY: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
