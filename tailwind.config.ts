import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        donut: {
          pink: '#f6a6c1',
          pinkDark: '#e0699a',
          cream: '#fff2e2',
          choco: '#5b3a29',
          chocoDark: '#3b2418',
        },
      },
      fontFamily: {
        pixel: ['var(--font-pixel)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
