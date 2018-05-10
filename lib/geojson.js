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

export default {
  addressesToGeoJson,
  addressToGeoJson
}
