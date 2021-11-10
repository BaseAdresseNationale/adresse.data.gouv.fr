import colors from './colors'

const breakPoints = {
  desktop: '1024px',
  laptop: '768px',
  tablet: '480px',
  mobile: '320px'
}

export default ({
  // Expose colors
  colors,

  breakPoints,

  primary: colors.blue,
  primaryLight: colors.lightBlue,
  primaryDark: colors.darkBlue,
  secondary: colors.blue,
  secondaryDarken: colors.darkBlue,

  border: colors.grey,
  borderLighter: colors.lightGrey,
  borderActive: colors.lightBlue,
  borderSeparator: colors.transparentBlue,
  borderRadius: '5px',

  backgroundWhite: colors.white,
  backgroundGrey: colors.lighterGrey,
  backgroundColor: colors.blue,
  backgroundDark: colors.black,
  boxShadow: colors.lightGrey,
  darkText: colors.almostBlack,

  successBorder: colors.green,
  successBg: colors.lightGreen,
  warningBorder: colors.orange,
  warningBg: colors.lightOrange,
  errorBorder: colors.red,
  errorBg: colors.lightRed,
  infoBorder: colors.blue,
  infoBg: colors.lighterBlue
})
