const errorMsg = {
  'Failed to fetch': 'Impossible de récupérer les données.',
  'No position': 'Aucune position à afficher.',
  WebGL: 'Un problème est survenu, vérifier que WebGl est bien activé et actualiser la page.'
}

export function getErrorMsg(error) {
  return errorMsg[error] || 'Une erreur inconnue a été rencontrée.'
}

export default errorMsg
