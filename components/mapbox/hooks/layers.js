import {useMemo} from 'react'

import {getContourFillLayer, getContourLineLayer} from '../layers/contour'
import {getNumerosPointLayer, getNumerosLabelLayer} from '../layers/numeros'

function useLayers(contour, voies, numeros) {
  return useMemo(() => {
    const layers = []

    if (contour) {
      layers.push(getContourFillLayer())
      layers.push(getContourLineLayer())
    }

    if (numeros) {
      layers.push(getNumerosPointLayer())
      layers.push(getNumerosLabelLayer())
    }

    return layers
  }, [contour, voies, numeros])
}

export default useLayers
