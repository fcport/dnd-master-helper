/** @type {import('tailwindcss').Config} */
const {colors: defaultColors, fontFamily} = require('tailwindcss/defaultTheme')

const colorNew = {
  ...defaultColors,
  'raisin_black': {
    DEFAULT: '#151423',
    100: '#040407',
    200: '#09080e',
    300: '#0d0c15',
    400: '#11101c',
    500: '#151423',
    600: '#38365d',
    700: '#5b5797',
    800: '#8f8cbd',
    900: '#c7c5de'
  },
  'raisin_black': {
    DEFAULT: '#141323',
    100: '#040407',
    200: '#08080f',
    300: '#0c0c16',
    400: '#11101d',
    500: '#141323',
    600: '#36335f',
    700: '#58539a',
    800: '#8d89bf',
    900: '#c6c4df'
  },
  'licorice': {
    DEFAULT: '#281718',
    100: '#080405',
    200: '#100909',
    300: '#170d0e',
    400: '#1f1213',
    500: '#281718',
    600: '#60373a',
    700: '#99585c',
    800: '#bd8d90',
    900: '#dec6c8'
  },
  'caput_mortuum': {
    DEFAULT: '#5A291B',
    100: '#120805',
    200: '#24100b',
    300: '#361810',
    400: '#482116',
    500: '#5a291b',
    600: '#97442d',
    700: '#c9654a',
    800: '#db9886',
    900: '#edccc3'
  },
  'caput_mortuum': {
    DEFAULT: '#482119',
    100: '#0e0705',
    200: '#1d0d0a',
    300: '#2b140f',
    400: '#391a14',
    500: '#482119',
    600: '#853d2f',
    700: '#bf5b48',
    800: '#d49285',
    900: '#eac8c2'
  },
  'caput_mortuum': {
    DEFAULT: '#5A2427',
    100: '#120708',
    200: '#240f10',
    300: '#371617',
    400: '#491d1f',
    500: '#5a2427',
    600: '#923a3f',
    700: '#be5b60',
    800: '#d39295',
    900: '#e9c8ca'
  },
  'black_bean': {
    DEFAULT: '#3A1E19',
    100: '#0b0605',
    200: '#170c0a',
    300: '#22120f',
    400: '#2e1814',
    500: '#3a1e19',
    600: '#753c32',
    700: '#b15b4c',
    800: '#cc9187',
    900: '#e5c8c3'
  }
}

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {...colorNew},
      fontFamily: {...fontFamily, cinzel: ['Cinzel', 'serif']},
    },
  },
  plugins: [],
}

