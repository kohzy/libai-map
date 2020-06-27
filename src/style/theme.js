const breakpoints = ['40em', '52em', '64em']

// from: https://palx.jxnblk.com/
const colors = {
  white: '#FFF',
  black: '#000',
  link: '#07c',
  primary: {
    0: '#fff8f1',
    100: '#ffead3',
    200: '#ffdbb1',
    300: '#ffc98c',
    400: '#ffb560',
    500: '#ff9b2a',
    600: '#f38200',
    700: '#d16f00',
    800: '#a55800',
    900: '#613400',
  },
  secondary: {
    0: '#e3f9f7',
    100: '#c4f3ef',
    200: '#a0ece5',
    300: '#77e3da',
    400: '#44d9cd',
    500: '#00ccbb',
    600: '#00b8a9',
    700: '#00a294',
    800: '#00867b',
    900: '#006159',
  },
  highlight: {
    0: '#eeffdf',
    100: '#c3ff8e',
    200: '#77fe00',
    300: '#6fef00',
    400: '#67de00',
    500: '#5fcb00',
    600: '#55b500',
    700: '#499b00',
    800: '#397b00',
    900: '#224800',
  },
  grey: {
    0: '#faf9f8',
    100: '#efedeb',
    200: '#e4e0dc',
    300: '#d7d2cc',
    400: '#c9c3bb',
    500: '#bab2a7',
    600: '#a99e91',
    700: '#948777',
    800: '#766a5c',
    900: '#453e36',
  },
  navy: {
    900: '#050D52',
    shadow: 'rgba(2,5,30,0.5)',
  }
}

const fonts = {
  body: 'system-ui',
  heading: 'inherit',
  monospace: 'Menlo',
}

const theme = {
  breakpoints,
  colors,
  fonts,
}

export default theme
