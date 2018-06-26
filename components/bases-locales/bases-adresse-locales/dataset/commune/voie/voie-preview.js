import React from 'react'
import PropTypes from 'prop-types'
import {deburr} from 'lodash'

import {numerosToGeoJson} from '../../../../../../lib/geojson'

import Preview from '../../preview'

import Tag from '../../../../../explorer/tag'

class VoiePreview extends React.Component {
  static propTypes = {
    voie: PropTypes.shape({
      numeros: PropTypes.array.isRequired,
      numerosCount: PropTypes.number.isRequired
    }).isRequired
  }

  render() {
    const {numeros, numerosCount} = this.props.voie
    const counters = [{name: 'numeros', value: numerosCount}]
    const positions = numerosToGeoJson(numeros)

    return (
      <Preview
        counters={counters}
        list={numeros}
        filter={(voie, input) => deburr(voie.nomVoie.toLowerCase()).includes(input)}
        geojson={positions}
        toItem={numero => {
          const types = numero.positions.map(position => position.type)
          return {
            id: numero.id,
            name: numero.numeroComplet,
            link: () => {},
            info: {title: ' ', value: types.map(type => {
              return <Tag key={type} type={type} />
            })}
          }
        }}
        points />
    )
  }
}

export default VoiePreview
