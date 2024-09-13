import React, { useEffect, useState } from 'react'
import { renderToString } from 'react-dom/server'
import Router from 'next/router'
import styled from 'styled-components'
import { useMap } from 'react-map-gl/maplibre'
import { toolsColors } from '@/theme/theme'

const StyledWrapper = styled.div`
              .legend-container {
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
              }
    
              .warning {
                z-index: 1;
                position: absolute;
                display: flex;
                align-items: center;
                padding: 1em;
                margin: 20em 20em;
                background: #ffffffc4;
              }
    
              .warning-text {
                margin-left: 1em;
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
            ['==', ['get', 'idClient'], 'mes-adresses'],
          ], // Mes Adresses
          color: toolsColors.mesAdresses,
        },
        {
          expression: [
            ['==', ['get', 'hasBAL'], true],
            ['==', ['get', 'idClient'], 'moissonneur-bal'],
          ], // Moissonneur
          color: toolsColors.moissonneur,
        },
        {
          expression: [
            ['==', ['get', 'hasBAL'], true],
            ['==', ['get', 'idClient'], 'formulaire-publication'],
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
      // {
      //   title: 'Autre source',
      //   content: {
      //     other: { name: 'Api, formulaire, moissonneur', color: theme.colors.mapOrange },
      //   },
      // },
    ],

    // paint: {
    //   styles: [
    //     {
    //       expression: [
    //         ['==', ['get', 'statusBals'], 'published'],
    //       ], // Mes Adresses
    //       color: theme.colors.mapGreen,
    //     },
    //     {
    //       expression: [
    //         ['==', ['get', 'statusBals'], 'draft'],
    //       ], // Mes Adresses
    //       color: theme.colors.mapYellow,
    //     },
    //     {
    //       expression: [
    //         ['==', ['get', 'hasBAL'], true],
    //       ],
    //       color: theme.colors.mapOrange,
    //     },
    //   ],
    //   default: '#ddd',
    // },
  },
}

export const getStyle = (selectedPaintLayer: 'source' | 'bal', filteredCodesCommmune: string[]) => {
  const stylePaint = ['case']

  paintLayers[selectedPaintLayer].paint.styles.forEach((style) => {
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
    stylePaint.push(paintLayers[selectedPaintLayer].paint.default)
  }

  return stylePaint
}

// const popupHTML = ({ nom, code, nbNumeros, certificationPercentage, nomClient, hasBAL }) => renderToString(
//   <div>
//     <p>
//       <b>{nom} ({code})</b>
//     </p>
//     <div>Nombre d’adresses : {nbNumeros}</div>
//     <div>{`${certificationPercentage ? `Taux de certification : ${certificationPercentage}%` : 'Aucune adresse n’est certifiée par la commune'}`}</div>
//     {hasBAL ? <div>Déposé via : {nomClient}</div> : <div>Ne dispose pas d&apos;une BAL</div>}
//   </div>
// )

interface DeploiementMapProps {
  center: number[]
  zoom: number
  filteredCodesCommmune: string[]
  selectedPaintLayer: 'source' | 'bal'
  setSelectedPaintLayer: (layer: 'source' | 'bal') => void
}

export default function DeploiementMap({ center, zoom, filteredCodesCommmune, selectedPaintLayer, setSelectedPaintLayer }: DeploiementMapProps) {
  const { current: map } = useMap()
  const [currentCenter, setCurrentCenter] = useState(center)

  // const onMouseMove = (layer, event) => {
  //   const canvas = map.getCanvas()
  //   canvas.style.cursor = 'pointer'

  //   const [feature] = event.features

  //   if (this.highlighted) {
  //     map.setFeatureState({ source: 'data', sourceLayer: 'communes', id: this.highlighted }, { hover: false })
  //   }

  //   this.highlighted = feature.id
  //   map.setFeatureState({ source: 'data', sourceLayer: 'communes', id: this.highlighted }, { hover: true })

  //   if (filteredCodesCommmune.length === 0 || filteredCodesCommmune.includes(feature.properties.code)) {
  //     popup.setLngLat(event.lngLat)
  //       .setHTML(popupHTML(feature.properties))
  //       .addTo(map)
  //   }
  //   else {
  //     popup.remove()
  //   }
  // }

  // const onMouseLeave = () => {
  //   const canvas = map.getCanvas()
  //   canvas.style.cursor = ''

  //   if (this.highlighted) {
  //     map.setFeatureState({ source: 'data', sourceLayer: 'communes', id: this.highlighted }, { hover: false })
  //   }

  //   popup.remove()
  // }

  // const onClick = (layer, event) => {
  //   const [feature] = event.features
  //   Router.push(`/commune/${feature.id}`)
  // }

  // const onWheel = () => {
  //   if (this.state.zoomActivated) {
  //     this.setState({ warningZoom: false })
  //   }
  //   else {
  //     this.setState({ warningZoom: true })
  //   }
  // }

  useEffect(() => {
    setCurrentCenter(center)
    // map.set
    // setSources(sources)
    // setLayers(layers)

    // map.once('load', () => {
    //   map.doubleClickZoom.disable()
    //   map.on('mousemove', 'bal-polygon-fill', this.onMouseMove.bind(this, 'bal-polygon-fill'))
    //   map.on('mouseleave', 'bal-polygon-fill', this.onMouseLeave.bind(this, 'bal-polygon-fill'))
    //   map.on('wheel', this.onWheel.bind(this))
    //   map.on('click', 'bal-polygon-fill', this.onClick.bind(this, 'bal-polygon-fill'))
    // })

    // return () => {
    //   map.off('styledata', this.onStyleData)
    //   map.off('mousemove', 'bal-polygon-fill', this.onMouseMove.bind(this, 'bal-polygon-fill'))
    //   map.off('mouseleave', 'bal-polygon-fill', this.onMouseLeave.bind(this, 'bal-polygon-fill'))
    //   map.off('wheel', this.onWheel.bind(this))
    //   map.off('click', 'bal-polygon-fill', this.onClick.bind(this, 'bal-polygon-fill'))
    // }
  }, [])

  return (
    <StyledWrapper>
      {/* <SelectPaintLayer
        options={paintLayers}
        selected={this.props.selectedPaintLayer}
        handleSelect={this.props.setSelectedPaintLayer}
      >
        {
          paintLayers[this.props.selectedPaintLayer].legend.map(l => (
            <MapLegends key={l.title} title={l.title} legend={l.content} />
          ))
        }
      </SelectPaintLayer> */}

      {/* {this.state.warningZoom && (
        <div className="warning">
          <AlertTriangle color="orange" alt="Avertissement" />
          <div className="warning-text">
            Double-cliquez sur la carte pour activer le zoom
          </div>
        </div>
      )} */}
    </StyledWrapper>
  )
}
