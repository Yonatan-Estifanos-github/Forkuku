import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'luxury-black': '#0a0908',
        'wedding-gold': '#D4A845',
        'forest-green': '#1B3B28',
        'harvest-wheat': '#E6D2B5',
        'antique-gold': '#C5A059',
        'warm-amber': '#DA8A35',
        'sage-green': '#9CAF88',
        'soft-sage': '#E7EFEA',
        'eucalyptus-wash': '#D8E3DC',
        'brick-terracotta': '#C1664F',
        'crisp-white': '#FAFAFA',
        'true-black': '#1A1A1A',
        'matte-black': '#121212',
        'charcoal': '#36454f',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-cormorant)'],
        script: ['var(--font-allura)'],
        display: ['var(--font-playfair)'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
