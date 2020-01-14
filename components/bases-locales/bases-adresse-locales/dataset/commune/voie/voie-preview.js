import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import computeBbox from '@turf/bbox'

import {numerosToGeoJson, positionToponymeToFeatureCollection} from '../../../../../../lib/geojson'

import theme from '../../../../../../styles/theme'

import AddressesMap from '../../../../../mapbox/addresses-map'
import Mapbox from '../../../../../mapbox'

import TableList from '../../../../../table-list'
import LoadingContent from '../../../../../loading-content'
import BalTypes from './bal-types'

const VoiePreview = ({voie}) => {
  const [toponyme, setToponyme] = useState(null)
  const [numeros, setNumeros] = useState(null)
  const [bbox, setBbox] = useState(null)
  const [loading, setLoading] = useState(true)
  const headers = [
    {title: 'Numéro'},
    {title: 'Type'}
  ]

  const handleSelect = voie => {
    const {id, codeCommune, codeVoie} = Router.query
    const href = `/bases-locales/jeux-de-donnees/voie?codeCommune=${codeCommune}&codeVoie=${codeVoie}${voie.values[0]}`
    const as = `/bases-locales/jeux-de-donnees/${id}/${codeCommune}/${codeVoie}/numero/${voie.values[0]}`
    Router.push(href, as)
  }

  const genItems = numeros => {
    return numeros.map(numero => {
      return {
        key: numero.id,
        values: [
          numero.numeroComplet,
          <BalTypes key={numero.id} positions={numero.positions} />
        ]
      }
    })
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
              onSelectNumero={handleSelect}
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
            headers={headers}
            handleSelect={handleSelect}
            genItems={genItems} />
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
  voie: PropTypes.object.isRequired
}

export default VoiePreview
