export function createBALValidationError(message) {
  const err = new Error(message)
  err.balValidationError = true
  return err
}

const errorMsg = {
  'Commune has already been added': 'Cette commune a déjà été ajoutée',
  'Voie has already been added': 'Cette voie a déjà été ajoutée',
  'Failed to fetch': 'Impossible de récupérer les données.',
  'codeCommune error': 'Ce code commune n’est pas attribué.',
  WebGL: 'Votre navigateur ne supporte pas la technologie WebGL permettant d’afficher la carte.'
}

export function getErrorMsg(error) {
  if (error.balValidationError) {
    return error.message
  }

  return errorMsg[error] || 'Une erreur inconnue a été rencontrée.'
}

export default errorMsg
