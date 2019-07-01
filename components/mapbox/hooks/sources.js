import {useMemo} from 'react'

function useSources(contour, voies, numeros) {
  return useMemo(() => {
    const sources = []

    if (contour && contour.features.length > 0) {
      sources.push({
        name: 'contour',
        type: 'geojson',
        data: contour
      })
    }

    if (voies && voies.features.length > 0) {
      sources.push({
        name: 'voies',
        type: 'geojson',
        data: voies
      })
    }

    if (numeros && numeros.features.length > 0) {
      sources.push({
        name: 'positions',
        type: 'geojson',
        data: numeros
      })
    }

    return sources
  }, [contour, voies, numeros])
}

export default useSources
