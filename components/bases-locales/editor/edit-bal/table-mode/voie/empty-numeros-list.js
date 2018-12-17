import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../../styles/theme'

import CreateNumero from './create-numero'

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
        <CreateNumero
          bounds={bounds}
          onSubmit={this.addNumero}
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
