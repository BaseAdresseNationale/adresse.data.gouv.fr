import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'next/router'
import {deburr} from 'lodash'

import {contoursToGeoJson} from '../../../../lib/geojson'

import Preview from './preview'

class CommunesPreview extends React.Component {
  static propTypes = {
    summary: PropTypes.shape({
      communes: PropTypes.array.isRequired,
      communesCount: PropTypes.number.isRequired,
      voiesCount: PropTypes.number.isRequired,
      numerosCount: PropTypes.number.isRequired
    }).isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
      query: PropTypes.object.isRequired
    }).isRequired
  }

  goto = codeCommune => {
    const {router} = this.props
    router.push(`/bases-locales/jeux-de-donnees/${router.query.id}/${codeCommune}`)
  }

  render() {
    const {communes, communesCount, voiesCount, numerosCount} = this.props.summary
    const communesContour = contoursToGeoJson(communes)
    const counters = [
      {name: 'Communes', value: communesCount},
      {name: 'Voies', value: voiesCount},
      {name: 'Adresses', value: numerosCount}
    ]

    return (
      <Preview
        counters={counters}
        list={communes}
        filter={(commune, input) => deburr(commune.nom.toLowerCase()).includes(input)}
        contour={communesContour}
        toItem={commune => {
          return {
            id: commune.code,
            name: commune.nom,
            link: this.goto,
            info: {title: 'habitants', value: commune.population}
          }
        }} />
    )
  }
}

export default withRouter(CommunesPreview)
