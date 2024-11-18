'use client'

import { useCallback, useState, useContext, useEffect } from 'react'
import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip'

import SearchBAN from '@/components/SearchBAN'
import { BALWidgetContext } from '@/contexts/BALWidget.context'

import { BanMapProvider, useBanMapConfig } from './components/ban-map/BanMap.context'
import { theme } from './components/ban-map/theme'
import Legend from './components/Legend'
import {
  CartoWrapper,
  CartoMenu,
  CartoBody,
  MapParamsWrapper,
  RingButtonStyled,
  LegendList,
  PointPaint,
} from './layout.styles'

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
  const [isLegendVisible, setIsLegendVisible] = useState(false)
  const banMapConfigState = useBanMapConfig()
  const [banMapConfig, dispatchToBanMapConfig] = banMapConfigState
  const { mapStyle, displayLandRegister } = banMapConfig

  const toggleLegend = useCallback(() => {
    setIsLegendVisible(!isLegendVisible)
  }, [isLegendVisible])

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

        <MapParamsWrapper>
          <RingButton tooltip="Légende" className={isLegendVisible ? 'ri-close-large-line' : 'ri-apps-2-line'} onClick={toggleLegend} $isActive={isLegendVisible} />
          <RingButton tooltip="Afficher les parcelles cadastrales" className={displayLandRegister ? 'ri-collage-fill' : 'ri-collage-line'} onClick={toggleCadasterLayer} $isActive={displayLandRegister} />
          <RingButton tooltip="Utiliser les fonds IGN" $img="/img/map/bg-button-map-style-ign-vector.png" onClick={() => handleMapStyleChange('ign-vector')} $isActive={banMapConfig.mapStyle === 'ign-vector'} $isTypeRadio />
          <RingButton tooltip="Utiliser le fond OSM" $img="/img/map/bg-button-map-style-osm-vector.png" onClick={() => handleMapStyleChange('osm-vector')} $isActive={banMapConfig.mapStyle === 'osm-vector'} $isTypeRadio />
          <RingButton tooltip="Utiliser la vue satellite" $img="/img/map/bg-button-map-style-ign-ortho.png" onClick={() => handleMapStyleChange('ign-ortho')} $isActive={banMapConfig.mapStyle === 'ign-ortho'} $isTypeRadio />
        </MapParamsWrapper>

        <Legend className="layer" isVisible={isLegendVisible}>
          <LegendList>
            <li><span><PointPaint $fill={theme.bal} /> Source BAL</span></li>
            <li><span><PointPaint $fill={theme.noBal} /> Source Assemblage IGN</span></li>
            <li><span><PointPaint $stroke={theme.certified} /> Adresse certifiée</span></li>
            <li><span><PointPaint $stroke={theme.noCertified} /> Adresse non certifiée</span></li>
          </LegendList>
        </Legend>
      </CartoMenu>

      <CartoBody>
        { children }
      </CartoBody>
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
      <Carto>
        { children }
      </Carto>
    </BanMapProvider>
  )
}
