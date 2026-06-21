import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF5F1',
        coral: {
          DEFAULT: '#E05A50',
          deep: '#C4453C',
          light: '#FBEAE6',
        },
        ink: {
          DEFAULT: '#2C2723',
          secondary: '#5C534B',
          muted: '#8A7F76',
          soft: '#9A8F86',
        },
        'border-line': '#EFE6DE',
        'border-input': '#E6DCD3',
        'input-bg': '#FCFAF8',
        'status-confirmed': '#3F7E5E',
        'status-confirmed-bg': '#E6F1EB',
        'status-pending': '#B97E2E',
        'status-pending-bg': '#FBF0DF',
        'status-canceled': '#8A7F76',
        'status-canceled-bg': '#EFEAE5',
      },
      fontFamily: {
        spectral: ['var(--font-spectral)', 'Georgia', 'serif'],
        hanken: ['var(--font-hanken)', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        pill: '999px',
        card: '16px',
        'card-lg': '20px',
      },
      boxShadow: {
        coral: '0 8px 20px rgba(224,90,80,.30)',
        'coral-sm': '0 6px 16px rgba(224,90,80,.28)',
        card: '0 1px 3px rgba(0,0,0,.10)',
      },
    },
  },
  plugins: [],
}

export default config
