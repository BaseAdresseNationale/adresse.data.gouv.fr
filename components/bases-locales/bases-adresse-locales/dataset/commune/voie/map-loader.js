import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import LoadingContent from '../../../../../loading-content'

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: 'whitesmoke'
}

class NumerosMap extends React.Component {
  state = {
    showMap: false
  }

  componentWillMount() {
    this.NumerosMap = dynamic(import('./numeros-map'), {
      ssr: false,
      loading: () => (
        <div style={loadingStyle}>
          <LoadingContent loading>
            Chargement…
          </LoadingContent>
        </div>
      )
    })

    this.setState({showMap: true})
  }

  render() {
    const {showMap} = this.state
    const {numeros} = this.props
    const {NumerosMap} = this

    return showMap && <NumerosMap numeros={numeros} />
  }
}

NumerosMap.propTypes = {
  numeros: PropTypes.array.isRequired
}

export default NumerosMap
