export function getContourFillLayer() {
  return {
    id: 'contour-fill',
    type: 'fill',
    source: 'contour',
    paint: {
      'fill-color': '#006Be6',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.6,
        0.3
      ]
    }
  }
}

export function getContourLineLayer() {
  return {
    id: 'contour-line',
    type: 'line',
    source: 'contour',
    paint: {
      'line-color': '#003B80',
      'line-width': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        3,
        1
      ]
    }
  }
}
