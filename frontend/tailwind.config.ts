import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        fleet: {
          bg: '#0a0a0f',
          surface: '#12121a',
          card: '#1a1a24',
          border: '#2a2a3a',
          muted: '#6b7280',
          accent: '#3b82f6',
          cyan: '#06b6d4',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default config;
