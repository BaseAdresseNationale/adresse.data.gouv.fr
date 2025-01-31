import { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react'
import { useMap } from 'react-map-gl/maplibre'

import type { LngLatBoundsLike } from 'react-map-gl/maplibre'

import type { BanMapConfig, BanMapAction } from './types'

interface BanMapProviderProps {
  children: React.ReactNode
}

interface MapItem {
  displayBBox: number[]
}

const initBanMapConfig = {
  mapStyle: 'osm-vector',
  displayLandRegister: false,
  displayMenuConfig: true,
}

const BanMapContext = createContext<[BanMapConfig, React.Dispatch<BanMapAction>] | null>(null)

function banMapReducer(
  banMapConfig: BanMapConfig,
  action: BanMapAction,
): BanMapConfig {
  console.log('banMapReducer', banMapConfig, action)
  switch (action.type) {
    case 'SET_MAP_STYLE': {
      return {
        ...banMapConfig,
        mapStyle: action.payload as string,
      }
    }
    case 'TOGGLE_CADASTER_LAYER': {
      return {
        ...banMapConfig,
        displayLandRegister: action.payload as boolean,
      }
    }
    case 'TOOGLE_MENU_CONFIG': {
      return {
        ...banMapConfig,
        displayMenuConfig: action.payload as boolean,
      }
    }
    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}

export function BanMapProvider({ children }: BanMapProviderProps) {
  const [banMapConfig, dispatchToBanMapConfig] = useReducer(
    banMapReducer,
    initBanMapConfig,
  )

  return (
    <BanMapContext.Provider
      value={[
        banMapConfig,
        dispatchToBanMapConfig,
      ]}
    >
      {children}
    </BanMapContext.Provider>
  )
}

export function useBanMapConfig() {
  return useContext(BanMapContext) as [BanMapConfig, (action: any) => void]
}

export function useFocusOnMap(item: MapItem) {
  const map = useMap()

  if (!map) {
    throw new Error('useFocusOnMap must be used inside a MapProvider')
  }

  const [bound, setBound] = useState<LngLatBoundsLike>()

  useEffect(() => {
    setBound(item?.displayBBox?.length === 4 ? (item.displayBBox as LngLatBoundsLike) : undefined)
  }, [map, item])

  const focusOnMap = useCallback(() => {
    if (bound) {
      map.current?.fitBounds(bound, {
        padding: 30,
      })
    }
  }, [bound, map])

  return focusOnMap
}

export const useMapFlyTo = () => {
  const map = useMap()

  if (!map) {
    throw new Error('useMapFlyTo must be used inside a MapProvider')
  }

  const flyTo = map.current?.flyTo
  if (!flyTo) {
    throw new Error('flyTo is not available')
  }

  const mapFlyTo = useCallback(
    (coords: [number, number]) => {
      flyTo({
        center: coords,
        essential: true,
      })
    },
    [flyTo]
  )

  return { flyTo, mapFlyTo }
}
