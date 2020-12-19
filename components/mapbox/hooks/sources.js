import {useMemo} from 'react'

function useSources(contour) {
  return useMemo(() => {
    const sources = []

    if (contour && contour.features.length > 0) {
      sources.push({
        name: 'contour',
        type: 'geojson',
        data: contour
      })
    }

    return sources
  }, [contour])
}

export default useSources
