import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import {numerosToGeoJson, positionToponymeToFeatureCollection} from '../../../../../../lib/geojson'

import theme from '../../../../../../styles/theme'

import AddressesMap from '../../../../../mapbox/addresses-map'
import Tag from '../../../../../tag'
import Mapbox from '../../../../../mapbox'

import Item from '../../item'

const VoiePreview = ({voie}) => {
  const [toponyme, setToponyme] = useState(null)
  const [numeros, setNumeros] = useState(null)
  const [bbox, setBbox] = useState(null)

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
      </div>
      }

      {voie.position && !numeros && (
        <>
          <div><b>Sources</b> :</div>
          <div className='sources'>
            {voie.position.source.length > 0 && (
              voie.position.source.map(source => source && <Tag key={source} type={source} />)
            )}
          </div>
        </>
      )}

      {voie.numeros && voie.numeros.length && (
        <div>
          <h4>Liste des numéros présents dans le fichier</h4>
          <div className='table'>
            {voie.numeros.map(numero => {
              const types = numero.positions.map(position => position.type)
              return (
                <Item
                  key={numero.id}
                  id={numero.id}
                  name={numero.numeroComplet}
                >
                  <div className='infos'>
                    <div className='sources'>
                      {types.length > 0 ?
                        types.map(type => {
                          return (type && <Tag key={type} type={type} />)
                        }) :
                        'Type non renseigné'}
                    </div>
                    <div className='sources'>
                      {numero.source.length > 0 && (
                        numero.source.map(source => source && <Tag key={source} type={source} />)
                      )}
                    </div>
                  </div>
                </Item>
              )
            })}
          </div>
        </div>
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
