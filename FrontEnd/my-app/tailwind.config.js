/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00b894',
        secondary: '#00dbb0',
        'dark-surface': '#0F1621',
        'dark-surface-elevated': '#161E22',
        'dark-surface-overlay': '#1a2333',
        'dark-border': '#2A3338',
        'dark-border-darker': '#1e293b',
        'dark-border-accent': '#2d3b4f',
        'dark-muted': '#92A5A8',
        'dark-muted-dimmer': '#5D6B6E',
        'dark-surface-hero': '#071020',
        'dark-surface-hero-alt': '#0a1628',
        'dark-primary-darker': '#008f72',
        'primary-hover': '#00a383',
        'primary-text-hover': '#008f72',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      width: {
        200: '200px',
      },
      zIndex: {
        dropdown: '100',
        modal: '110',
        onboarding: '60',
      },
      boxShadow: {
        'glow-sm': '0 0 8px #00dbb0',
        glow: '0 0 20px rgba(0, 219, 176, 0.3)',
        'glow-md': '0 0 20px rgba(0, 219, 176, 0.1)',
        'glow-lg': '0 0 28px rgba(0, 219, 176, 0.45)',
        'glow-xl': '0 0 25px rgba(0, 219, 176, 0.3)',
        'glow-hero': '0 0 24px rgba(0, 219, 176, 0.2)',
        'glow-step': '0 0 16px rgba(0, 219, 176, 0.35)',
        'glow-cta': '0 0 20px rgba(0, 219, 176, 0.3)',
        'tooltip-backdrop': '0 0 0 9999px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
};

