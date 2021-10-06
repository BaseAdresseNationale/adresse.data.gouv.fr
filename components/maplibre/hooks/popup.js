import {useState, useEffect} from 'react'
import maplibregl from 'maplibre-gl'

function usePopup(marker) {
  const [popup, setPopup] = useState(new maplibregl.Popup({
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
