import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MapMouseEvent, Popup, useMap } from 'react-map-gl/maplibre'
import { toolsColors } from '@/theme/theme'
import { useRouter } from 'next/navigation'

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
            `

const paintLayers = {
  source: {
    name: 'Déploiement BAL',
    legend: [
      {
        title: 'Déploiement BAL',
        content: {
          mesadresses: { name: 'Mes Adresses', color: toolsColors.mesAdresses },
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
      ],
      default: '#ddd',
    },
  },
  bal: {
    name: 'Suivi Mes Adresses',
    legend: [
      {
        title: 'Mes Adresses',
        content: {
          published: { name: 'Publiée', color: toolsColors.mesAdresses },
          draft: { name: 'Brouillon', color: `${toolsColors.mesAdresses}80` },
        },
      },
      {
        title: 'Autre source',
        content: {
          other: { name: 'Api, formulaire, moissonneur', color: `${toolsColors.api}80` },
        },
      },
    ],

    paint: {
      styles: [
        {
          expression: [
            ['==', ['get', 'statusBals'], 'published'],
          ], // Mes Adresses
          color: toolsColors.mesAdresses,
        },
        {
          expression: [
            ['==', ['get', 'statusBals'], 'draft'],
          ], // Mes Adresses
          color: `${toolsColors.mesAdresses}80`,
        },
        {
          expression: [
            ['==', ['get', 'hasBAL'], true],
          ],
          color: `${toolsColors.api}80`,
        },
      ],
      default: '#ddd',
    },
  },
}

export const getStyle = (selectedPaintLayer: 'source' | 'bal', filteredCodesCommmune: string[]) => {
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
  selectedPaintLayer: 'source' | 'bal'
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
      map?.setFeatureState({ source: 'data', id: selectedRef.current }, { hover: false })
      selectedRef.current = null
    }
    if (hoveredRef.current) {
      map?.setFeatureState({ source: 'data', id: hoveredRef.current }, { hover: false })
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
        map.setFeatureState({ source: 'data', id: feature.id }, { hover: true })
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
        map.setFeatureState({ source: 'data', id: hoveredRef.current }, { hover: false })
      }

      hoveredRef.current = feature.id
      map.setFeatureState({ source: 'data', id: feature.id }, { hover: true })
    }

    const onMouseLeave = () => {
      if (!map) {
        return
      }

      if (hoveredRef.current) {
        map.setFeatureState({ source: 'data', id: hoveredRef.current }, { hover: false })
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
        <Popup latitude={popup.latitude} longitude={popup.longitude} onClose={closePopup}>
          <div>
            <b>{popup.properties.nom} ({popup.properties.code})</b>
            <div>Nombre d’adresses : {popup.properties.nbNumeros}</div>
            <div>{`${popup.properties.certificationPercentage ? `Taux de certification : ${popup.properties.certificationPercentage}%` : 'Aucune adresse n’est certifiée par la commune'}`}</div>
            {popup.properties.hasBAL ? <div>Déposé via : {popup.properties.nomClient}</div> : <div>Ne dispose pas d&apos;une BAL</div>}
            <a href={`/commune/${popup.properties.code}`}>Voir la page commune</a>
          </div>
        </Popup>
      )}
    </StyledWrapper>
  )
}
