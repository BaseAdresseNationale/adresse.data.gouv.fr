import type { MapGeoJSONFeature } from 'react-map-gl/maplibre'

export interface Address {
  id: string
  type: string
  voie: {
    nomVoie: string
  }
  parcelles?: string[]
  positions?: {
    position: {
      coordinates: [number, number]
    }
    positionType?: string
  }[]
  displayBBox?: number[]
}

export interface BanMapConfig {
  mapStyle: string
  displayLandRegister: boolean
}

interface SetMapStyleAction {
  type: 'SET_MAP_STYLE' | 'TOGGLE_CADASTER_LAYER'
  payload: string | boolean
}

export type BanMapAction = SetMapStyleAction

export interface BBox {
  flat: () => number[]
}

export interface PopupInfo {
  features: MapGeoJSONFeature[]
  lngLat: {
    lat: number
    lng: number
  }
}
