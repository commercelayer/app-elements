/* eslint-disable @typescript-eslint/explicit-function-return-type */
const colorBrand = '#666EFF'

/** @type {(percentage: number) => string} */
function alphaToHex(percentage) {
  return Math.floor((percentage * 255) / 100)
    .toString(16)
    .toUpperCase()
    .padStart(2, '0')
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      md: '768px',
      lg: '992px',
      xl: '1200px'
    },
    container: {
      screens: {
        md: '632px'
      }
    },
    borderRadius: {
      DEFAULT: '0.313rem',
      sm: '0.188rem',
      md: '0.625rem',
      full: '9999px'
    },
    boxShadow: {
      hover: '0 0 0 1px #101111',
      focus: '0 0 0 2px #666EFF',
      inputfocus: 'inset 0 0 0 2px #666EFF'
    },
    colors: {
      inherit: 'inherit',
      primary: {
        light: `${colorBrand}${alphaToHex(80)}`,
        DEFAULT: colorBrand,
        50: '#ecf2ff',
        100: '#dde6ff',
        200: '#c2d1ff',
        300: '#9cb1ff',
        400: '#7586ff',
        500: '#666EFF',
        600: '#3b36f5',
        700: '#322ad8',
        800: '#2925ae',
        900: '#181650'
      },
      transparent: 'transparent',
      black: '#101111',
      white: '#fff',
      gray: {
        50: '#F8F8F8',
        100: '#EDEEEE',
        200: '#E6E7E7',
        300: '#BBBEBE',
        400: '#878888',
        500: '#686E6E',
        600: '#404141',
        700: '#343535',
        800: '#282929',
        900: '#1D1E1E'
      },
      green: {
        DEFAULT: '#1FDA8A',
        50: '#F0FDF7',
        100: '#DBFDEE',
        200: '#B9F9DC',
        300: '#83F2C2',
        400: '#45E39F',
        500: '#1FDA8A',
        600: '#11A868',
        700: '#11784C',
        800: '#0A472D',
        900: '#03160E'
      },
      orange: {
        DEFAULT: '#FFAB2E',
        50: '#FFF5E6',
        100: '#FFEDD1',
        200: '#FFDCA8',
        300: '#FFCC80',
        400: '#FFBB57',
        500: '#FFAB2E',
        600: '#f98107',
        700: '#dd5c02',
        800: '#942e0c',
        900: '#461202'
      },
      red: {
        DEFAULT: '#FF656B',
        50: '#FFF4F4',
        100: '#FFDFE1',
        200: '#FFB7B9',
        300: '#FF8E92',
        400: '#FF656B',
        500: '#FF2D35',
        600: '#F40009',
        700: '#BC0007',
        800: '#840005',
        900: '#4B0003'
      },
      teal: {
        DEFAULT: '#055463',
        50: '#EDFBFE',
        100: '#C7F4FC',
        200: '#A0ECFA',
        300: '#79E4F8',
        400: '#52DCF6',
        500: '#18D0F3',
        600: '#0BB7D8',
        700: '#0996B1',
        800: '#07758A',
        900: '#055463'
      },
      yellow: {
        DEFAULT: '#FFEA2E',
        50: '#FFFCE6',
        100: '#FFFAD1',
        200: '#FFF6A8',
        300: '#FFF280',
        400: '#FFEE57',
        500: '#FFEA2E',
        600: '#F5DC00',
        700: '#BDAA00',
        800: '#857700',
        900: '#4D4500'
      },
      pink: {
        DEFAULT: '#FE84BA',
        50: '#FFE9F3',
        100: '#FFD5E7',
        200: '#FEACD1',
        300: '#FE84BA',
        400: '#FE4C9B',
        500: '#FD157C',
        600: '#D80261',
        700: '#A00148',
        800: '#69012F',
        900: '#310016'
      }
    },
    fontFamily: {
      sans: ['Manrope', 'ui-sans-serif', 'sans-serif'],
      mono: ['Roboto Mono', 'ui-monospace', 'Menlo', 'monospace']
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
      },
      objectPosition: {
        'out-of-bounds': '-99999px 99999px'
      },
      fontWeight: {
        inherit: 'inherit'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
