const errorMsg = {
  'Failed to fetch': 'Impossible de récupérer les données.',
  'No position': 'Aucune position à afficher.',
  WebGL: 'Votre navigateur ne supporte pas la technologie WebGL permettant d’afficher la carte.'
}

export function getErrorMsg(error) {
  return errorMsg[error] || 'Une erreur inconnue a été rencontrée.'
}

export default errorMsg
