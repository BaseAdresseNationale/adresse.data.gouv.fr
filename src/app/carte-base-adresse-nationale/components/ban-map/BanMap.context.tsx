import { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react'
import { useMap } from 'react-map-gl/maplibre'

import type { LngLatBoundsLike } from 'react-map-gl/maplibre'
import type { FlyToOptions } from 'maplibre-gl'

import type { BanMapConfig, BanMapAction } from './types'

interface BanMapProviderProps {
  children: React.ReactNode
}

interface Position {
  position: {
    coordinates: [number, number]
  }
  positionType?: string
}
export interface MapItem {
  displayBBox: number[]
  positions?: Position[]
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

const getBboxFromPositions = (positions: Position[]): [number, number, number, number] => {
  return positions.reduce<[number, number, number, number]>(
    (acc, entry: Position) => {
      const [lng, lat] = entry.position.coordinates
      acc[0] = Math.min(acc[0], lng)
      acc[1] = Math.min(acc[1], lat)
      acc[2] = Math.max(acc[2], lng)
      acc[3] = Math.max(acc[3], lat)
      return acc
    },
    [
      positions[0].position.coordinates[0],
      positions[0].position.coordinates[1],
      positions[0].position.coordinates[0],
      positions[0].position.coordinates[1],
    ],
  )
}

const defaultAnimationFlyToOptions: FlyToOptions = {
  padding: 30,
  animate: true,
  duration: 1250,
}

export function useFocusOnMap(item: MapItem) {
  const map = useMap()

  if (!map) {
    throw new Error('useFocusOnMap must be used inside a MapProvider')
  }

  const [bound, setBound] = useState<LngLatBoundsLike>()

  useEffect(() => {
    const updateBound = () => {
      if (item?.displayBBox?.length === 4) {
        setBound(item.displayBBox as LngLatBoundsLike)
      } else {
        setBound(undefined)
      }
    }

    updateBound()
  }, [map, item])

  const focusOnMap = useCallback((options = {}) => {
    const boundPositions: LngLatBoundsLike | undefined = ((item.positions && item.positions?.length) || 0) > 0
      ? getBboxFromPositions(item.positions as Position[])
      : undefined

    const preferedBound = boundPositions || bound
    if (preferedBound) {
      map.current?.fitBounds(preferedBound, {
        ...defaultAnimationFlyToOptions,
        ...options,
      })
    }
  }, [bound, item.positions, map])

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
    (coords: [number, number], option?: FlyToOptions) => {
      flyTo({
        center: coords,
        essential: true,
        ...defaultAnimationFlyToOptions,
        duration: (defaultAnimationFlyToOptions.duration || 0) / 2,
        ...(option || {}),
      })
    },
    [flyTo]
  )

  return { flyTo, mapFlyTo }
}
