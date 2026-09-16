import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        donut: {
          pink: '#ff7fb0',
          pinkDark: '#e8548f',
          pinkLight: '#ffd3e4',
          glaze: '#ff9ac4',
          dough: '#f3bd77',
          doughDark: '#d99a4e',
          cream: '#fff6ec',
          creamDark: '#ffe9d6',
          choco: '#5b3a29',
          chocoDark: '#33200f',
          gold: '#ffd166',
          mint: '#6ee7b7',
          sky: '#7dd3fc',
          lilac: '#c4b5fd',
          coral: '#fb7185',
        },
      },
      fontFamily: {
        pixel: ['var(--font-pixel)', 'monospace'],
        display: ['var(--font-display)', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -14px rgba(91, 58, 41, 0.35)',
        card: '0 22px 45px -26px rgba(91, 58, 41, 0.55)',
        glow: '0 0 0 4px rgba(255, 127, 176, 0.22), 0 24px 45px -20px rgba(232, 84, 143, 0.65)',
        pill: '0 10px 22px -12px rgba(232, 84, 143, 0.9)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(4deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(-3deg)' },
          '50%': { transform: 'translateY(-22px) rotate(5deg)' },
        },
        spinSlow: {
          to: { transform: 'rotate(360deg)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '70%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(26px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          to: { backgroundPosition: '300% center' },
        },
        badgePop: {
          '0%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.55) rotate(-12deg)' },
          '100%': { transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        rain: {
          '0%': { transform: 'translateY(-15vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(105vh) rotate(420deg)', opacity: '0' },
        },
        stamp: {
          '0%': { transform: 'scale(2.4) rotate(-22deg)', opacity: '0' },
          '60%': { transform: 'scale(0.92) rotate(6deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 9s ease-in-out infinite',
        'spin-slow': 'spinSlow 22s linear infinite',
        'pop-in': 'popIn 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'fade-in': 'fadeIn 0.8s ease-out both',
        shimmer: 'shimmer 7s linear infinite',
        'badge-pop': 'badgePop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        wiggle: 'wiggle 0.6s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
        stamp: 'stamp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
