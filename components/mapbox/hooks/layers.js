import {useMemo} from 'react'

import {getContourFillLayer, getContourLineLayer} from '../layers/contour'
import {getVoiesLabelLayer, getToponymesLabelLayer} from '../layers/voies'
import {getNumerosPointLayer, getNumerosLabelLayer} from '../layers/numeros'
import {getPositionsPointLayer, getPositionsLabelLayer} from '../layers/positions'

function useLayers(contour, voies, numeros, numero) {
  return useMemo(() => {
    const layers = []

    if (contour) {
      layers.push(getContourFillLayer())
      layers.push(getContourLineLayer())
    }

    if (voies) {
      layers.push(getVoiesLabelLayer())
      layers.push(getToponymesLabelLayer())
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
