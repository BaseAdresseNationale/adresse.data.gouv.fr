import React from 'react'
import PropTypes from 'prop-types'

import Select from '../../../../../select'
import Notification from '../../../../../notification'

const TYPES = {
  entrée: 'Identifie l’entrée principale d’un bâtiment ou un portail.',
  'délivrance postale': 'Identifie un point de délivrance postale (boîte aux lettres)',
  bâtiment: 'Identifie un bâtiment ou une partie de bâtiment.',
  'cage d’escalier': 'identifie une cage d’escalier, en temps normal à l’intérieur d’un bâtiment.',
  logement: 'identifie un logement ou une pièce à l’intérieur d’un bâtiment.',
  parcelle: 'Identifie une parcelle cadastrale.',
  segment: 'Position dérivée du segment de la voie de rattachement.',
  'service technique': 'Identifie un point d’accès technique(ex: local disposant d’organe de coupure eau, électricité, gaz, etc)'
}

class SelectPositionType extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    onSubmit: PropTypes.func.isRequired
  }

  static defaultProps= {
    type: 'entrée'
  }

  handleChange = value => {
    const {onSubmit} = this.props
    onSubmit(value)
  }

  render() {
    const {type} = this.props

    return (
      <>
        <Select
          value={type}
          options={Object.keys(TYPES)}
          onSubmit={this.handleChange}
        />

        <Notification type='info'>
          {TYPES[type]}
        </Notification>
      </>
    )
  }
}

export default SelectPositionType
