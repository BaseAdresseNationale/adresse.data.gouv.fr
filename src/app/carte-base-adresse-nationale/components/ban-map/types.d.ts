import type { MapGeoJSONFeature } from 'react-map-gl/maplibre'

export interface Territory {
  id: string
  title: string
  description: string
  zoom?: string | null
  bbox: number[]
  thumbnail: string
  icon: string
  mapStyle?: string
}

export interface Address {
  id: string
  type: string
  voie: {
    nomVoie: string
  }
  parcelles?: string[]
  position: GeoJSON.Point
  positions?: {
    position: GeoJSON.Point
    positionType?: string
  }[]
  displayBBox?: number[]
}

export interface BanMapConfig {
  mapStyle: string
  buttonMapStyle?: string
  displayLandRegister: boolean
  displayIGNJ1: boolean
  displayMenuConfig: boolean
  isIGNMapStyleAccessible: boolean
}

interface SetMapStyleAction {
  type: 'SET_MAP_STYLE' | 'TOGGLE_CADASTER_LAYER' | 'TOGGLE_IGN_J1' | 'TOOGLE_MENU_CONFIG' | 'SET_BUTTON_MAP_STYLE' | 'SET_IGN_MAP_STYLE_ACCESSIBLE'
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
