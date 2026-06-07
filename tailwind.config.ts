import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          bg: '#FFFFFF',
          primary: '#000000',
          secondary: '#8E8E93',
          tertiary: '#AEAEB2',
          accent: '#007AFF',
          success: '#34C759',
          danger: '#FF3B30',
          surface: '#F2F2F7',
          border: '#E5E5EA',
          'surface-2': '#E5E5EA',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'ios-caption': ['12px', { lineHeight: '1.3', letterSpacing: '0.5px' }],
        'ios-footnote': ['13px', { lineHeight: '1.4' }],
        'ios-body': ['17px', { lineHeight: '1.4' }],
        'ios-title3': ['20px', { lineHeight: '1.3', letterSpacing: '-0.3px' }],
        'ios-title1': ['28px', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'ios-largetitle': ['34px', { lineHeight: '1.1', letterSpacing: '-0.5px' }],
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      backdropBlur: {
        ios: '20px',
      },
    },
  },
  plugins: [],
};

export default config;
