import React from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import {numerosToGeoJson} from '../../../../../../lib/geojson'

import theme from '../../../../../../styles/theme'

import AddressesMap from '../../../../../mapbox/addresses-map'
import Notification from '../../../../../notification'
import Tag from '../../../../../tag'
import Mapbox from '../../../../../mapbox'

import Item from '../../item'

class VoiePreview extends React.Component {
  static propTypes = {
    voie: PropTypes.object.isRequired
  }

  render() {
    const {numeros, position} = this.props.voie
    const data = numeros ? numerosToGeoJson(numeros) : {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: position.coords
      },
      properties: {
        source: position.source,
        type: position.type,
        dateMAJ: position.dateMAJ
      }
    }

    return (
      <div className='voie-preview-container'>

        {(numeros || position) &&
          <div className='voie-preview-map'>
            <Mapbox bbox={computeBbox(data)} switchStyle>
              {({...mapboxProps}) => (
                <AddressesMap
                  {...mapboxProps}
                  numeros={data}
                />
              )}
            </Mapbox>
          </div>
        }

        {numeros || position ?
          <div>
            {numeros && numeros.length &&
              <div>
                <h4>Liste des numéros présents dans le fichier</h4>
                <div className='table'>
                  {numeros.map(numero => {
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
              </div>}
          </div> :
          <Notification type='warning' message='Ce toponyme ne possède pas encore de position renseignée.' />
        }

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
}

export default VoiePreview
