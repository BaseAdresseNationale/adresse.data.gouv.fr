import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import Meta from '@/components/meta'
import Page from '@/layouts/main'

const messages = {
  500: 'Une erreur imprévue s’est produite',
  404: 'La page demandée n’a pas pu être trouvée'
}

class ErrorPage extends React.Component {
  static propTypes = {
    code: PropTypes.number,
    message: PropTypes.string
  }

  static defaultProps = {
    code: 500,
    message: null
  }

  static getInitialProps({res, err}) {
    const code = res ? res.statusCode : (err ? err.statusCode : null)

    return {code}
  }

  render() {
    const {code, message} = this.props
    const title = `Erreur ${code}`
    const message_ = code === 500 ? messages[500] : message || messages[code]

    return (
      <Page>
        <Meta title={title} description={message_} />

        <div>
          <section>
            <h1>{title}</h1>
            <h2>{message_}</h2>
          </section>
        </div>

        <style jsx>{`
          div {
            margin: 7em 15px 2em;
            text-align: center;
          }

          section {
            padding: 2em;
            box-shadow: 0 1px 4px ${theme.boxShadow};
          }

          h1 {
            font-size: 24px;
            fontWeight: 500;
          }

          h2 {
            margin: 0;
            font-size: 14px;
            font-weight: normal;
          }

          @media (min-width: ${theme.breakPoints.tablet}) {
            div {
              display: flex;
              flex: 1;
              align-items: center;
              justify-content: center;
            }

            section {
              display: flex;
              align-items: center;
            }

            h1 {
              margin: 0 20px 0 0;
              border-right: 1px solid rgba(0, 0, 0,.3);
              padding: 10px 20px 10px 0;
            }
          }
        `}</style>
      </Page>
    )
  }
}

export default ErrorPage
