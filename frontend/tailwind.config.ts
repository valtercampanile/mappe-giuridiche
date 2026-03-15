import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066CC',
          dark: '#004B8C',
          light: '#EBF3FB',
        },
        text: {
          primary: '#17324D',
          secondary: '#5C6F82',
        },
        border: '#D9E4ED',
        surface: '#F5F9FC',
        sidebar: {
          bg: '#0D1B2A',
          accent: '#4DA3FF',
        },
        error: '#8B1A1A',
        warning: '#7A5800',
        success: '#006D3D',
      },
      fontFamily: {
        sans: ['Titillium Web', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
