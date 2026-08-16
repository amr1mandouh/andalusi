/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Soft, airy backgrounds — the "Mint" half of the identity.
        mint: {
          50: '#F6FBF8',
          100: '#EAF6EF',
          200: '#D7EEE0',
          300: '#BCE1CC',
          400: '#98CFB2',
          500: '#74BA93',
          600: '#569E77',
          700: '#437E60',
          800: '#38664F',
          900: '#2F5442',
        },
        // Deep, confident primary — the "Forest Green" half of the identity.
        forest: {
          50: '#EEF6F1',
          100: '#D6E9DD',
          200: '#AFD4BE',
          300: '#82B99A',
          400: '#579B76',
          500: '#37805C',
          600: '#276548',
          700: '#1F4F3A',
          800: '#1A3F2F',
          900: '#153428',
          950: '#0D2019',
        },
        // Dark-mode surface hierarchy — deep charcoal/blue-black, never pure black.
        surface: {
          DEFAULT: '#080D0F',
          secondary: '#0C1215',
          card: '#11181C',
          elevated: '#141D21',
          strong: '#181F23',
          input: '#090F12',
        },
        // Dark-mode borders — subtle, low-contrast.
        line: {
          DEFAULT: '#263238',
          subtle: '#1B2529',
        },
        // Dark-mode text hierarchy — off-white primary, never pure white.
        ink: {
          primary: '#E8ECEE',
          secondary: '#8A979C',
          muted: '#657277',
          disabled: '#465156',
        },
        // Single teal accent — buttons, links, active states, focus, badges.
        accent: {
          DEFAULT: '#20C7C1',
          hover: '#2DD8D1',
          active: '#18B5B0',
          soft: 'rgba(32, 199, 193, 0.10)',
          glow: 'rgba(32, 199, 193, 0.25)',
        },
      },
    },
  },
  plugins: [],
};
