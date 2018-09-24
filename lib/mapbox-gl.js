export function pointOnPos(position) {
  const {lat, lng} = position

  return {
    type: 'Point',
    coordinates: [lng, lat]
  }
}

export function pointOnCoords(coords) {
  return {
    type: 'Point',
    coordinates: coords || [0, 0]
  }
}
