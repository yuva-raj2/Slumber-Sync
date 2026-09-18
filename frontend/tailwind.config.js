/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        night: {
          950: '#030712',
          900: '#080d1a',
          850: '#0e1526',
          800: '#151f38',
          700: '#1e2d4f',
        },
        celestial: {
          blue: '#3b82f6',
          indigo: '#6366f1',
          violet: '#8b5cf6',
          cyan: '#06b6d4',
          teal: '#14b8a6',
        },
        aurora: {
          glow: 'rgba(99, 102, 241, 0.15)',
          calm: '#10b981',
          alert: '#f59e0b',
          disruptive: '#ef4444',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))' },
          '100%': { filter: 'drop-shadow(0 0 25px rgba(6, 182, 212, 0.6))' },
        }
      }
    },
  },
  plugins: [],
};
