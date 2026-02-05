'use client'

import { useCallback, useState, useContext, useEffect } from 'react'
import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip'

import SearchBAN from '@/components/SearchBAN'
import { BALWidgetContext } from '@/contexts/BALWidget.context'
import { useMainLayout } from '@/layouts/MainLayout'

import { BanMapProvider, useBanMapConfig } from './components/ban-map/BanMap.context'
import { theme } from './components/ban-map/theme'
import Legend from './components/Legend'
import { PublicEnvScript } from 'next-runtime-env'

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

function Carto({ children }: { children: JSX.Element }) {
  const { setTypeLayout } = useMainLayout()

  const [isLegendVisible, setIsLegendVisible] = useState(false)
  const [isTOMVisible, setIsTOMVisible] = useState(false)
  const banMapConfigState = useBanMapConfig()
  const [banMapConfig, dispatchToBanMapConfig] = banMapConfigState
  const { mapStyle, displayLandRegister, displayMenuConfig } = banMapConfig

  useEffect(() => {
    setTypeLayout('full-screen')
    window?.setTimeout(() => window?.scrollTo(0, 1), 1000)
    return () => setTypeLayout('default')
  }, [setTypeLayout])

  const toggleLegend = useCallback(() => {
    setIsLegendVisible(!isLegendVisible)
  }, [isLegendVisible])

  const toggleTOM = useCallback(() => {
    setIsTOMVisible(!isTOMVisible)
  }, [isTOMVisible])

  const handleMapStyleChange = useCallback((style: string) => {
    dispatchToBanMapConfig({ type: 'SET_MAP_STYLE', payload: style })
  }, [dispatchToBanMapConfig])

  const toggleCadasterLayer = useCallback(() => {
    dispatchToBanMapConfig({ type: 'TOGGLE_CADASTER_LAYER', payload: !displayLandRegister })
  }, [dispatchToBanMapConfig, displayLandRegister])

  return (
    <CartoWrapper>
      <CartoMenu>
        <SearchBAN />

        <MapParamsWrapper $isHidden={!displayMenuConfig}>
          <RingButton tooltip="Légende" className={isLegendVisible ? 'ri-close-large-line' : 'ri-apps-2-line'} onClick={toggleLegend} $isActive={isLegendVisible} />
          <RingButton tooltip="Afficher les parcelles cadastrales" className={displayLandRegister ? 'ri-collage-fill' : 'ri-collage-line'} onClick={toggleCadasterLayer} $isActive={displayLandRegister} />
          <RingButton tooltip="Utiliser le fond OSM" $img="/img/map/bg-button-map-style-osm-vector.png" onClick={() => handleMapStyleChange('osm-vector')} $isActive={mapStyle === 'osm-vector'} $isTypeRadio />
          <RingButton tooltip="Utiliser les fonds IGN" $img="/img/map/bg-button-map-style-ign-vector.png" onClick={() => handleMapStyleChange('ign-vector')} $isActive={mapStyle === 'ign-vector'} $isTypeRadio />
          <RingButton tooltip="Utiliser la vue satellite IGN" $img="/img/map/bg-button-map-style-ign-ortho.png" onClick={() => handleMapStyleChange('ign-ortho')} $isActive={mapStyle === 'ign-ortho'} $isTypeRadio />
          <RingButton tooltip="Zoom sur les TOM" className="ri-earth-line" onClick={toggleTOM} $isActive={isTOMVisible} />
        </MapParamsWrapper>

        <Legend className="layer" isVisible={displayMenuConfig && isLegendVisible}>
          <LegendList>
            <li><span><PointPaint $fill={theme.bal} /> Base Adresse Locale</span></li>
            <li><span><PointPaint $fill={theme.noBal} /> Adresse Produite par l’IGN</span></li>
            <li><span><PointPaint $stroke={theme.certified} /> Adresse certifiée</span></li>
            <li><span><PointPaint $stroke={theme.noCertified} /> Adresse non certifiée</span></li>
          </LegendList>
        </Legend>

        <PanelTOM 
        isVisible={isTOMVisible}
        />

      </CartoMenu>
      { children }
    </CartoWrapper>
  )
}

export default function RootLayout({ children }: { children: JSX.Element }) {
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
      <PublicEnvScript />
      <Carto>
        { children }
      </Carto>
    </BanMapProvider>
  )
}
