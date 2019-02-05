export function secureAddLayer(map, layer) {
  if (!map.getLayer(layer.id)) {
    map.addLayer(layer)
  }
}

export function secureAddSource(map, id, data) {
  if (!map.getSource(id)) {
    map.addSource(id, {
      type: 'geojson',
      data
    })
  }
}