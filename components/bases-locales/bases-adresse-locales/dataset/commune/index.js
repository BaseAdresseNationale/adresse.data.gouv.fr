import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'next/router'

import theme from '../../../../../styles/theme'

import Header from '../header'

import Breadcrumb from './breadcrumb'
import CommunePreview from './commune-preview'

class Commune extends React.Component {
  static propTypes = {
    dataset: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      organization: PropTypes.object.isRequired,
      page: PropTypes.string.isRequired
    }).isRequired,
    commune: PropTypes.object.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
      query: PropTypes.object.isRequired
    }).isRequired
  }

  render() {
    const {dataset, commune} = this.props
    const {id, title, organization} = dataset

    return (
      <div>
        <Breadcrumb links={[{link: title, href: `/bases-locales/jeux-de-donnees/${id}`}]} current={commune.nom} />

        <Header
          name={commune.nom}
          logo={organization && organization.logo} />

        <CommunePreview commune={commune} />
        <style jsx>{`
          h4 {
            background-color: ${theme.primary};
            color: ${theme.colors.white};
            padding: 1em;
            margin-bottom: 0;
          }

          .voies {
            margin-top: 2em;
          }

          .infos {
            display: flex;
            justify-content: space-between;
          }

          .counter {
            margin: 0 1em;
          }

          .sources {
            display: flex;
          }

          .namedPlace {
            display: flex;
            align-items: center;
            color: ${theme.errorBorder};
            margin: 0 1em;
          }

          .namedPlace span {
            margin-left: 0.5em;
          }

          @media (max-width: 700px) {
            .infos {
              flex-direction: column;
              margin-top: 1em;
            }

            .counter {
              margin: 0;
            }

            .sources {
              margin-top: 0.5em;
              margin-left: -2px;
              flex-flow: wrap;
            }

            .namedPlace {
              margin: 0;
            }
        `}</style>
      </div>
    )
  }
}

export default withRouter(Commune)
