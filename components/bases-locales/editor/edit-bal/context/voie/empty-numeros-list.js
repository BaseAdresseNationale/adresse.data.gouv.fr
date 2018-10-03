import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../../styles/theme'

import CreateNumeroWrapper from './create-numero-wrapper'

class EmptyVoiesList extends React.Component {
  static propTypes = {
    addNumero: PropTypes.func.isRequired,
    bounds: PropTypes.object
  }

  static defaultProps = {
    bounds: null
  }

  addNumero = async numero => {
    const {addNumero} = this.props

    await addNumero(numero)
  }

  render() {
    const {bounds} = this.props

    return (
      <div className='no-voie'>
        <CreateNumeroWrapper
          bounds={bounds}
          submit={this.addNumero}
        />

        <style jsx>{`
          .no-voie {
            display: flex;
            flex-direction: column;
            border: 2px dashed ${theme.border};
            padding: 1em;
          }
      `}</style>
      </div>
    )
  }
}

export default EmptyVoiesList
