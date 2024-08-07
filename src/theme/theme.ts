import { fr } from '@codegouvfr/react-dsfr'

const theme = {
  breakpoints: fr.breakpoints.values,
  colors: {
    primary: {
      bg: fr.colors.decisions.background.alt.blueFrance.default,
      main: fr.colors.decisions.text.actionHigh.blueFrance.default,
      badge: fr.colors.decisions.background.alt.blueFrance.active,
    },
    secondary: {
      bg: fr.colors.decisions.background.alt.pinkTuile.default,
      main: fr.colors.decisions.background.alt.pinkTuile.active,
      badge: fr.colors.decisions.background.alt.pinkTuile.active,
    },
  },
}

export type ColorTheme = keyof typeof theme.colors

export default theme
