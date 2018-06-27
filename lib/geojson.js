export function addressesToGeoJson(addresses) {
  const addrs = addresses.filter(address => address.position)

  return {
    type: 'FeatureCollection',
    features: addrs.map(address => {
      return {
        type: 'Feature',
        geometry: {
          type: address.position.type,
          coordinates: address.position.coordinates
        },
        properties: {
          id: address.id,
          idVoie: address.idVoie,
          numero: address.numero,
          sources: address.sources,
          destination: address.destination ? address.destination[0] : null
        }
      }
    }
  )}
}

export function addressToGeoJson(address) {
  const entries = address.entries.filter(entry => entry.position)

  return {
    type: 'FeatureCollection',
    features: entries.map(entry => {
      return {
        type: 'Feature',
        geometry: {
          type: entry.position.type,
          coordinates: entry.position.coordinates
        },
        properties: {
          id: address.id,
          idVoie: address.idVoie,
          numero: address.numero,
          source: entry.source,
          destination: address.destination ? address.destination[0] : null
        }
      }
    }
  )}
}

export function numerosToGeoJson(numeros) {
  const numbers = numeros.filter(numero => numero.positions.length > 0)
  const positions = []

  numbers.map(numero => {
    numero.positions.map(position => {
      if (position.coords.length === 2) {
        positions.push({numero, position})
      }
      return null
    })
    return null
  })

  return {
    type: 'FeatureCollection',
    features: positions.map(pos => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: pos.position.coords
        },
        properties: {
          id: pos.numero.id,
          numero: pos.numero.numeroComplet,
          source: pos.position.source,
          type: pos.position.type,
          lastUpdate: pos.position.dateMAJ
        }
      }
    }
    )
  }
}

export function contoursToGeoJson(communes) {
  const entries = communes.filter(commune => commune.contour)

  return {
    type: 'FeatureCollection',
    features: entries.map(commune => {
      const {contour} = commune

      return {
        type: 'Feature',
        geometry: {
          type: contour.type,
          coordinates: contour.coordinates
        },
        properties: {
          code: commune.code,
          nom: commune.nom
        }
      }
    }
    )
  }
}

export default {
  addressesToGeoJson,
  addressToGeoJson,
  contoursToGeoJson
}
