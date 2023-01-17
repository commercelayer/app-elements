const { transparentize } = require('polished')

const colorBrand = '#666EFF'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      screens: {
        sm: '540px'
      }
    },
    borderRadius: {
      DEFAULT: '0.313rem',
      md: '0.625rem',
      full: '9999px'
    },
    colors: {
      primary: {
        light: transparentize(0.2, colorBrand),
        DEFAULT: colorBrand
      },
      transparent: 'transparent',
      black: '#101111',
      white: '#fff',
      gray: {
        50: '#f8f8f8',
        100: '#EDEEEE',
        200: '#E6E7E7',
        300: '#DBDCDC',
        400: '#878888',
        500: '#686E6E',
        600: '#404141',
        700: '#343535',
        800: '#282929',
        900: '#1D1E1E'
      },
      green: '#1fda8a',
      orange: '#ffab2e',
      red: '#ff656b',
      teal: '#055463'
    },
    fontFamily: {
      sans: ['Manrope', 'ui-sans-serif', 'sans-serif'],
      mono: ['ui-monospace', 'Menlo', 'monospace']
    },
    fontSize: {
      '2xs': '.688rem',
      xs: '.75rem',
      sm: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '2.5xl': '2rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '8xl': '6rem',
      '10xl': '8rem',
      title: '2rem'
    },
    extend: {
      lineHeight: {
        title: '2.375rem'
      },
      transitionProperty: {
        bg: 'background'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
