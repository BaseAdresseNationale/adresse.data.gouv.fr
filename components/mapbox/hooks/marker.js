import {useState, useEffect} from 'react'
import mapboxgl from 'mapbox-gl'

function useMarker(map) {
  const [marker, setMarker] = useState(new mapboxgl.Marker())
  const [markerCoordinates, setMarkerCoordinates] = useState(null)

  useEffect(() => {
    if (markerCoordinates) {
      if (marker && map) {
        marker.setLngLat(markerCoordinates)
        marker.addTo(map)
      } else {
        setMarker(new mapboxgl.Marker())
      }
    } else {
      marker.remove()
    }
  }, [map, markerCoordinates, marker])

  return [marker, setMarkerCoordinates]
}

export default useMarker
