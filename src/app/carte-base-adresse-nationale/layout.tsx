'use client'

import { useCallback, useState, useContext, useEffect, useId, useRef, type ReactNode } from 'react'
import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip'

import SearchBAN from '@/components/SearchBAN'
import { BALWidgetContext } from '@/contexts/BALWidget.context'
import { useMainLayout } from '@/layouts/MainLayout'

import { BanMapProvider, useBanMapConfig } from './components/ban-map/BanMap.context'
import { theme } from './components/ban-map/theme'
import Legend from './components/Legend'
import LayersPanel from './components/LayersPanel'

import {
  CartoWrapper,
  CartoMenu,
  MapParamsWrapper,
  RingButtonStyled,
  LegendList,
  PointPaint,
} from './layout.styles'
import PanelTOM from './components/PanelTOM/PanelTOM'

const RingButton = ({ tooltip, ...props }: { tooltip?: string, [key: string]: any }) => {
  return tooltip
    ? (
        <Tooltip kind="hover" title={tooltip}>
          <RingButtonStyled {...props} />
        </Tooltip>
      )
    : (
        <RingButtonStyled {...props} />
      )
}

function Carto({ children }: { children: ReactNode }) {
  const { setTypeLayout } = useMainLayout()

  // Un seul panneau ouvert à la fois sous les boutons de la carte
  const [openPanel, setOpenPanel] = useState<'legend' | 'tom' | 'layers' | null>(null)
  const isLegendVisible = openPanel === 'legend'
  const isTOMVisible = openPanel === 'tom'
  const isLayersVisible = openPanel === 'layers'
  const layersPanelId = useId()
  const layersButtonRef = useRef<HTMLButtonElement>(null)
  const banMapConfigState = useBanMapConfig()
  const [banMapConfig, dispatchToBanMapConfig] = banMapConfigState
  const { mapStyle, buttonMapStyle, isIGNMapStyleAccessible, displayLandRegister, displayRnbBuildings, displayMenuConfig } = banMapConfig

  useEffect(() => {
    setTypeLayout('full-screen')
    window?.setTimeout(() => window?.scrollTo(0, 1), 1000)
    return () => setTypeLayout('default')
  }, [setTypeLayout])

  const togglePanel = useCallback((panel: 'legend' | 'tom' | 'layers') => {
    setOpenPanel(current => current === panel ? null : panel)
  }, [])

  const closeLayersPanel = useCallback(() => {
    setOpenPanel(null)
    layersButtonRef.current?.focus()
  }, [])

  const handleMapStyleChange = useCallback((style: string) => {
    dispatchToBanMapConfig({ type: 'SET_BUTTON_MAP_STYLE', payload: style })
  }, [dispatchToBanMapConfig])

  const handleLandRegisterChange = useCallback((isDisplayed: boolean) => {
    dispatchToBanMapConfig({ type: 'TOGGLE_CADASTER_LAYER', payload: isDisplayed })
  }, [dispatchToBanMapConfig])

  const handleRnbBuildingsChange = useCallback((isDisplayed: boolean) => {
    dispatchToBanMapConfig({ type: 'TOGGLE_RNB_LAYER', payload: isDisplayed })
  }, [dispatchToBanMapConfig])

  return (
    <CartoWrapper>
      <CartoMenu>
        <SearchBAN />

        <MapParamsWrapper $isHidden={!displayMenuConfig}>
          <RingButton tooltip="Légende" className={isLegendVisible ? 'ri-close-large-line' : 'ri-apps-2-line'} onClick={() => togglePanel('legend')} $isActive={isLegendVisible} $isButtonAvailable />
          <RingButton tooltip="Zoom sur un territoire" className={isTOMVisible ? 'ri-close-large-line' : 'ri-earth-line'} onClick={() => togglePanel('tom')} $isActive={isTOMVisible} $isButtonAvailable />
          <RingButton
            ref={layersButtonRef}
            tooltip="Couches"
            aria-label="Couches"
            aria-expanded={isLayersVisible}
            aria-controls={layersPanelId}
            className={isLayersVisible ? 'ri-close-large-line' : 'fr-icon-stack-line'}
            onClick={() => togglePanel('layers')}
            $isActive={isLayersVisible}
            $isButtonAvailable
          />
        </MapParamsWrapper>

        <Legend className="layer" isVisible={displayMenuConfig && isLegendVisible}>
          <LegendList>
            <li><span><PointPaint $fill={theme.bal} /> Source Base Adresse Locale</span></li>
            <li><span><PointPaint $fill={theme.noBal} /> Source Assemblage</span></li>
            <li><span><PointPaint $stroke={theme.certified} /> Adresse certifiée</span></li>
            <li><span><PointPaint $stroke={theme.noCertified} /> Adresse non certifiée</span></li>
          </LegendList>
        </Legend>

        <PanelTOM
          isVisible={displayMenuConfig && isTOMVisible}
        />

        {displayMenuConfig && isLayersVisible && (
          <LayersPanel
            id={layersPanelId}
            mapStyle={mapStyle}
            buttonMapStyle={buttonMapStyle}
            isIGNMapStyleAccessible={isIGNMapStyleAccessible}
            displayLandRegister={displayLandRegister}
            displayRnbBuildings={displayRnbBuildings}
            onMapStyleChange={handleMapStyleChange}
            onLandRegisterChange={handleLandRegisterChange}
            onRnbBuildingsChange={handleRnbBuildingsChange}
            onClose={closeLayersPanel}
          />
        )}

      </CartoMenu>
      { children }
    </CartoWrapper>
  )
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const balWidgetContext = useContext(BALWidgetContext)
  const { hideWidget, showWidget } = balWidgetContext || {}

  useEffect(() => {
    if (hideWidget && showWidget) {
      hideWidget()
      return () => showWidget()
    }
  }, [hideWidget, showWidget])

  return (
    <BanMapProvider>
      <Carto>
        { children }
      </Carto>
    </BanMapProvider>
  )
}
