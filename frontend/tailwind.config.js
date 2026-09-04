/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#25214A',
          50: '#F5F4FA',
          100: '#ECE9F4',
          200: '#D9D5E7',
          300: '#BDB6D4',
          400: '#9B90BE',
          500: '#7B6DA8',
          600: '#5F5190',
          700: '#483C73',
          800: '#342B55',
          900: '#25214A',
          950: '#17142E',
        },
        lime: {
          DEFAULT: '#C7F36B',
          50: '#FAFEDF',
          100: '#F4FCC0',
          200: '#E9FA96',
          300: '#DCF768',
          400: '#D1F547',
          500: '#C7F36B',
          600: '#A9DC24',
          700: '#84B017',
          800: '#648515',
          900: '#4D6613',
          950: '#233004',
        },
        warm: {
          DEFAULT: '#F7F7F3',
          50: '#FCFCFB',
          100: '#F7F7F3',
          200: '#ECECE7',
          300: '#E1E1DB',
          400: '#CACAC3',
        },
        ink: {
          DEFAULT: '#17171B',
          primary: '#17171B',
          secondary: '#6F7078',
          muted: '#9E9EA7',
          light: '#D3D3DA',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(23, 23, 27, 0.05)',
        'card-hover': '0 12px 30px -4px rgba(37, 33, 74, 0.12)',
        'floating': '0 20px 40px -10px rgba(23, 23, 27, 0.14)',
        'lime-glow': '0 8px 24px -4px rgba(199, 243, 107, 0.45)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
