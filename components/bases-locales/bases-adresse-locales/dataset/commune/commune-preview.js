import React from 'react'
import PropTypes from 'prop-types'

import {spaceThousands} from '../../../../../lib/format-numbers'

import Preview from '../preview'

import Meta from '../../meta'

class CommunesPreview extends React.Component {
  static propTypes = {
    commune: PropTypes.shape({
      dateMAJ: PropTypes.string.isRequired,
      source: PropTypes.array.isRequired,
      voiesCount: PropTypes.number.isRequired,
      numerosCount: PropTypes.number.isRequired,
      population: PropTypes.number.isRequired,
      contour: PropTypes.object
    }).isRequired
  }

  constructor(props) {
    super(props)

    const {voiesCount, numerosCount, population, dateMAJ} = props.commune

    this.infos = [
      {title: 'Dernière mise à jour', value: dateMAJ || 'inconnue'},
      {title: 'Nombre de Voies', value: spaceThousands(voiesCount)},
      {title: 'Nombre d’adresses', value: spaceThousands(numerosCount)},
      {title: 'Habitants', value: spaceThousands(population)}
    ]
  }

  render() {
    const {contour, source} = this.props.commune

    return (
      <Preview geojson={contour}>
        <Meta infos={this.infos} sources={source} />
      </Preview>
    )
  }
}

export default CommunesPreview
