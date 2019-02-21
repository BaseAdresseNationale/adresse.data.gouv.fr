const EMPTY_FEATURE_COLLECTION = {
  type: 'FeatureCollection',
  features: []
}

export function secureAddLayer(map, layer) {
  if (!map.getLayer(layer.id)) {
    map.addLayer(layer)
  }
}

export function secureAddSource(map, id, data) {
  if (!map.getSource(id)) {
    const geojson = {
      type: 'geojson',
      data: data ? data : EMPTY_FEATURE_COLLECTION
    }

    map.addSource(id, geojson)
  }
}

export function secureUpdateData(map, id, data) {
  const source = map.getSource(id)

  if (source) {
    source.setData(data)
  } else {
    secureAddSource(map, id, data)
  }
}
