import {useState, useEffect} from 'react'
import mapboxgl from 'mapbox-gl'

function usePopup(marker) {
  const [popup, setPopup] = useState(new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  }))

  useEffect(() => {
    if (marker) {
      marker.setPopup(popup)
    }
  }, [marker, popup])

  return [popup, setPopup]
}

export default usePopup
