import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import {isWebGLSupported} from '../../../../../../lib/browser/webgl'

import LoadingContent from '../../../../../loading-content'
import NoWebglError from '../../../../../no-web-gl-error'

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: 'whitesmoke'
}

class NumerosMap extends React.Component {
  static propTypes = {
    numeros: PropTypes.array,
    position: PropTypes.object
  }

  state = {
    showMap: false
  }

  componentDidMount() {
    this.NumerosMap = isWebGLSupported() ? dynamic(import('./numeros-map'), {
      ssr: false,
      loading: () => (
        <div style={loadingStyle}>
          <LoadingContent loading>
            Chargement…
          </LoadingContent>
        </div>
      )
    }) : () => (
      <NoWebglError />
    )

    this.setState({
      showMap: true
    })
  }

  render() {
    const {showMap} = this.state
    const {numeros, position} = this.props
    const {NumerosMap} = this

    return showMap && <NumerosMap numeros={numeros} position={position} />
  }
}

export default NumerosMap
