import {useMemo} from 'react'

import {getContourFillLayer, getContourLineLayer} from '../layers/contour'

function useLayers(contour) {
  return useMemo(() => {
    const layers = []

    if (contour) {
      layers.push(getContourFillLayer())
      layers.push(getContourLineLayer())
    }

    return layers
  }, [contour])
}

export default useLayers
