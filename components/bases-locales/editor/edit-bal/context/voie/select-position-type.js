import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../../button'
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

  static defaultProps = {
    type: 'entrée'
  }

  constructor(props) {
    super(props)
    this.state = {
      type: props.type
    }
  }

  handleChange = e => {
    e.preventDefault()

    this.setState({type: e.target.value})
  }

  render() {
    const {type} = this.state
    const {onSubmit} = this.props

    return (
      <div>
        <div className='select'>
          <label>Type</label>
          <select value={type} onChange={this.handleChange}>
            {Object.keys(TYPES).map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <Notification type='info'>
          {TYPES[type]}
        </Notification>

        {type !== this.props.type && (
          <div className='centered'>
            <Button onClick={() => onSubmit(type)}>Appliquer</Button>
          </div>
        )}

        <style jsx>{`
          .centered {
            display: flex;
          }

          .select {
            margin-bottom: 1em;
          }

          select {
            text-transform: capitalize;
          }

          select option::first-letter{
            text-transform: uppercase;
          }
        `}</style>
      </div>
    )
  }
}

export default SelectPositionType
