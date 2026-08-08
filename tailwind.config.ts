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
        // Theme-aware tokens — resolve through CSS custom properties defined in
        // main.css under [data-theme="dark"|"light"], swapped by ViewProvider.
        // Existing dark-token names are kept and re-pointed at the same vars so
        // current call sites (bg-luxury-black, text-wedding-gold, ...) don't need
        // to change — only their definition does.
        surface: 'rgba(var(--surface-rgb), <alpha-value>)',
        'surface-alt': 'var(--surface-alt)',
        ink: 'rgba(var(--ink-rgb), <alpha-value>)',
        'ink-heading': 'var(--ink-heading)',
        accent: 'rgba(var(--accent-rgb), <alpha-value>)',
        'accent-soft': 'var(--accent-soft)',
        hairline: 'var(--hairline)',
        'luxury-black': 'rgba(var(--surface-rgb), <alpha-value>)',
        'wedding-gold': 'rgba(var(--accent-rgb), <alpha-value>)',
        // Literal palette — kept as raw hex for contexts that can't consume CSS
        // vars (e.g. Hero.tsx's Three.js material/light colors) and for the
        // [data-theme] value definitions themselves.
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
