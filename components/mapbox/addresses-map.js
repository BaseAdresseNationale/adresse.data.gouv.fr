import {useEffect} from 'react'
import PropTypes from 'prop-types'

import useSources from './hooks/sources'
import useLayers from './hooks/layers'

function AddressesMap({contour, setSources, setLayers}) {
  const sources = useSources(contour)
  const layers = useLayers(contour)

  useEffect(() => {
    setSources(sources)
    setLayers(layers)
  }, [sources, layers, setSources, setLayers])

  return null
}

AddressesMap.propTypes = {
  contour: PropTypes.shape({
    features: PropTypes.array.isRequired
  }),
  setSources: PropTypes.func.isRequired,
  setLayers: PropTypes.func.isRequired
}

export default AddressesMap
