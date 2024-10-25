import { fr } from '@codegouvfr/react-dsfr'

const theme = {
  breakpoints: fr.breakpoints.values,
  colors: {
    primary: {
      bg: fr.colors.decisions.background.alt.blueFrance.default,
      main: fr.colors.decisions.text.actionHigh.blueFrance.default,
      badge: fr.colors.decisions.background.alt.blueFrance.active,
      border: fr.colors.decisions.border.default.blueFrance.default,
    },
    secondary: {
      bg: fr.colors.decisions.background.alt.pinkTuile.default,
      main: fr.colors.decisions.background.alt.pinkTuile.active,
      badge: fr.colors.decisions.background.alt.pinkTuile.active,
      border: fr.colors.decisions.border.default.pinkTuile.default,
    },
    grey: {
      bg: fr.colors.decisions.background.alt.grey.default,
      main: fr.colors.decisions.text.default.grey.default,
      badge: fr.colors.decisions.background.alt.grey.active,
      border: fr.colors.decisions.border.default.grey.default,
    },
  },
}

export type ColorTheme = keyof typeof theme.colors

export const toolsColors = {
  mesAdresses: '#469c76',
  moissonneur: '#E69F00',
  api: '#F0E442',
  formulaire: '#0072B2',
}

export default theme
