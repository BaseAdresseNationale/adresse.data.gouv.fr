import React from 'react'
import dynamic from 'next/dynamic'

import {isWebGLSupported} from '../../lib/browser/webgl'

import Meta from '../meta'
import MainPage from '../../layouts/main'

import Loader from '../loader'
import Notification from '../notification'

import theme from '../../styles/theme'

const MapLoader = () => (
  <div className='container'>
    <div className='centered'>
      <Loader />
      <p>Chargement…</p>
    </div>
    <style jsx>{`
      .container {
        width: 100%;
        height: 100%;
        min-height: 600px;
        background: ${theme.backgroundGrey};
      }

      .centered {
        position: absolute;
        top: 25%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `}</style>
  </div>
)

const NoWebglError = () => (
  <MainPage>
    <Meta title='Attention' description='L’accélération matérielle n’est pas activée sur votre navigateur' />

    <div className='webgl-error'>
      <Notification type='warning'>
        <div>
          <p>L’accélération matérielle n’est pas activée sur votre navigateur, or celle-ci est nécessaire à l’affichage de cette page.</p>
          <p>La plupart du temps cela signifie que vous utilisez un navigateur obsolète ou que cette fonctionnalité a été désactivée volontairement.</p>
          <p>Nous sommes désolés pour le désagrément. N’hésitez pas à <a href='mailto:adresse@data.gouv.fr'>nous contacter</a> pour plus d’informations.</p>
        </div>
      </Notification>
    </div>

    <style jsx>{`
        .webgl-error {
          margin: 100px auto;
          width: 80%;
        }

        a {
          text-decoration: underline;
          color: ${theme.warningBorder};
        }
      `}</style>
  </MainPage>
)

class MapWrapper extends React.PureComponent {
  state = {
    showMap: false
  }

  componentDidMount() {
    this.MapComponent = isWebGLSupported() ? dynamic(import('./map' /* webpackChunkName: "mapbox-gl" */), {
      ssr: false,
      loading: () => (
        <MapLoader />
      )
    }) : () => (
      <NoWebglError />
    )

    this.setState({
      showMap: true
    })
  }

  render() {
    const {...props} = this.props
    const {showMap} = this.state

    if (showMap) {
      const {MapComponent} = this
      return <MapComponent {...props} />
    }

    return <MapLoader />
  }
}

export default MapWrapper
