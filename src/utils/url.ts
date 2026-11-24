// encodeURIComponent laisse passer '.' et '..', que l'analyseur d'URL résout vers le dossier parent.
export function encodePathSegment(value: string): string {
  if (value === '' || value === '.' || value === '..') {
    throw new Error('Segment de chemin invalide')
  }
  return encodeURIComponent(value)
}

const INTERNAL_HOST = 'internal.invalid'

const hasControlCharacter = (value: string) => [...value].some((character) => {
  const code = character.charCodeAt(0)
  return code < 0x20 || code === 0x7F
})

// Chemin interne du site, sinon '/'. L'analyseur d'URL retire tabulations et retours à la ligne,
// lit '\' comme '/' et refait un '//' en tête à partir de segments '.' ou '..' : chaque cas est refusé.
export function toInternalPath(value: string | null | undefined): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value[1] === '/' || value.includes('\\')) {
    return '/'
  }
  if (hasControlCharacter(value) || /^\/%(5c|2f)/i.test(value)) {
    return '/'
  }

  const url = new URL(value, `http://${INTERNAL_HOST}`)
  const path = `${url.pathname}${url.search}${url.hash}`
  if (url.host !== INTERNAL_HOST || !path.startsWith('/') || path.startsWith('//')) {
    return '/'
  }
  return path
}
