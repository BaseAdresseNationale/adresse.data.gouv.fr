export const DELETED_FILTER = ['!=', ['get', 'status'], 'deleted']
export const VDELETED_FILTER = ['!=', ['get', 'voieStatus'], 'deleted']

export const NUMEROS_FILTERS = [
  'all',
  DELETED_FILTER,
  VDELETED_FILTER
]

export const SELECTED_NUMEROS_FILTERS = [
  'all',
  ['==', ['get', 'codeVoie'], null],
  DELETED_FILTER,
  VDELETED_FILTER
]
