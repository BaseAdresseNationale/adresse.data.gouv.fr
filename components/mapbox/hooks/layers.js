import {useMemo} from 'react'

import {getContourFillLayer, getContourLineLayer} from '../layers/contour'
import {getNumerosPointLayer, getNumerosLabelLayer} from '../layers/numeros'
import {getPositionsPointLayer, getPositionsLabelLayer} from '../layers/positions'

function useLayers(contour, voies, numeros, numero) {
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

    if (numero) {
      layers.push(getPositionsPointLayer())
      layers.push(getPositionsLabelLayer())
    }

    return layers
  }, [contour, voies, numeros, numero])
}

export default useLayers
