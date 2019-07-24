import {useMemo} from 'react'

export default function useSources(departements, communes) {
  return useMemo(() => {
    const sources = [{
      name: 'departements',
      type: 'geojson',
      data: departements
    }]

    if (communes && communes.features.length > 0) {
      sources.push({
        name: 'communes',
        type: 'geojson',
        data: communes
      })
    }

    return sources
  }, [departements, communes])
}
