import React from 'react'
import PropTypes from 'prop-types'

import Head from '../../preview/head'
import Item from '../../preview/item'

import Tag from '../../../../../explorer/tag'

import MapLoader from './map-loader'

class VoiePreview extends React.Component {
  static propTypes = {
    voie: PropTypes.shape({
      numeros: PropTypes.array.isRequired,
      numerosCount: PropTypes.number.isRequired
    }).isRequired
  }

  render() {
    const {numeros, numerosCount} = this.props.voie
    const counters = [{name: 'Adresses', value: numerosCount}]

    return (
      <div className='container'>
        <Head counters={counters} />

        <div className='map'>
          <MapLoader numeros={numeros} />
        </div>

        <div className='content'>
          <div className='table'>
            {numeros.length ?
              numeros.map(numero => {
                const types = numero.positions.map(position => position.type)
                return (
                  <Item
                    key={numero.id}
                    id={numero.id}
                    name={numero.numeroComplet}
                    link={() => {}}
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

          .content {
            display: flex;
            flex-direction: column;
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
