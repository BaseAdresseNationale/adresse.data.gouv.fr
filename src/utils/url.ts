// encodeURIComponent laisse passer '.' et '..', que l'analyseur d'URL résout vers le dossier parent.
export function encodePathSegment(value: string): string {
  if (value === '' || value === '.' || value === '..') {
    throw new Error('Segment de chemin invalide')
  }
  return encodeURIComponent(value)
}
