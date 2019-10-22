import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

import Container from '../../container'
import Notification from '../../notification'

import BaseAdresseLocale from './base-adresse-locale'

class BasesAdresseLocales extends React.Component {
  render() {
    const {datasets} = this.props

    return (
      <>
        <Notification isFullWidth>
          <div>Ne sont répertoriés que les jeux de données référencés sur <a href='https://www.data.gouv.fr'>data.gouv.fr</a> provenant d’une organisation certifiée et comportant le tag <div className='tag'>base-adresse-locale</div>.</div>
        </Notification>
        <Container>
          <div className='bases'>
            {datasets.map(dataset => (
              <BaseAdresseLocale key={dataset.id} dataset={dataset} />
            ))}
          </div>
        </Container>

        <style jsx>{`
          .bases {
            display: grid;
            grid-row-gap: 2em;
            margin: 4em 0;
          }

          .tag {
            display: inline;
            background-color: ${theme.primary};
            color: ${theme.colors.white};
            padding: .2em .6em .3em;
            font-size: 75%;
            font-weight: 700;
            line-height: 1;
            text-align: center;
            white-space: nowrap;
            vertical-align: baseline;
            border-radius: .25em;
          }
          `}</style>
      </>
    )
  }

  static propTypes = {
    datasets: PropTypes.array.isRequired
  }
}

export default BasesAdresseLocales
