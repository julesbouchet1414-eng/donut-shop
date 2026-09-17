import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Fonds : obsidienne / deepslate
        night: {
          900: '#07060b',
          800: '#0d0b14',
          700: '#13101d',
          600: '#1a1626',
          500: '#241e33',
          400: '#332a47',
          300: '#463a5e',
        },
        // Accents Minecraft
        mc: {
          pink: '#ff4f9b',
          pinkDark: '#c62a6e',
          pinkLight: '#ff8fc0',
          purple: '#b46cff',
          purpleDark: '#5c2f8f',
          gold: '#ffb52e',
          goldDark: '#c8860f',
          emerald: '#3ddc84',
          emeraldDark: '#1f8f52',
          diamond: '#4ee2ec',
          redstone: '#e8485f',
          netherite: '#4a3f47',
        },
        ink: {
          100: '#efeaf7',
          200: '#cfc6e0',
          300: '#a89dbe',
          400: '#7d7295',
        },
      },
      fontFamily: {
        pixel: ['var(--font-pixel)', 'monospace'],
        display: ['var(--font-display)', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-18px) rotate(3deg)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '70%': { transform: 'scale(1.12)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(22px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        glint: {
          '0%': { transform: 'translateX(-120%) skewX(-20deg)' },
          '100%': { transform: 'translateX(220%) skewX(-20deg)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.95' },
        },
        badgePop: {
          '0%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.5) rotate(-10deg)' },
          '100%': { transform: 'scale(1)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        rain: {
          '0%': { transform: 'translateY(-12vh)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(105vh)', opacity: '0' },
        },
        stamp: {
          '0%': { transform: 'scale(2.2)', opacity: '0' },
          '60%': { transform: 'scale(0.92)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        beam: {
          '0%, 100%': { opacity: '0.25', transform: 'scaleY(1)' },
          '50%': { opacity: '0.6', transform: 'scaleY(1.06)' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'float-slow': 'floatSlow 9s ease-in-out infinite',
        bob: 'bob 2.4s ease-in-out infinite',
        'pop-in': 'popIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'slide-up': 'slideUp 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'fade-in': 'fadeIn 0.7s ease-out both',
        glint: 'glint 2.8s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'badge-pop': 'badgePop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        marquee: 'marquee 34s linear infinite',
        stamp: 'stamp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        beam: 'beam 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
