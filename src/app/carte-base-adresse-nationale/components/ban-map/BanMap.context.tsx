import { createContext, useContext, useReducer } from 'react'
import type { ReactNode } from 'react'

import type { BanMapConfig, BanMapAction } from './types'

interface BanMapProviderProps {
  children: ReactNode
}

const initBanMapConfig = {
  mapStyle: 'ign-vector',
  displayLandRegister: false,
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
  return useContext(BanMapContext) as [{ mapStyle: string, displayLandRegister: boolean }, (action: any) => void]
}
