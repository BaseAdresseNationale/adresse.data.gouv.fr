import React from 'react'
import hoist from 'hoist-non-react-statics'

import Meta from '../meta'
import MainPage from '../../layouts/main'

import Notification from '../notification'

import theme from '../../styles/theme'

function isWebglSupported() {
  try {
    const canvas = document.createElement('canvas')

    return Boolean(window.WebGLRenderingContext) && (
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    )
  } catch (err) {
    return false
  }
}

export default Page => {
  const Extended = hoist(class extends React.Component {
    render() {
      if (isWebglSupported()) {
        return (
          <Page {...this.props} />
        )
      }

      return (
        <MainPage>
          <Meta title='Attention' description='L’accélération matérielle n’est pas activée sur votre navigateur' />

          <div className='webgl-error'>
            <Notification type='warning'>
              <div>
                <p>L’accélération matérielle n’est pas activée sur votre navigateur, or celle-ci est nécessaire à l’affichage de cette page.</p>
                <p>La plupart du temps cela signifie que vous utilisez un navigateur obsolète ou que cette fonctionnalité a été désactivée volontairement.</p>
                <p>Nous sommes désolé pour le désagrément. N’hésitez pas à <a href='mailto:adresse@data.gouv.fr'>nous contacter</a> pour plus d’informations.</p>
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
    }
  }, Page)

  return Extended
}
