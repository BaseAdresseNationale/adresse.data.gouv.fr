import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import {numerosToGeoJson, positionToponymeToFeatureCollection} from '@/lib/geojson'

import theme from '@/styles/theme'

import AddressesMap from '@/components/mapbox/addresses-map'
import Mapbox from '@/components/mapbox'

import TableList from '@/components/table-list'
import LoadingContent from '@/components/loading-content'
import Tag from '@/components/tag'

import BalTypes from './bal-types'

function VoiePreview({voie}) {
  const [toponyme, setToponyme] = useState(null)
  const [numeros, setNumeros] = useState(null)
  const [bbox, setBbox] = useState(null)
  const [loading, setLoading] = useState(true)
  const cols = {
    numero: {
      title: 'Numéro',
      sortBy: 'numeric',
      getValue: item => item.numero
    },
    type: {
      title: 'Type',
      sortBy: 'alphabetical',
      getValue: numero => <BalTypes key={numero.id} positions={numero.positions} />
    },
    sources: {
      title: 'Source',
      getValue: numero => <Tag key={numero.source} type={numero.source} style={{display: 'inline-flex'}} />,
      sortBy: 'alphabetical'
    }
  }

  useEffect(() => {
    if (voie.position) {
      const toponyme = positionToponymeToFeatureCollection({...voie, ...voie.position})
      setToponyme(toponyme)
    }

    if (voie.numeros) {
      const numeros = numerosToGeoJson(voie.numeros)
      setNumeros(numeros)
    }
  }, [voie])

  useEffect(() => {
    setBbox(toponyme || numeros)
    setLoading(false)
  }, [numeros, toponyme])

  return (
    <div className='voie-preview-container'>

      {(numeros || toponyme) &&
      <div className='voie-preview-map'>
        <Mapbox bbox={computeBbox(bbox)} switchStyle>
          {({...mapboxProps}) => (
            <AddressesMap
              {...mapboxProps}
              voies={toponyme}
              numeros={numeros}
            />
          )}
        </Mapbox>
      </div>}
      {voie.numerosCount > 0 && (
        <LoadingContent loading={loading}>
          <TableList
            title='Adresses de la voie'
            subtitle={voie.numerosCount === 1 ? `${voie.numerosCount} adresse répertoriée` : `${voie.numerosCount} adresses répertoriées`}
            list={voie.numeros}
            filters={{type: 'Type', source: 'Source'}}
            textFilter={item => item.numero}
            cols={cols}
          />
        </LoadingContent>
      )}
      <style jsx>{`
          .voie-preview-container {
            margin: 1em 0;
          }

          .voie-preview-map {
            height: 500px;
            margin: 1em 0;
          }

          h4 {
            background-color: ${theme.primary};
            color: ${theme.colors.white};
            padding: 1em;
            margin-bottom: 0;
          }

          .table {
            width: 100;
            display: flex;
            flex-direction: column;
          }

          .infos {
            display: flex;
            justify-content: space-between;
          }

          .sources {
            display: flex;
          }

          @media (max-width: 700px) {
            .infos {
              flex-direction: column;
              margin-top: 1em;
            }

            .sources {
              margin-top: 0.5em;
              margin-left: -2px;
              flex-flow: wrap;
            }
          }
        `}</style>
    </div>
  )
}

VoiePreview.propTypes = {
  voie: PropTypes.shape({
    position: PropTypes.object,
    numeros: PropTypes.array.isRequired,
    numerosCount: PropTypes.number.isRequired
  }).isRequired
}

export default VoiePreview
