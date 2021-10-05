import {useState, useEffect} from 'react'
import maplibregl from 'maplibre-gl'

function useMarker(map) {
  const [marker, setMarker] = useState(new maplibregl.Marker())
  const [markerCoordinates, setMarkerCoordinates] = useState(null)

  useEffect(() => {
    if (markerCoordinates) {
      if (marker && map) {
        marker.setLngLat(markerCoordinates)
        marker.addTo(map)
      } else {
        setMarker(new maplibregl.Marker())
      }
    } else {
      marker.remove()
    }
  }, [map, markerCoordinates, marker])

  return [marker, setMarkerCoordinates]
}

export default useMarker
