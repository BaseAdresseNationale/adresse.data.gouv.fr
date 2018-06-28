import React from 'react'
import PropTypes from 'prop-types'

import {spaceThousands} from '../../../../../../lib/format-numbers'

import Item from '../../item'

import Tag from '../../../../../explorer/tag'

import MapLoader from './map-loader'

class VoiePreview extends React.Component {
  static propTypes = {
    voie: PropTypes.shape({
      numeros: PropTypes.array.isRequired,
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
    const {numeros} = this.props.voie

    return (
      <div className='container'>

        <div className='map'>
          <MapLoader numeros={numeros} />
        </div>

        <div>
          <h4>Liste des numéros présents dans le fichier</h4>
          <div className='table'>
            {numeros.length ?
              numeros.map(numero => {
                const types = numero.positions.map(position => position.type)
                return (
                  <Item
                    key={numero.id}
                    id={numero.id}
                    name={numero.numeroComplet}
                    info={{
                      title: types.length > 0 ? ' ' : 'Type non renseigné',
                      value: types.map(type => {
                        return (type && <Tag key={type} type={type} />)
                      })
                    }} />
                )
              }) :
              <div>Aucun résultat</div>}
          </div>
        </div>

        <style jsx>{`
          .container {
            margin: 1em 0;
          }

          .communes {
            width: 100%;
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
        `}</style>
      </div>
    )
  }
}

export default VoiePreview
