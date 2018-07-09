import React from 'react'
import PropTypes from 'prop-types'

import {spaceThousands} from '../../../../../../lib/format-numbers'

import theme from '../../../../../../styles/theme'

import Notification from '../../../../../notification'
import Tag from '../../../../../tag'

import Item from '../../item'

import MapLoader from './map-loader'

class VoiePreview extends React.Component {
  static propTypes = {
    voie: PropTypes.shape({
      numeros: PropTypes.array,
      position: PropTypes.object,
      numerosCount: PropTypes.number.isRequired,
      dateMAJ: PropTypes.string.isRequired
    }).isRequired
  }

  componentWillMount() {
    const {voie} = this.props
    const {numerosCount, dateMAJ} = voie

    this.infos = [
      {title: 'Dernière mise à jour', value: dateMAJ || 'inconnue'},
      {title: 'Nombre d’adresses', value: spaceThousands(numerosCount)}
    ]
  }

  render() {
    const {numeros, position} = this.props.voie

    return (
      <div className='container'>

        {(numeros || position) &&
          <div className='map'>
            <MapLoader numeros={numeros} position={position} />
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
                        name={numero.numeroComplet}>
                        <div className='infos'>
                          <div className='sources'>
                            {types.length > 0 ?
                              types.map(type => {
                                return (type && <Tag key={type} type={type} />)
                              }) :
                              'Type non renseigné'}
                          </div>
                          <div className='sources'>
                            {numero.source.map(source => <Tag key={source} type={source} />)}
                          </div>
                        </div>
                      </Item>
                    )
                  })}
                </div>
              </div>}
          </div> :
          <Notification type='warning' message='Ce lieu nommé ne possède pas encore de position renseignée.' />
        }

        <style jsx>{`
          .container {
            margin: 1em 0;
          }

          h4 {
            background-color: ${theme.primary};
            color: ${theme.colors.white};
            padding: 1em;
            margin-bottom: 0;
          }

          .map {
            width: 100%;
            height: 500px;
            margin: 1em 0;
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
