import React from 'react'
import PropTypes from 'prop-types'

import {contoursToGeoJson} from '../../../../lib/geojson'
import {spaceThousands} from '../../../../lib/format-numbers'

import Preview from './preview'

class CommunesPreview extends React.Component {
  static propTypes = {
    dataset: PropTypes.shape({
      id: PropTypes.string.isRequired,
      lastUpdate: PropTypes.string.isRequired,
      licenseLabel: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      valid: PropTypes.bool,
      error: PropTypes.object
    }).isRequired,
    summary: PropTypes.shape({
      communes: PropTypes.array.isRequired,
      communesCount: PropTypes.number.isRequired,
      voiesCount: PropTypes.number.isRequired,
      numerosCount: PropTypes.number.isRequired
    }).isRequired
  }

  componentWillMount() {
    const {dataset, summary} = this.props
    const {communesCount, voiesCount, numerosCount} = summary
    const {licenseLabel, lastUpdate} = dataset

    this.infos = [
      {title: 'Format', value: 'BAL 1.1'},
      {title: 'Licence', value: licenseLabel},
      {title: 'Dernière mise à jour', value: lastUpdate || 'inconnue'},
      {title: 'Nombre de Communes', value: spaceThousands(communesCount)},
      {title: 'Nombre de Voies', value: spaceThousands(voiesCount)},
      {title: 'Nombre d’adresses', value: spaceThousands(numerosCount)}
    ]
  }

  render() {
    const {dataset, summary} = this.props
    const {id, status, valid, error} = dataset
    const communesContour = contoursToGeoJson(summary.communes)

    return (
      <Preview
        infos={this.infos}
        report={{id, status, valid, error}}
        geojson={communesContour} />
    )
  }
}

export default CommunesPreview
