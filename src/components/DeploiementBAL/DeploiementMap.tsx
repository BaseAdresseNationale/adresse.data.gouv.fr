import React, { useCallback, useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import Button from '@codegouvfr/react-dsfr/Button'
import { MapMouseEvent, Popup, useMap } from 'react-map-gl/maplibre'
import { toolsColors } from '@/theme/theme'

const StyledWrapper = styled.div`
  .legend-wrapper {
      position: absolute;
      text-align: left;
      box-shadow: none;
      border: 2px solid #dcd8d5;
      border-radius: 4px;
      z-index: 1;
      padding: 0.5em;
      left: 13px;
      top: 8px;
      background-color: rgba(255,255,255,0.9);

      .legend-title {
        font-weight: bold;
        text-align: left;
    }

    .legend-container {
        display: flex;
        align-items: center;
        text-align: left;
    }

    .legend-color {
        width: 15px;
        height: 15px;
        margin-right: 0.5em;
    }
  }

  }
`

const DeploiementPopupGlobalStyle = createGlobalStyle`
  .deploiement-popup .maplibregl-popup-content {
    padding: 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
    text-align: left;
  }

  .deploiement-popup .maplibregl-popup-close-button {
    display: none;
  }
`

const PopupContent = styled.div<{ accentColor: string }>`
  font-family: inherit;
  min-width: 230px;

  .popup-header {
    background-color: ${({ accentColor }) => accentColor};
    color: #fff;
    padding: 12px 14px 10px;

    .header-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .commune-name {
      font-size: 1rem;
      font-weight: 700;
      margin: 0 0 3px;
      line-height: 1.2;
    }

    .commune-code {
      font-size: 0.75rem;
      opacity: 0.85;
    }

    .close-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: #fff;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      padding: 0;
      transition: background 0.15s;

      &:hover {
        background: rgba(255, 255, 255, 0.35);
      }
    }
  }

  .popup-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 14px 12px;
  }

  .popup-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    color: #3a3a3a;

    .row-label {
      color: #777;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .row-value {
      font-weight: 600;
      color: #1a1a1a;
    }
  }

  .popup-badge {
    display: inline-flex;
    align-items: center;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 12px;
    background-color: ${({ accentColor }) => accentColor}22;
    color: ${({ accentColor }) => accentColor};
    border: 1px solid ${({ accentColor }) => accentColor}55;
    align-self: flex-start;
  }

  .popup-no-bal {
    font-size: 0.78rem;
    color: #888;
    font-style: italic;
  }

  .popup-divider {
    border: none;
    border-top: 1px solid #eee;
    margin: 2px 0;
  }

  .popup-link-wrapper {
    margin-top: 4px;
    display: flex;

    > a, > button {
      flex: 1;
      justify-content: center;
    }
  }
`

const paintLayers = {
  source: {
    name: 'Déploiement BAL',
    legend: [
      {
        title: 'Mes Adresses',
        content: {
          published: { name: 'Publiée', color: toolsColors.mesAdresses },
          draft: { name: 'Brouillon', color: `${toolsColors.mesAdresses}80` },
        },
      },
      {
        title: 'Autres sources',
        content: {
          moissoneur: { name: 'Moissonneur', color: toolsColors.moissonneur },
          form: { name: 'Formulaire', color: toolsColors.formulaire },
          api: { name: 'Api', color: toolsColors.api },
        },
      },
      {
        title: 'BAN',
        content: {
          other: { name: 'Assemblage', color: '#ddd' },
        },
      },
    ],
    paint: {
      styles: [
        {
          expression: [
            ['==', ['get', 'hasBAL'], true],
            ['==', ['get', 'nomClient'], 'Mes Adresses'],
          ], // Mes Adresses
          color: toolsColors.mesAdresses,
        },
        {
          expression: [
            ['==', ['get', 'hasBAL'], true],
            ['==', ['get', 'nomClient'], 'Moissonneur BAL'],
          ], // Moissonneur
          color: toolsColors.moissonneur,
        },
        {
          expression: [
            ['==', ['get', 'hasBAL'], true],
            ['==', ['get', 'nomClient'], 'Formulaire de publication'],
          ], // Formulaire
          color: toolsColors.formulaire,
        },
        {
          expression: [
            ['==', ['get', 'hasBAL'], true],
            ['==', ['has', 'idClient'], true],
          ], // API
          color: toolsColors.api,
        },
        {
          expression: [
            ['==', ['get', 'hasBAL'], false],
            ['==', ['get', 'statusBals'], 'draft'],
          ], // Mes Adresses
          color: `${toolsColors.mesAdresses}80`,
        },
      ],
      default: '#ddd',
    },
  },
}

const getPopupAccentColor = (hasBAL: boolean, nomClient: string): string => {
  if (!hasBAL) return '#aaa'
  if (nomClient === 'Mes Adresses') return toolsColors.mesAdresses
  if (nomClient === 'Moissonneur BAL') return '#b88200' // toolsColors.moissonneur assombri pour le contraste
  if (nomClient === 'Formulaire de publication') return toolsColors.formulaire
  return '#8c8a00' // toolsColors.api assombri pour le contraste
}

export const getStyle = (selectedPaintLayer: 'source', filteredCodesCommmune: string[]) => {
  const stylePaint = ['case'] as any

  (paintLayers[selectedPaintLayer] as any).paint.styles.forEach((style: any) => {
    const { expression, color } = style
    const exp = [
      'all',
      ...expression,
    ]
    if (filteredCodesCommmune.length > 0) {
      const inFilteredCommunesExp = ['in', ['get', 'code'], ['literal', filteredCodesCommmune]]
      exp.push(inFilteredCommunesExp)
    }

    stylePaint.push(exp, color)
  })
  if (filteredCodesCommmune.length > 0) {
    stylePaint.push(
      ['in', ['get', 'code'], ['literal', filteredCodesCommmune]],
      '#ddd',
      'transparent')
  }
  else {
    stylePaint.push((paintLayers[selectedPaintLayer] as any).paint.default)
  }

  return stylePaint
}

interface DeploiementMapProps {
  center: [number, number]
  zoom: number
  filteredCodesCommmune: string[]
  selectedPaintLayer: 'source'
}

export default function DeploiementMap({ center, zoom, filteredCodesCommmune, selectedPaintLayer }: DeploiementMapProps) {
  const { current: map } = useMap()
  const hoveredRef = React.useRef<string | null>(null)
  const selectedRef = React.useRef<string | null>(null)
  const [popup, setPopup] = useState<{ latitude: number, longitude: number, properties: any } | null>(null)

  useEffect(() => {
    if (!map) {
      return
    }

    map.setCenter(center)
    map.setZoom(zoom)
  }, [map, center, zoom])

  const closePopup = useCallback(() => {
    setPopup(null)
    if (selectedRef.current) {
      map?.setFeatureState({ source: 'data', sourceLayer: 'communes', id: selectedRef.current }, { hover: false })
      selectedRef.current = null
    }
    if (hoveredRef.current) {
      map?.setFeatureState({ source: 'data', sourceLayer: 'communes', id: hoveredRef.current }, { hover: false })
      hoveredRef.current = null
    }
  }, [map])

  useEffect(() => {
    if (!map) {
      return
    }

    const onClick = (event: MapMouseEvent) => {
      const [feature] = (event as any).features
      if (filteredCodesCommmune.length === 0 || filteredCodesCommmune.includes(feature.properties.code)) {
        closePopup()
        setPopup({
          latitude: event.lngLat.lat,
          longitude: event.lngLat.lng,
          properties: feature.properties,
        })
        selectedRef.current = feature.id
        map.setFeatureState({ source: 'data', sourceLayer: 'communes', id: feature.id }, { hover: true })
      }
    }

    map.on('click', 'bal-polygon-fill', onClick)

    return () => {
      map.off('click', 'bal-polygon-fill', onClick)
    }
  }, [map, filteredCodesCommmune, closePopup])

  useEffect(() => {
    if (!map) {
      return
    }

    const onMouseMove = (event: MapMouseEvent) => {
      if (!map) {
        return
      }

      const [feature] = (event as any).features

      if (hoveredRef.current && hoveredRef.current !== selectedRef.current) {
        map.setFeatureState({ source: 'data', sourceLayer: 'communes', id: hoveredRef.current }, { hover: false })
      }

      hoveredRef.current = feature.id
      map.setFeatureState({ source: 'data', sourceLayer: 'communes', id: feature.id }, { hover: true })
    }

    const onMouseLeave = () => {
      if (!map) {
        return
      }

      if (hoveredRef.current) {
        map.setFeatureState({ source: 'data', sourceLayer: 'communes', id: hoveredRef.current }, { hover: false })
      }
    }

    map.on('mousemove', 'bal-polygon-fill', onMouseMove)
    map.on('mouseleave', 'bal-polygon-fill', onMouseLeave)

    return () => {
      map.off('mousemove', 'bal-polygon-fill', onMouseMove)
      map.off('mouseleave', 'bal-polygon-fill', onMouseLeave)
    }
  }, [map])

  return (
    <StyledWrapper>
      <DeploiementPopupGlobalStyle />
      <div
        className="legend-wrapper"
      >
        {
          paintLayers[selectedPaintLayer].legend.map(({ title, content }) => (
            <React.Fragment key={title}>
              <div className="legend-title">{title}</div>
              {Object.values(content).map(({ name, color }) => (
                <div className="legend-container" key={name}>
                  <div className="legend-color" style={{ backgroundColor: `${color}` }} />
                  <div>{name}</div>
                </div>
              ))}
            </React.Fragment>
          ))
        }
      </div>
      {popup && (
        <Popup className="deploiement-popup" latitude={popup.latitude} longitude={popup.longitude} onClose={closePopup}>
          <PopupContent accentColor={getPopupAccentColor(popup.properties.hasBAL, popup.properties.nomClient)}>
            <div className="popup-header">
              <div className="header-row">
                <p className="commune-name">{popup.properties.nom}</p>
                <button className="close-btn" onClick={closePopup} aria-label="Fermer">&#x2715;</button>
              </div>
              <span className="commune-code">Code INSEE : {popup.properties.code}</span>
            </div>
            <div className="popup-body">
              <div className="popup-row">
                <span className="row-label">Adresses :</span>
                <span className="row-value">{popup.properties.nbNumeros}</span>
              </div>
              <div className="popup-row">
                <span className="row-label">Certification :</span>
                <span className="row-value">
                  {popup.properties.certificationPercentage ? `${popup.properties.certificationPercentage}%` : 'Aucune'}
                </span>
              </div>
              <div className="popup-row">
                <span className="row-label">Source :</span>
                {popup.properties.hasBAL
                  ? <span className="popup-badge">{popup.properties.nomClient}</span>
                  : <span className="popup-no-bal">Pas de BAL&nbsp;d&eacute;pos&eacute;e</span>}
              </div>
              <div className="popup-link-wrapper">
                <Button linkProps={{ href: `/commune/${popup.properties.code}` }}>
                  Voir la page commune
                </Button>
              </div>
            </div>
          </PopupContent>
        </Popup>
      )}
    </StyledWrapper>
  )
}
