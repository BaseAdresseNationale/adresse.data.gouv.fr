import React from 'react'
import PropTypes from 'prop-types'

import {spaceThousands} from '../../../../../lib/format-numbers'

import Preview from '../preview'

class CommunesPreview extends React.Component {
  static propTypes = {
    commune: PropTypes.shape({
      dateMAJ: PropTypes.string.isRequired,
      voiesCount: PropTypes.number.isRequired,
      numerosCount: PropTypes.number.isRequired,
      population: PropTypes.number.isRequired,
      contour: PropTypes.object
    }).isRequired
  }

  componentWillMount() {
    const {commune} = this.props
    const {voiesCount, numerosCount, population, dateMAJ} = commune

    this.infos = [
      {title: 'Dernière mise à jour', value: dateMAJ || 'inconnue'},
      {title: 'Nombre de Voies', value: spaceThousands(voiesCount)},
      {title: 'Nombre d’adresses', value: spaceThousands(numerosCount)},
      {title: 'Habitants', value: spaceThousands(population)}
    ]
  }

  render() {
    const {contour} = this.props.commune

    return (
      <Preview
        infos={this.infos}
        geojson={contour} />
    )
  }
}

export default CommunesPreview
