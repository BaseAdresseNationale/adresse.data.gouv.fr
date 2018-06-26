import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'next/router'
import {deburr} from 'lodash'

import Preview from '../preview'

class CommunesPreview extends React.Component {
  static propTypes = {
    commune: PropTypes.shape({
      voies: PropTypes.array.isRequired,
      voiesCount: PropTypes.number.isRequired,
      numerosCount: PropTypes.number.isRequired,
      population: PropTypes.number.isRequired,
      contour: PropTypes.object
    }).isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
      query: PropTypes.object.isRequired
    }).isRequired
  }

  goto = codeVoie => {
    const {router} = this.props
    const {id, codeCommune} = router.query
    router.push(`/bases-locales/jeux-de-donnees/${id}/${codeCommune}/${codeVoie}`)
  }

  render() {
    const {voies, voiesCount, numerosCount, population, contour} = this.props.commune
    const counters = [
      {name: 'Voies', value: voiesCount},
      {name: 'Adresses', value: numerosCount},
      {name: 'Population', value: population}
    ]

    return (
      <Preview
        counters={counters}
        list={voies}
        filter={(voie, input) => deburr(voie.nomVoie.toLowerCase()).includes(input)}
        geojson={contour}
        toItem={voie => {
          return {
            id: voie.codeVoie,
            name: voie.nomVoie,
            link: this.goto,
            info: {title: voie.numerosCount > 1 ? 'numéros' : 'numéro', value: voie.numerosCount}
          }
        }} />
    )
  }
}

export default withRouter(CommunesPreview)
